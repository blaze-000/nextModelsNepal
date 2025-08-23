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
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const { contestant, vote, amount, prn, description, r1, r2 } = parsed.data;
    const actualPrn = prn ?? `prn_${Date.now()}`;

    const isExists = await ContestantModel.findById(contestant);
    if (!isExists) {
      return res.status(404).send("Invalid contestant id.");
    }

    const payment = await Payment.create({
      prn: actualPrn,
      contestant,
      vote,
      amount,
      currency: 'NPR',
      pid: fonepay.pid,
      status: 'created',
      r1: r1 || '',
      r2: r2 || '',
    });

    const ruAbsolute = `${app.baseUrl}/api/fonepay/payment/return`;
    
    const requestParams = buildPaymentRequest({
      prn: actualPrn,
      amount,
      ruAbsolute,
      ri: '',  // Empty as per FonePay specification
      r1: payment.r1!,
      r2: payment.r2!,
    });

    payment.requestDv = requestParams.DV;
    payment.ru = requestParams.RU;
    payment.dt = requestParams.DT;
    payment.md = requestParams.MD;
    await payment.save();
    
    const redirectUrl = buildRedirectUrl(requestParams);
    
    return res.json({
      prn: actualPrn,
      redirectUrl
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message
    });
  }
};

export const getPaymentStatusByPrn = async (req: Request, res: Response) => {
  try {
    const { prn } = req.params;
    const searchPrn = prn.startsWith('prn_') ? prn : `prn_${prn}`;
    const payment = await Payment.findOne({ prn: searchPrn });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, status: payment.status });
  } catch (error: any) {
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
    res.status(500).json({ success: false, message: "Failed to get payment" });
  }
};

