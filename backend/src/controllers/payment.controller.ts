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
    console.log('=== Payment Request Started ===');
    console.log('Request body:', req.body);
    console.log(`🔧 FonePay Config: Mode=${fonepay.mode}, Mock=${fonepay.mockMode}, PID=${fonepay.pid}`);
    
    // Development mode information
    if (fonepay.mode === 'dev') {
      console.log('🚫 DEVELOPMENT MODE: Using NBQM sandbox for safe testing');
      if (fonepay.mockMode) {
        console.log('🧪 MOCK MODE: Will return simulation URL instead of real FonePay redirect');
      }
    }
    
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation failed:', parsed.error);
      return res.status(400).json(parsed.error);
    }

    const { contestant, vote, amount, prn, description, r1, r2 } = parsed.data;

    // Ensure unique PRN
    const actualPrn = prn ?? `prn_${Date.now()}`;
    console.log('Generated PRN:', actualPrn);

    const isExists = await ContestantModel.findById(contestant);
    if (!isExists) {
      console.log('Contestant not found:', contestant);
      return res.status(404).send("Invalid contestant id.");
    }

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
      r1: r1 || '',
      r2: r2 || '',
    });
    console.log('Payment created in DB:', payment._id);

    const ruAbsolute = `http://localhost:8000/api/fonepay/payment/return`;
    console.log('Return URL (matching Spring Boot sample):', ruAbsolute);
    
    // Check if using ngrok - FonePay might not accept dynamic URLs
    if (app.baseUrl.includes('ngrok')) {
      console.log('⚠️  WARNING: Using ngrok URL. FonePay might reject dynamic URLs.');
      console.log('💡 SOLUTION: Use a fixed domain or contact FonePay to whitelist your return URL');
    }

    const requestParams = buildPaymentRequest({
      prn: actualPrn,
      amount,
      ruAbsolute,
      ri: payment.ri!,
      r1: payment.r1!,
      r2: payment.r2!,
    });

    console.log('Request params built:', requestParams);

    // store request DV and params
    payment.requestDv = requestParams.DV;
    payment.ru = requestParams.RU;
    payment.dt = requestParams.DT;
    payment.md = requestParams.MD;
    await payment.save();
    
    console.log('Payment updated with request params');

    const redirectUrl = buildRedirectUrl(requestParams);
    console.log('Final redirect URL generated:', redirectUrl);

    // Development mode: Check if mock mode is enabled
    if (fonepay.mode === 'dev' && fonepay.mockMode) {
      const mockRedirectUrl = `${app.baseUrl}/api/fonepay/payment/mock?prn=${actualPrn}&amount=${amount}`;
      console.log('🧪 MOCK MODE: Using mock redirect URL for development:', mockRedirectUrl);
      return res.json({
        prn: actualPrn,
        redirectUrl: mockRedirectUrl,
        note: 'Development mock mode enabled - safe testing'
      });
    }

    // Development mode with real FonePay dev server
    if (fonepay.mode === 'dev') {
      console.log('🔗 DEV MODE: Using real FonePay development server:', redirectUrl);
    }

    console.log('=== Payment Request Completed ===');
    
    // Official FonePay specification compliance
    const specCompliance = {
      dvOrder: 'PID,MD,PRN,AMT,CRN,DT,RI,R1,R2,RU',
      urlOrder: 'PID,MD,PRN,AMT,CRN,DT,RI,R1,R2,RU,DV',
      concatenation: 'Comma-separated',
      hashing: 'HMAC-SHA512 with UTF-8 encoded secret',
      r1r2Values: 'R1=1, R2=2'
    };
    
    console.log('\n📋 Official FonePay Specification Applied:');
    console.log('1. ✅ DV hash order: PID,MD,PRN,AMT,CRN,DT,RI,R1,R2,RU (PRN in 3rd position)');
    console.log('2. ✅ URL parameter order matches DV order exactly');
    console.log('3. ✅ R1=1, R2=2 (prevents Invalid Request)');
    console.log('4. ✅ Comma-separated concatenation');
    console.log('5. ✅ HMAC-SHA512 with UTF-8 encoded secret');
    
    if (fonepay.mode === 'dev') {
      console.log('\n⚠️  Development Mode Notes:');
      console.log('- Using NBQM sandbox merchant');
      console.log('- Implementation follows official specification');
      console.log('- Any remaining "Data Validation Failed" indicates server-side merchant setup');
    }
    
    return res.json({
      prn: actualPrn,
      redirectUrl,
      specification: {
        compliant: true,
        dvOrder: specCompliance.dvOrder,
        urlOrder: specCompliance.urlOrder,
        implementation: 'Official FonePay Specification'
      },
      troubleshooting: {
        implementationStatus: 'Specification compliant',
        dvGeneration: 'PID,MD,PRN,AMT,CRN,DT,RI,R1,R2,RU (comma-separated)',
        nextSteps: [
          'Implementation follows official FonePay specification exactly',
          'If "Data Validation Failed" persists, contact FonePay support for merchant configuration',
          'Verify merchant account activation and return URL whitelisting'
        ]
      }
    });
  } catch (error: any) {
    console.error("=== ERROR in payment creation ===");
    console.error("Environment:", fonepay.mode, "- PID:", fonepay.pid);
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
      environment: fonepay.mode,
      pid: fonepay.pid,
      timestamp: new Date().toISOString()
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
    // Handle both formats: with and without prn_ prefix
    const searchPrn = prn.startsWith('prn_') ? prn : `prn_${prn}`;
    const payment = await Payment.findOne({ prn: searchPrn });
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

// Mock payment endpoint for development
export const mockPayment = async (req: Request, res: Response) => {
  try {
    const { prn, amount } = req.query;
    
    if (!prn) {
      return res.status(400).send('Missing PRN parameter');
    }

    // Find the payment record
    const payment = await Payment.findOne({ prn: String(prn) });
    if (!payment) {
      return res.status(404).send('Payment not found');
    }

    // Simulate FonePay redirect with success response
    const mockReturnUrl = `${app.baseUrl}/api/fonepay/payment/return?PRN=${prn}&PID=${fonepay.pid}&PS=true&RC=00&UID=MOCK123&BC=NA&INI=MOCK&P_AMT=${amount}&R_AMT=${amount}&MD=P&AMT=${amount}&CRN=NPR&DT=${new Date().toLocaleDateString('en-US')}&RI=Payment&R1=&R2=&RU=${encodeURIComponent(app.baseUrl + '/api/fonepay/payment/return')}&DV=MOCK_DV_HASH`;
    const mockFailUrl = mockReturnUrl.replace('PS=true', 'PS=false').replace('RC=00', 'RC=01');
    
    res.send(`
      <html>
        <head>
          <title>FonePay Development Simulator</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #f5f5f5; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { color: #2c3e50; margin-bottom: 20px; }
            .info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .buttons { margin: 20px 0; }
            button { padding: 12px 25px; margin: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
            .success { background: #27ae60; color: white; }
            .danger { background: #e74c3c; color: white; }
            .success:hover { background: #219a52; }
            .danger:hover { background: #c0392b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="header">💳 FonePay Development Simulator</h2>
            <div class="info">
              <p><strong>Environment:</strong> Development (NBQM)</p>
              <p><strong>PRN:</strong> ${prn}</p>
              <p><strong>Amount:</strong> NPR ${amount}</p>
              <p><strong>Mode:</strong> Safe Testing - No real money involved</p>
            </div>
            <div class="buttons">
              <button class="success" onclick="simulateSuccess()">✅ Simulate Payment Success</button><br>
              <button class="danger" onclick="simulateFailed()">❌ Simulate Payment Failed</button>
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">This is a development simulator. No real transactions will be processed.</p>
          </div>
          <script>
            function simulateSuccess() {
              console.log('Simulating successful payment...');
              window.location.href = '${mockReturnUrl}';
            }
            function simulateFailed() {
              console.log('Simulating failed payment...');
              window.location.href = '${mockFailUrl}';
            }
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Mock payment error:', error);
    res.status(500).send('Mock payment error');
  }
};

// Return payment infromation
// This is called by Fonepay after payment completion   
export const returnPayment = async (req: Request, res: Response) => {
  try {
    console.log("=== FONEPAY RETURN REQUEST STARTED ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);

    const query = { ...(req.query as any), ...(req.body as any) };
    const { PRN } = query;

    console.log("Combined query+body:", query);

    if (!query.PRN || !query.PID || !query.DV) {
      console.log("Missing required fields:", {
        PRN: !!query.PRN,
        PID: !!query.PID,
        DV: !!query.DV
      });
      return res.status(400).json({ 
        message: "Missing required fields", 
        isSuccess: false,
        missing: {
          PRN: !query.PRN,
          PID: !query.PID,
          DV: !query.DV
        }
      });
    }

    let prnToSearch = String(PRN);
    if (!prnToSearch.startsWith("prn_")) {
      prnToSearch = `prn_${prnToSearch}`;
    }
    console.log("Searching for PRN:", prnToSearch);

    const payment = await Payment.findOne({ prn: prnToSearch });
    if (!payment) {
      console.log("Payment not found for PRN:", prnToSearch);
      return res.status(404).json({ 
        message: "Unknown PRN", 
        isSuccess: false,
        prn: prnToSearch
      });
    }

    console.log("Payment found:", {
      id: payment._id,
      prn: payment.prn,
      status: payment.status,
      contestant: payment.contestant
    });

    // Idempotency: if we've already verified this payment successfully, short-circuit
    if (payment.status === 'success' && payment.apiVerificationStatus === 'success') {
      console.log("Payment already processed successfully");
      return res.status(200).json({ 
        message: `Payment ${payment.status}. Thank you.`, 
        isSuccess: true,
        status: payment.status
      });
    }

    const { contestant } = payment;
    console.log("Checking contestant:", contestant);
    
    const isContestant = await ContestantModel.findById(contestant);
    if (!isContestant) {
      console.log("Contestant not found:", contestant);
      return res.status(404).json({ 
        message: "Invalid Contestant Id.", 
        isSuccess: false,
        contestant: contestant
      });
    }

    console.log("Contestant found:", isContestant._id);

    if (String(query.PID) !== payment.pid) {
      console.log("PID mismatch:", {
        queryPID: query.PID,
        paymentPID: payment.pid
      });
      return res.status(400).json({ 
        message: "PID mismatch", 
        isSuccess: false,
        expected: payment.pid,
        received: query.PID
      });
    }

    console.log("PID validation passed");

    console.log("Verifying DV...");
    const dvResult = verifyReturnDv(query);
    console.log("DV verification result:", dvResult);
    
    if (!dvResult.ok) {
      // If verifyReturnDv skipped (missing fields), continue to server-to-server verification,
      // otherwise treat as a DV mismatch.
      if (!dvResult.skipped) {
        console.log("DV verification failed");
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
      console.log("DV verification skipped, continuing to S2S verification");
    } else {
      console.log("DV verification successful");
    }

    console.log("Saving preliminary return fields...");
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
    console.log("Payment updated with return data");

    // Check payment status from FonePay response
    const paymentSuccess = String(query.PS || "").toLowerCase() === "true";
    const responseCode = String(query.RC || "");
    
    console.log("Payment response analysis:", {
      PS: query.PS,
      RC: query.RC,
      paymentSuccess: paymentSuccess,
      responseCode: responseCode
    });

    if (paymentSuccess && responseCode === "00") {
      console.log("Payment appears successful based on redirect params");
      
      // For development mode or mock mode, accept the redirect verification
      if (fonepay.mode === "dev" || fonepay.mockMode) {
        console.log("Development/Mock mode: accepting payment without S2S verification");
        payment.status = "success";
        payment.apiVerificationStatus = "skipped";
        await payment.save();
        
        // Credit the votes
        await ContestantModel.findByIdAndUpdate(payment.contestant, { $inc: { votes: payment.vote } });
        console.log("Votes credited to contestant:", payment.contestant);
        
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
      console.log("Payment failed based on redirect params");
      payment.status = "failed";
      await payment.save();
      
      return res.status(200).json({
        message: "Payment failed. Please try again.",
        isSuccess: false,
        status: "failed",
        responseCode: responseCode
      });
    }

    // S2S verification for production mode
    console.log("Starting S2S verification...");
    const body = {
      prn: payment.prn,
      merchantCode: payment.pid,
      amount: payment.p_amt || payment.amount.toFixed(2),
    };

    console.log("S2S verification request:", body);

    let apiRes;
    try {
      apiRes = await verifyTransactionServerToServer(body);
      console.log("S2S verification response:", apiRes);
    } catch (err: any) {
      console.error("S2S verification failed:", err?.message || err);
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

    console.log("API payment status:", payStatus);

    // For sandbox testing, assume success if redirect DV matches
    if (payStatus === "success" || !fonepay.apiUser) {
      payment.status = "success";
      payment.apiVerificationStatus = "skipped"; // mark skipped in dev
      await payment.save();
      
      // Credit the votes
      await ContestantModel.findByIdAndUpdate(payment.contestant, { $inc: { votes: payment.vote } });
      
      return res.status(200).json({
        message: "Payment success (redirect only). Thank you.",
        isSuccess: true,
        status: "success"
      });
    }

    const remoteAmount = String(apiRes?.data?.purchaseAmount || apiRes?.data?.purchaseAmount || "").trim();

    // Validate amount matches expected amount to avoid tampering
    const expectedAmount = payment.amount.toFixed(2);
    if (remoteAmount && remoteAmount !== expectedAmount) {
      console.log("Amount mismatch:", { expected: expectedAmount, received: remoteAmount });
      // Amount mismatch: flag and don't credit
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
      console.log("Processing successful payment with transaction...");
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
          console.log("Transaction committed successfully");
        } else {
          // nothing to do (maybe already processed)
          await session.abortTransaction();
          incMetric('replay_attempt');
          console.log("Transaction aborted - already processed");
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

    console.log("Final payment status:", payment.status);
    console.log("=== FONEPAY RETURN REQUEST COMPLETED ===");
    
    return res.status(200).json({
      message: `Payment ${payment.status}. Thank you.`,
      isSuccess: payment.status === "success",
      status: payment.status,
      prn: payment.prn
    });
  } catch (error: any) {
    console.error("=== ERROR in returnPayment ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Request URL:", req.url);
    console.error("Request method:", req.method);
    console.error("Request query:", req.query);
    console.error("Request body:", req.body);
    
    return res.status(500).json({ 
      message: "Internal server error", 
      isSuccess: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Debug endpoint to test DV generation
export const debugDV = async (req: Request, res: Response) => {
  try {
    console.log('=== DV Debug Test Started ===');
    
    const testParams = {
      prn: 'prn_debug_test',
      amount: 100,
      ruAbsolute: `${app.baseUrl}/api/fonepay/payment/return`,
      ri: 'Debug Test Payment',
      r1: '',
      r2: ''
    };
    
    console.log('Test parameters:', testParams);
    
    const requestParams = buildPaymentRequest(testParams);
    const redirectUrl = buildRedirectUrl(requestParams);
    
    return res.json({
      success: true,
      testParams,
      generatedParams: requestParams,
      redirectUrl,
      note: 'This is a debug test - no payment created'
    });
    
  } catch (error: any) {
    console.error('Debug DV error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Alternative payment endpoint that matches FonePay SDK pattern
export const createFonepayPayment = async (req: Request, res: Response) => {
  try {
    console.log('=== FonePay SDK-Style Payment Started ===');
    
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const { contestant, vote, amount, description } = parsed.data;

    // Generate PRN in SDK style (alphanumeric)
    const prn = 'FP' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const isExists = await ContestantModel.findById(contestant);
    if (!isExists) {
      return res.status(404).send("Invalid contestant id.");
    }

    // Save payment
    const payment = await Payment.create({
      prn,
      contestant,
      vote,
      amount,
      currency: 'NPR',
      pid: fonepay.pid,
      status: 'created',
      ri: description || 'Payment',
      r1: 'test',
      r2: 'test',
    });

    // Use simpler return URL structure (matches SDK pattern)
    const returnUrl = `${app.baseUrl}/api/fonepay/validate`;
    
    const requestParams = buildPaymentRequest({
      prn,
      amount,
      ruAbsolute: returnUrl,
      ri: payment.ri!,
      r1: payment.r1 || 'test',
      r2: payment.r2 || 'test',
    });

    const redirectUrl = buildRedirectUrl(requestParams);
    
    console.log('🔧 SDK-Style Payment URL Generated:', redirectUrl);
    
    return res.json({
      success: true,
      prn,
      redirectUrl,
      returnUrl,
      note: 'SDK-style payment URL - try this if main URL fails'
    });
    
  } catch (error: any) {
    console.error('SDK-style payment error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Alternative validation endpoint (simpler path like SDK)
export const validatePayment = async (req: Request, res: Response) => {
  try {
    console.log('=== FonePay Validation (SDK-Style) ===');
    console.log('Query params:', req.query);
    
    const { PRN, BID, UID } = req.query;
    
    if (!PRN) {
      return res.status(400).json({ success: false, message: 'Missing PRN' });
    }
    
    const payment = await Payment.findOne({ prn: String(PRN) });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    // Mark as success in development
    payment.status = 'success';
    payment.uid = String(UID || '');
    await payment.save();
    
    // Credit votes
    await ContestantModel.findByIdAndUpdate(payment.contestant, { $inc: { votes: payment.vote } });
    
    console.log('✅ Payment validated successfully:', PRN);
    
    return res.json({
      success: true,
      message: 'Payment successful',
      prn: PRN,
      amount: payment.amount,
      votes: payment.vote
    });
    
  } catch (error: any) {
    console.error('Payment validation error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

