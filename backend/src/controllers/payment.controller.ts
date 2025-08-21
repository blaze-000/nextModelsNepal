import { Request, Response } from 'express';
import { Payment } from '../models/payment.model';
import { app, fonepay } from '../config/payment.config';
import { buildPaymentRequest, buildRedirectUrl, verifyReturnDv, verifyTransactionServerToServer } from '../service/payment.service';
import { paymentSchema } from '../validations/payment.validation';
import { FonepayRequestParams } from '../types/payment';
import { ContestantModel } from '../models/events.model';
import mongoose from 'mongoose';
import { incMetric } from '../utils/metrics';

// 1) Create Payment Session
export const payment = async (req: Request, res: Response) => {
  try {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const { contestant, vote, amount, prn, description, r1, r2 } = parsed.data;

    // Ensure unique PRN
    const actualPrn = prn ?? `prn_${Date.now()}`;

    const isExists = await ContestantModel.findById({ _id: contestant });
    if (!isExists) return res.status(404).send("Invalid contestant id.");

    // Save initial payment
    const payment = await Payment.create({
      prn: actualPrn,
      contestant,
      vote,
      amount,
      currency: 'NPR',
      pid: fonepay.pid,
      status: 'created',
      ri: description || 'Payment',
      r1: r1 || 'N/A',
      r2: r2 || 'N/A',
    });

    const ruAbsolute = `${app.baseUrl}/api/payments/fonepay/return`;

    const requestParams = buildPaymentRequest({
      prn: actualPrn,
      amount,
      ruAbsolute,
      ri: payment.ri!,
      r1: payment.r1!,
      r2: payment.r2!,
    });

    // store request DV and params
    payment.requestDv = requestParams.DV;
    payment.ru = requestParams.RU;
    payment.dt = requestParams.DT;
    payment.md = requestParams.MD;
    await payment.save();

    const redirectUrl = buildRedirectUrl(requestParams);

    return res.json({
      prn: actualPrn,
      redirectUrl,
    });
  } catch (error: any) {
    console.error("Error creating  payment");
    return res.status(500).json({
      success: false,
      message: "Failed to create payment"
    });
  }
};

// put this in your service file near buildPaymentRequest
export function getRequestStringToSign(p: FonepayRequestParams) {
  const values = {
    PID: p.PID, MD: p.MD, PRN: p.PRN, AMT: p.AMT, CRN: p.CRN,
    DT: p.DT, RI: p.RI, R1: p.R1, R2: p.R2, RU: p.RU
  };
  return ['PID', 'MD', 'PRN', 'AMT', 'CRN', 'DT', 'RI', 'R1', 'R2', 'RU']
    .map(k => (values as any)[k]).join(',');
}

export const getPaymentStatusByPrn = async (req: Request, res: Response) => {
  try {
    const { prn } = req.params;
    const payment = await Payment.findOne({ prn: `prn_${prn}` });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, status: payment.status });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to get payment" });
  }
};

export const getPaymentStatusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, payment });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to get payment" });
  }
};

export const getAllPayment = async (req: Request, res: Response) => {
  const payments = await Payment.find();
  res.status(200).json({ message: "successfully get payment:", payments });
}