export const getAllPayment = async (req: Request, res: Response) => {
  const payments = await Payment.find();
  res.status(200).json({ message: "successfully get payment:", payments });
}

   
export const returnPayment = async (req: Request, res: Response) => {
  try {
    
    const query = { ...(req.query as any), ...(req.body as any) };
    const { PRN } = query;

    if (!query.PRN || !query.PID || !query.DV) {
      return res.status(400).json({
        message: "Missing required fields",
        isSuccess: false
      });
    }

    let prnToSearch = String(PRN);
    if (!prnToSearch.startsWith("prn_")) {
      prnToSearch = `prn_${prnToSearch}`;
    }

    const payment = await Payment.findOne({ prn: prnToSearch });
    if (!payment) {
      
      // Fallback: Search for recent payments (last 10 minutes) with similar amount
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentPayments = await Payment.find({
        createdAt: { $gte: tenMinutesAgo },
        status: 'created',
        amount: query.P_AMT ? parseFloat(query.P_AMT) : undefined
      }).sort({ createdAt: -1 }).limit(5);
      
      console.log('🔍 Found recent payments:', recentPayments.map(p => ({ prn: p.prn, amount: p.amount })));
      
      if (recentPayments.length === 0) {
        console.log('💀 No recent payments found for fallback');
        return res.status(404).json({
          message: "Unknown PRN - No recent payments found",
          isSuccess: false,
          prn: prnToSearch,
          suggestion: "Please create a new payment"
        });
      }
      
      // Use the most recent payment as fallback
      const fallbackPayment = recentPayments[0];
      console.log('🔄 Using fallback payment:', fallbackPayment.prn);
      
      return res.status(404).json({
        message: "Unknown PRN",
        isSuccess: false,
        prn: prnToSearch,
        fallback: {
          availablePrn: fallbackPayment.prn,
          suggestion: "PRN mismatch detected. Please use the correct PRN from your payment creation response."
        }
      });
    }

    if (payment.status === 'success' && payment.apiVerificationStatus === 'success') {
      return res.status(200).json({
        message: `Payment ${payment.status}. Thank you.`,
        isSuccess: true,
        status: payment.status
      });
    }

    const { contestant } = payment;
    const isContestant = await ContestantModel.findById(contestant);
    if (!isContestant) {
      return res.status(404).json({
        message: "Invalid Contestant Id.",
        isSuccess: false,
        contestant: contestant
      });
    }

    if (String(query.PID) !== payment.pid) {
      return res.status(400).json({
        message: "PID mismatch",
        isSuccess: false,
        expected: payment.pid,
        received: query.PID
      });
    }

    // Check payment status from FonePay response
    const paymentSuccess = String(query.PS || "").toLowerCase() === "true";
    const responseCode = String(query.RC || "");

    if (!paymentSuccess || responseCode === "failed") {
      console.log('❌ Payment failed at FonePay gateway');
      payment.status = "failed";
      payment.ps = String(query.PS ?? "");
      payment.rc = String(query.RC ?? "");
      payment.uid = String(query.UID ?? "");
      payment.bc = String(query.BC ?? "");
      payment.ini = String(query.INI ?? "");
      payment.p_amt = String(query["P_AMT"] ?? "");
      payment.r_amt = String(query["R_AMT"] ?? "");
      payment.responseDv = String(query.DV || "");
      await payment.save();

      return res.status(200).json({
        message: "Payment failed at FonePay gateway. Please try again.",
        isSuccess: false,
        status: "failed",
        responseCode: responseCode,
        reason: "FonePay rejected the payment",
        troubleshooting: {
          issue: "Payment failed before processing",
          possibleCauses: [
            "Data Validation Failed - incorrect DV hash",
            "Merchant account configuration issue",
            "Return URL not whitelisted",
            "Invalid merchant credentials"
          ],
          nextSteps: [
            "Verify merchant account is properly activated",
            "Check if return URL is whitelisted with FonePay",
            "Verify DV hash generation is correct",
            "Contact FonePay support for merchant configuration"
          ]
        }
      });
    }

    const dvResult = verifyReturnDv(query);

    if (!dvResult.ok) {
      if (!dvResult.skipped) {
        payment.status = "error";
        payment.responseDv = String(query.DV || "");
        await payment.save();
        incMetric('dv_mismatch');
        return res.status(400).json({
          message: "DV mismatch",
          isSuccess: false,
          provided: query.DV,
          expected: "(calculated)"
        });
      }
    }

    if (paymentSuccess && responseCode === "00") {
      if (fonepay.mode === "dev") {
        payment.status = "success";
        payment.apiVerificationStatus = "skipped";
        await payment.save();

        await ContestantModel.findByIdAndUpdate(payment.contestant, { $inc: { votes: payment.vote } });

        return res.status(200).json({
          message: "Payment successful. Thank you!",
          isSuccess: true,
          status: "success",
          prn: payment.prn,
          amount: payment.amount,
          votes: payment.vote,
          contestant: payment.contestant,
          mode: "development",
          environment: "NBQM Sandbox",
          timestamp: new Date().toISOString()
        });
      }
    } else {
      payment.status = "failed";
      await payment.save();

      return res.status(200).json({
        message: "Payment failed. Please try again.",
        isSuccess: false,
        status: "failed",
        responseCode: responseCode
      });
    }

    const body = {
      prn: payment.prn,
      merchantCode: payment.pid,
      amount: payment.p_amt || payment.amount.toFixed(2),
    };

    let apiRes;
    try {
      apiRes = await verifyTransactionServerToServer(body);
    } catch (err: any) {
      payment.apiVerificationStatus = fonepay.mode === "dev" ? "skipped" : "failed";
      await payment.save();
      return res.status(fonepay.mode === "dev" ? 200 : 502).json({
        message: `Payment ${fonepay.mode === "dev" ? "processed (dev, no S2S)" : "pending verification"}.`,
        isSuccess: fonepay.mode === "dev",
        status: payment.status
      });
    }

    payment.apiResponse = apiRes.data;
    const payStatus = String(apiRes?.data?.paymentStatus || "").toLowerCase();

    if (payStatus === "success" || !fonepay.apiUser) {
      payment.status = "success";
      payment.apiVerificationStatus = "skipped";
      await payment.save();

      await ContestantModel.findByIdAndUpdate(payment.contestant, { $inc: { votes: payment.vote } });

      return res.status(200).json({
        message: "Payment success (redirect only). Thank you.",
        isSuccess: true,
        status: "success"
      });
    }

    const remoteAmount = String(apiRes?.data?.purchaseAmount || apiRes?.data?.purchaseAmount || "").trim();
    const expectedAmount = payment.amount.toFixed(2);
    if (remoteAmount && remoteAmount !== expectedAmount) {
      payment.status = 'error';
      payment.apiVerificationStatus = 'failed';
      await payment.save();
      incMetric('amount_mismatch');
      return res.status(400).json({
        message: 'Amount mismatch',
        isSuccess: false,
        expected: expectedAmount,
        received: remoteAmount
      });
    }

    if (payStatus === "success") {
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
          await session.abortTransaction();
          incMetric('replay_attempt');
        }
      } catch (txErr) {
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

    return res.status(200).json({
      message: `Payment ${payment.status}. Thank you.`,
      isSuccess: payment.status === "success",
      status: payment.status,
      prn: payment.prn
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      isSuccess: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};