// Return payment infromation
// This is called by Fonepay after payment completion   
export const returnPayment = async (req: Request, res: Response) => {
  try {
    const query = { ...(req.query as any), ...(req.body as any) };
    const { PRN } = query;

    if (!query.PRN || !query.PID || !query.DV) {
      return res.status(400).send("Missing required fields");
    }

    let prnToSearch = String(PRN);
    if (!prnToSearch.startsWith("prn_")) {
      prnToSearch = `prn_${prnToSearch}`;
    }

    const payment = await Payment.findOne({ prn: prnToSearch });
    if (!payment) return res.status(404).send("Unknown PRN");

    // Idempotency: if we've already verified this payment successfully, short-circuit
    if (payment.status === 'success' && payment.apiVerificationStatus === 'success') {
      return res.status(200).send(`Payment ${payment.status}. Thank you.`);
    }

    const { contestant } = payment;
    const isContestant = await ContestantModel.findById({ _id: contestant });

    if (!isContestant) return res.status(404).json({ message: "Invalid Contestant Id." });

    if (String(query.PID) !== payment.pid) {
      return res.status(400).send("PID mismatch");
    }

    const dvResult = verifyReturnDv(query);
  if (!dvResult.ok) {
      // If verifyReturnDv skipped (missing fields), continue to server-to-server verification,
      // otherwise treat as a DV mismatch.
      if (!dvResult.skipped) {
    payment.status = "error";
    payment.responseDv = String(query.DV || "");
    await payment.save();
    incMetric('dv_mismatch');
    return res.status(400).send("DV mismatch");
      }
      // else skipped: log and continue (S2S will be authoritative)
    }

    // Save preliminary return fields
    payment.ps = String(query.PS ?? "");
    payment.rc = String(query.RC ?? "");
    payment.uid = String(query.UID ?? "");
    payment.bc = String(query.BC ?? "");
    payment.ini = String(query.INI ?? "");
    payment.p_amt = String(query["P_AMT"] ?? "");
    payment.r_amt = String(query["R_AMT"] ?? "");
    payment.responseDv = String(query.DV || "");
    payment.status = "pending";
    await payment.save();

    // Verify with Fonepay API
    const body = {
      prn: payment.prn,
      merchantCode: payment.pid,
      amount: payment.p_amt || payment.amount.toFixed(2),
    };

    let apiRes;
    try {
      apiRes = await verifyTransactionServerToServer(body);
    } catch (err: any) {
      console.error('S2S verification failed:', err?.message || err);
      payment.apiResponse = { error: String(err?.message || err) };
      payment.apiVerificationStatus = 'failed';
      payment.status = 'pending';
      await payment.save();
      incMetric('s2s_fail');
      return res.status(502).send('Failed to verify transaction with gateway');
    }

    payment.apiResponse = apiRes.data;
    const payStatus = String(apiRes?.data?.paymentStatus || "").toLowerCase();
    const remoteAmount = String(apiRes?.data?.purchaseAmount || apiRes?.data?.purchaseAmount || "").trim();

    // Validate amount matches expected amount to avoid tampering
    const expectedAmount = payment.amount.toFixed(2);
    if (remoteAmount && remoteAmount !== expectedAmount) {
      // Amount mismatch: flag and don't credit
      payment.status = 'error';
      payment.apiVerificationStatus = 'failed';
      await payment.save();
      incMetric('amount_mismatch');
      return res.status(400).send('Amount mismatch');
    }

    if (payStatus === "success") {
      // Use a Mongo transaction to atomically mark payment success and credit votes
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const updated = await Payment.findOneAndUpdate(
          { _id: payment._id, apiVerificationStatus: { $ne: 'success' } },
          { $set: { status: 'success', apiVerificationStatus: 'success', apiResponse: apiRes.data } },
          { new: true, session }
        );

        if (updated) {
          await ContestantModel.findByIdAndUpdate(payment.contestant, { $inc: { votes: payment.vote } }, { session });
          await session.commitTransaction();
          incMetric('s2s_success');
        } else {
          // nothing to do (maybe already processed)
          await session.abortTransaction();
          incMetric('replay_attempt');
        }
      } catch (txErr) {
        console.error('Transaction error:', txErr);
        await session.abortTransaction();
        payment.status = 'error';
        payment.apiVerificationStatus = 'failed';
        await payment.save();
        incMetric('tx_fail');
      } finally {
        session.endSession();
      }

    } else if (payStatus === "failed") {
      payment.status = "failed";
      payment.apiVerificationStatus = "failed";
      await payment.save();
      incMetric('s2s_failed_status');
    } else {
      payment.status = "pending";
      payment.apiVerificationStatus = "pending";
      await payment.save();
      incMetric('s2s_pending_status');
    }

    return res.send(`Payment ${payment.status}. Thank you.`);
  } catch (error: any) {
    console.error("Error in returnPayment:", error);
    return res.status(500).json({ success: false, message: "Failed to process return" });
  }
};

