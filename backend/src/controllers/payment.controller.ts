import { Request, Response } from 'express';
import { Payment } from '../models/payment.model';
import { app, fonepay } from '../config/payment.config';
import { buildPaymentRequest, buildRedirectUrl, verifyReturnDv, verifyTransactionServerToServer } from '../service/payment.service';
import { paymentSchema } from '../validations/payment.validation';
import { FonepayRequestParams } from '../types/payment';
import { ContestantModel } from '../models/events.model';
import mongoose from 'mongoose';
import { incMetric } from '../utils/metrics';

// Helper function to parse R1 parameter for bulk payments
function parseBulkPaymentR1(r1String: string): { contestant_Id: string; vote: number }[] {
  try {
    if (!r1String || r1String.trim() === '') {
      return [];
    }
    
    const parsedR1 = JSON.parse(decodeURIComponent(r1String));
    
    // Handle different R1 formats:
    // 1. New compressed format: { i: [{ id, v }], c, t }
    // 2. Previous compressed format: { items: [{ contestant_Id, vote }], count, total } or { items: [{ id, v }], count, total }
    // 3. Original format: [{ contestant_Id, vote }]
    
    let items: any[] = [];
    if (parsedR1.i) {
      // New compressed format: { i: [{ id, v }], c, t }
      items = parsedR1.i;
    } else if (parsedR1.items) {
      // Previous compressed format
      items = parsedR1.items;
    } else {
      // Original format
      items = parsedR1;
    }
    
    // Process items and map to consistent format
    return items.map((item: any) => ({
      contestant_Id: item.contestant_Id || item.id,
      vote: item.vote || item.v
    }));
  } catch (parseError) {
    console.error('Error parsing R1 for bulk payment:', parseError);
    return [];
  }
}

// 1) Create Payment Session
export const payment = async (req: Request, res: Response) => {
  try {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const { contestant_Id, vote, amount, prn, purpose, r1, r2 } = parsed.data;
    const actualPrn = prn ?? `prn_${Date.now()}`;

    const isExists = await ContestantModel.findById(contestant_Id);
    if (!isExists) {
      return res.status(404).send("Invalid contestant id.");
    }

    const payment = await Payment.create({
      prn: actualPrn,
      contestant_Id,
      contestant_Name: isExists.name,
      vote,
      currency: 'NPR',
      amount,
      purpose,
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
    // Prevent caching of payment status responses
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const { prn } = req.params;
    const searchPrn = prn.startsWith('prn_') ? prn : `prn_${prn}`;
    const payment = await Payment.findOne({ prn: searchPrn });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Get contestant with season information
    let eventName = '';
    let contestantsInfo: { id: string; name: string; votes: number }[] = [];
    
    // Check if this is a bulk payment (R1 contains multiple contestants)
    if (payment.r1 && payment.r1.trim() !== '') {
      try {
        const bulkPaymentItems = parseBulkPaymentR1(payment.r1);
        // Get information for all contestants in the bulk payment
        for (const item of bulkPaymentItems) {
          // Use full contestant ID directly
          const contestant = await ContestantModel.findById(item.contestant_Id).populate({
            path: 'seasonId',
            populate: {
              path: 'eventId',
              select: 'name'
            }
          });
          
          if (contestant && contestant.seasonId) {
            const season: any = contestant.seasonId;
            if (season.eventId && season.eventId.name && !eventName) {
              eventName = season.eventId.name;
            }
          }
          
          contestantsInfo.push({
            id: item.contestant_Id,
            name: contestant ? contestant.name : `Contestant ${item.contestant_Id}`,
            votes: item.vote
          });
        }
      } catch (parseError) {
        console.error('Error parsing R1 for bulk payment:', parseError);
        // Fallback to single contestant
        const contestant = await ContestantModel.findById(payment.contestant_Id).populate({
          path: 'seasonId',
          populate: {
            path: 'eventId',
            select: 'name'
          }
        });
        
        if (contestant && contestant.seasonId) {
          const season: any = contestant.seasonId;
          if (season.eventId && season.eventId.name) {
            eventName = season.eventId.name;
          }
        }
        
        contestantsInfo.push({
          id: payment.contestant_Id.toString(),
          name: payment.contestant_Name || '',
          votes: payment.vote
        });
      }
    } else {
      // Single contestant payment
      const contestant = await ContestantModel.findById(payment.contestant_Id).populate({
        path: 'seasonId',
        populate: {
          path: 'eventId',
          select: 'name'
        }
      });
      
      if (contestant && contestant.seasonId) {
        const season: any = contestant.seasonId;
        if (season.eventId && season.eventId.name) {
          eventName = season.eventId.name;
        }
      }
      
      contestantsInfo.push({
        id: payment.contestant_Id.toString(),
        name: payment.contestant_Name || '',
        votes: payment.vote
      });
    }

    // Return detailed payment information for the frontend
    const paymentData = {
      message: `Payment ${payment.status}`,
      isSuccess: payment.status === 'success',
      status: payment.status,
      prn: payment.prn,
      contestants: contestantsInfo,
      amount: payment.amount,
      event: eventName || payment.purpose || '',
      bankCode: payment.bc || '',
      accountNumber: payment.uid || '',
      ini: payment.ini || ''
    };

    res.status(200).json({ 
      success: true, 
      status: payment.status,
      payment: paymentData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to get payment" });
  }
};

export const getPaymentStatusById = async (req: Request, res: Response) => {
  try {
    // Prevent caching of payment status responses
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Get contestant with season information
    let eventName = '';
    let contestantsInfo: { id: string; name: string; votes: number }[] = [];
    
    // Check if this is a bulk payment (R1 contains multiple contestants)
    if (payment.r1 && payment.r1.trim() !== '') {
      try {
        const bulkPaymentItems = parseBulkPaymentR1(payment.r1);
        // Get information for all contestants in the bulk payment
        for (const item of bulkPaymentItems) {
          // Use full contestant ID directly
          const contestant = await ContestantModel.findById(item.contestant_Id).populate({
            path: 'seasonId',
            populate: {
              path: 'eventId',
              select: 'name'
            }
          });
          
          if (contestant && contestant.seasonId) {
            const season: any = contestant.seasonId;
            if (season.eventId && season.eventId.name && !eventName) {
              eventName = season.eventId.name;
            }
          }
          
          contestantsInfo.push({
            id: item.contestant_Id,
            name: contestant ? contestant.name : `Contestant ${item.contestant_Id}`,
            votes: item.vote
          });
        }
      } catch (parseError) {
        console.error('Error parsing R1 for bulk payment:', parseError);
        // Fallback to single contestant
        const contestant = await ContestantModel.findById(payment.contestant_Id).populate({
          path: 'seasonId',
          populate: {
            path: 'eventId',
            select: 'name'
          }
        });
        
        if (contestant && contestant.seasonId) {
          const season: any = contestant.seasonId;
          if (season.eventId && season.eventId.name) {
            eventName = season.eventId.name;
          }
        }
        
        contestantsInfo.push({
          id: payment.contestant_Id.toString(),
          name: payment.contestant_Name || '',
          votes: payment.vote
        });
      }
    } else {
      // Single contestant payment
      const contestant = await ContestantModel.findById(payment.contestant_Id).populate({
        path: 'seasonId',
        populate: {
          path: 'eventId',
          select: 'name'
        }
      });
      
      if (contestant && contestant.seasonId) {
        const season: any = contestant.seasonId;
        if (season.eventId && season.eventId.name) {
          eventName = season.eventId.name;
        }
      }
      
      contestantsInfo.push({
        id: payment.contestant_Id.toString(),
        name: payment.contestant_Name || '',
        votes: payment.vote
      });
    }

    // Return detailed payment information for the frontend
    const paymentData = {
      message: `Payment ${payment.status}`,
      isSuccess: payment.status === 'success',
      status: payment.status,
      prn: payment.prn,
      contestants: contestantsInfo,
      amount: payment.amount,
      event: eventName || payment.purpose || '',
      bankCode: payment.bc || '',
      accountNumber: payment.uid || '',
      ini: payment.ini || ''
    };

    res.status(200).json({ success: true, payment: paymentData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to get payment" });
  }
};

export const getAllPayment = async (req: Request, res: Response) => {
  try {
    // Get all payments sorted by createdAt in descending order (newest first)
    const payments = await Payment.find().sort({ createdAt: -1 });
    
    // Enhance payments with contestant information for bulk payments
    const enhancedPayments = await Promise.all(payments.map(async (payment) => {
      // Check if this is a bulk payment (R1 contains multiple contestants)
      if (payment.r1 && payment.r1.trim() !== '') {
        try {
          const bulkPaymentItems = parseBulkPaymentR1(payment.r1);
          // Get information for all contestants in the bulk payment
          const contestantsInfo = [];
          for (const item of bulkPaymentItems) {
            const contestant = await ContestantModel.findById(item.contestant_Id);
            contestantsInfo.push({
              id: item.contestant_Id,
              name: contestant ? contestant.name : `Contestant ${item.contestant_Id}`,
              votes: item.vote
            });
          }
          
          return {
            ...payment.toObject(),
            contestants: contestantsInfo
          };
        } catch (parseError) {
          console.error('Error parsing R1 for bulk payment:', parseError);
          // Fallback to single contestant
          return {
            ...payment.toObject(),
            contestants: [{
              id: payment.contestant_Id.toString(),
              name: payment.contestant_Name,
              votes: payment.vote
            }]
          };
        }
      } else {
        // Single contestant payment
        return {
          ...payment.toObject(),
          contestants: [{
            id: payment.contestant_Id.toString(),
            name: payment.contestant_Name,
            votes: payment.vote
          }]
        };
      }
    }));
    
    res.status(200).json({ 
      success: true,
      message: "Successfully retrieved payments",
      payments: enhancedPayments
    });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get payments",
      error: error.message 
    });
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    // Get total count of payments
    const totalPayments = await Payment.countDocuments();
    
    // Get count by status
    const statusCounts = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent payments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPayments = await Payment.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });
    
    // Calculate total revenue
    const totalRevenueResult = await Payment.aggregate([
      {
        $match: {
          status: "success"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalVotes: { $sum: "$vote" }
        }
      }
    ]);
    
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
    const totalVotes = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalVotes : 0;
    
    // Format status counts for easier frontend consumption
    const formattedStatusCounts: Record<string, number> = {};
    statusCounts.forEach(item => {
      formattedStatusCounts[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        totalRevenue,
        totalVotes,
        statusCounts: formattedStatusCounts,
        recentPayments: recentPayments.slice(0, 10) // Limit to 10 most recent
      }
    });
  } catch (error: any) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get payment statistics",
      error: error.message 
    });
  }
};

export const returnPayment = async (req: Request, res: Response) => {
  try {
    const query = { ...(req.query as any), ...(req.body as any) };
    const { PRN } = query;

    // If this is just a status check for an already successful payment, skip rate limiting
    if (PRN) {
      let prnToSearch = String(PRN);
      if (!prnToSearch.startsWith("prn_")) {
        prnToSearch = `prn_${prnToSearch}`;
      }

      const payment = await Payment.findOne({ prn: prnToSearch });
      if (payment && payment.status === 'success' && payment.apiVerificationStatus === 'success') {
        // Redirect to frontend payment status page for already successful payments
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
      }
    }

    if (!query.PRN || !query.PID || !query.DV) {
      // Redirect to frontend payment status page with error information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?error=missing_fields`);
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


      if (recentPayments.length === 0) {
        // Redirect to frontend payment status page with error information
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?error=unknown_prn`);
      }

      // Use the most recent payment as fallback
      const fallbackPayment = recentPayments[0];

      // Redirect to frontend payment status page with error information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?error=prn_mismatch&prn=${prnToSearch}`);
    }

    if (payment.status === 'success' && payment.apiVerificationStatus === 'success') {
      // Redirect to frontend payment status page for already successful payments
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    const { contestant_Id } = payment;
    const isContestant = await ContestantModel.findById(contestant_Id);
    if (!isContestant) {
      // Redirect to frontend payment status page with error information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?error=invalid_contestant&contestant=${contestant_Id}`);
    }

    if (String(query.PID) !== payment.pid) {
      // Redirect to frontend payment status page with error information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?error=pid_mismatch&expected=${payment.pid}&received=${query.PID}`);
    }

    // Check payment status from FonePay response
    const paymentSuccess = String(query.PS || "").toLowerCase() === "true";
    const responseCode = String(query.RC || "");

    if (!paymentSuccess || (responseCode !== "successful" && responseCode !== "00" && responseCode === "failed")) {
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

      // Redirect to frontend payment status page with failure information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    const dvResult = verifyReturnDv(query);

    if (!dvResult.ok) {
      if (!dvResult.skipped) {
        payment.status = "error";
        payment.responseDv = String(query.DV || "");
        await payment.save();
        incMetric('dv_mismatch');
        
        // Redirect to frontend payment status page with error information
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?error=dv_mismatch&prn=${payment.prn}`);
      }
    }

    if (paymentSuccess && (responseCode === "successful" || responseCode === "00")) {
      // Store return parameters
      payment.ps = String(query.PS ?? "");
      payment.rc = String(query.RC ?? "");
      payment.uid = String(query.UID ?? "");
      payment.bc = String(query.BC ?? "");
      payment.ini = String(query.INI ?? "");
      payment.p_amt = String(query["P_AMT"] ?? "");
      payment.r_amt = String(query["R_AMT"] ?? "");
      payment.responseDv = String(query.DV || "");
      
      // CRITICAL: Validate amount matches expected amount for votes
      const paidAmount = parseFloat(query["P_AMT"] || "0");
      const expectedAmount = payment.vote * 1; // votes × 1 NPR per vote
      
      if (Math.abs(paidAmount - expectedAmount) > 0.01) { // Allow 1 paisa tolerance
        payment.status = "error";
        await payment.save();
        
        // Redirect to frontend payment status page with error information
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?error=amount_mismatch&prn=${payment.prn}`);
      }
      
      if (fonepay.mode === "dev") {
        payment.status = "success";
        payment.apiVerificationStatus = "skipped";
        await payment.save();

        // Check if this is a bulk payment (R1 contains multiple contestants)
        let bulkPaymentItems: { contestant_Id: string; vote: number }[] = [];
        try {
          if (payment.r1 && payment.r1.trim() !== '') {
            bulkPaymentItems = parseBulkPaymentR1(payment.r1);
          } else {
            // Fallback to single contestant update
            bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
          }
        } catch (parseError) {
          console.error('Error parsing R1 for bulk payment:', parseError);
          // Fallback to single contestant update
          bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
        }

        // Update votes for all contestants in the bulk payment
        let updateErrors: string[] = [];
        for (const item of bulkPaymentItems) {
          try {
            const contestantUpdate = await ContestantModel.findByIdAndUpdate(
              item.contestant_Id, 
              { $inc: { votes: item.vote } }, 
              { new: true }
            );
            
            if (!contestantUpdate) {
              const errorMsg = `Contestant ${item.contestant_Id} not found`;
              console.error(errorMsg);
              updateErrors.push(errorMsg);
            } else {
              console.log(`Successfully updated votes for contestant ${item.contestant_Id}. New vote count: ${contestantUpdate.votes}`);
            }
          } catch (updateError) {
            const errorMsg = `Error updating votes for contestant ${item.contestant_Id}: ${updateError}`;
            console.error(errorMsg);
            updateErrors.push(errorMsg);
          }
        }
        
        if (updateErrors.length > 0) {
          // Log error but don't fail the payment
          console.error(`Some vote updates failed: ${updateErrors.join('; ')}`);
        } else {
          console.log(`Successfully updated votes for ${bulkPaymentItems.length} contestant(s)`);
        }

        // Redirect to frontend payment status page instead of returning JSON
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
      }
      // Continue to S2S verification for live mode or proceed without S2S
    } else {
      // Payment actually failed
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

      // Redirect to frontend payment status page with failure information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    const body = {
      prn: payment.prn,
      merchantCode: payment.pid,
      amount: payment.p_amt || payment.amount.toFixed(2),
    };

    // Bypass S2S verification when credentials are not available
    if (!fonepay.apiUser || !fonepay.apiPass || !fonepay.apiSecret) {
      console.log("S2S credentials not configured, bypassing S2S verification and using FonePay redirect data");
      
      // CRITICAL: Validate amount matches expected amount for votes
      const paidAmount = parseFloat(query["P_AMT"] || "0");
      const expectedAmount = payment.vote * 1; // votes × 1 NPR per vote
      
      if (Math.abs(paidAmount - expectedAmount) > 0.01) { // Allow 1 paisa tolerance
        payment.status = "error";
        await payment.save();
        
        // Redirect to frontend payment status page with error information
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?error=amount_manipulation&prn=${payment.prn}`);
      }
      
      payment.status = "success";
      payment.apiVerificationStatus = "bypassed";
      await payment.save();
      
      // Check if this is a bulk payment (R1 contains multiple contestants)
      let bulkPaymentItems: { contestant_Id: string; vote: number }[] = [];
      try {
        if (payment.r1 && payment.r1.trim() !== '') {
          bulkPaymentItems = parseBulkPaymentR1(payment.r1);
        } else {
          // Fallback to single contestant update
          bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
        }
      } catch (parseError) {
        console.error('Error parsing R1 for bulk payment:', parseError);
        // Fallback to single contestant update
        bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
      }

      // Update votes for all contestants in the bulk payment
      let updateErrors: string[] = [];
      for (const item of bulkPaymentItems) {
        try {
          const contestantUpdate = await ContestantModel.findByIdAndUpdate(
            item.contestant_Id, 
            { $inc: { votes: item.vote } }, 
            { new: true }
          );
          
          if (!contestantUpdate) {
            const errorMsg = `Contestant ${item.contestant_Id} not found`;
            console.error(errorMsg);
            updateErrors.push(errorMsg);
          } else {
            console.log(`Successfully updated votes for contestant ${item.contestant_Id}. New vote count: ${contestantUpdate.votes}`);
          }
        } catch (updateError) {
          const errorMsg = `Error updating votes for contestant ${item.contestant_Id}: ${updateError}`;
          console.error(errorMsg);
          updateErrors.push(errorMsg);
        }
      }
      
      if (updateErrors.length > 0) {
        // Log error but don't fail the payment
        console.error(`Some vote updates failed: ${updateErrors.join('; ')}`);
      } else {
        console.log(`Successfully updated votes for ${bulkPaymentItems.length} contestant(s)`);
      }
      
      // Redirect to frontend payment status page instead of returning JSON
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    let apiRes;
    try {
      apiRes = await verifyTransactionServerToServer(body);
    } catch (err: any) {
      // If S2S fails but payment was successful from FonePay redirect, treat as success
      if (paymentSuccess && (responseCode === "successful" || responseCode === "00")) {
        // CRITICAL: Validate amount matches expected amount for votes
        const paidAmount = parseFloat(query["P_AMT"] || "0");
        const expectedAmount = payment.vote * 1; // votes × 1 NPR per vote
        
        if (Math.abs(paidAmount - expectedAmount) > 0.01) { // Allow 1 paisa tolerance
          payment.status = "error";
          await payment.save();
          
          // Redirect to frontend payment status page with error information
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          return res.redirect(302, `${frontendUrl}/payment/status?error=amount_manipulation&prn=${payment.prn}`);
        }
        
        payment.status = "success";
        payment.apiVerificationStatus = "skipped";
        await payment.save();
        
        // Check if this is a bulk payment (R1 contains multiple contestants)
        let bulkPaymentItems: { contestant_Id: string; vote: number }[] = [];
        try {
          if (payment.r1 && payment.r1.trim() !== '') {
            bulkPaymentItems = parseBulkPaymentR1(payment.r1);
          } else {
            // Fallback to single contestant update
            bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
          }
        } catch (parseError) {
          console.error('Error parsing R1 for bulk payment:', parseError);
          // Fallback to single contestant update
          bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
        }

        // Update votes for all contestants in the bulk payment
        let updateErrors: string[] = [];
        for (const item of bulkPaymentItems) {
          try {
            const contestantUpdate = await ContestantModel.findByIdAndUpdate(
              item.contestant_Id, 
              { $inc: { votes: item.vote } }, 
              { new: true }
            );
            
            if (!contestantUpdate) {
              const errorMsg = `Contestant ${item.contestant_Id} not found`;
              console.error(errorMsg);
              updateErrors.push(errorMsg);
            } else {
              console.log(`Successfully updated votes for contestant ${item.contestant_Id}. New vote count: ${contestantUpdate.votes}`);
            }
          } catch (updateError) {
            const errorMsg = `Error updating votes for contestant ${item.contestant_Id}: ${updateError}`;
            console.error(errorMsg);
            updateErrors.push(errorMsg);
          }
        }
        
        if (updateErrors.length > 0) {
          // Log error but don't fail the payment
          console.error(`Some vote updates failed: ${updateErrors.join('; ')}`);
        } else {
          console.log(`Successfully updated votes for ${bulkPaymentItems.length} contestant(s)`);
        }
        
        // Redirect to frontend payment status page instead of returning JSON
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
      }
      
      payment.apiVerificationStatus = fonepay.mode === "dev" ? "skipped" : "failed";
      await payment.save();
      
      // Redirect to frontend payment status page instead of returning JSON
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    payment.apiResponse = apiRes?.data;
    const payStatus = String(apiRes?.data?.paymentStatus || "").toLowerCase();

    if (payStatus === "success" || !fonepay.apiUser) {
      payment.status = "success";
      payment.apiVerificationStatus = fonepay.apiUser ? "skipped" : "bypassed";
      await payment.save();

      // Check if this is a bulk payment (R1 contains multiple contestants)
      let bulkPaymentItems: { contestant_Id: string; vote: number }[] = [];
      try {
        if (payment.r1 && payment.r1.trim() !== '') {
          bulkPaymentItems = parseBulkPaymentR1(payment.r1);
        } else {
          // Fallback to single contestant update
          bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
        }
      } catch (parseError) {
        console.error('Error parsing R1 for bulk payment:', parseError);
        // Fallback to single contestant update
        bulkPaymentItems = [{ contestant_Id: payment.contestant_Id.toString(), vote: payment.vote }];
      }

      // Update votes for all contestants in the bulk payment
      let updateErrors: string[] = [];
      for (const item of bulkPaymentItems) {
        try {
          const contestantUpdate = await ContestantModel.findByIdAndUpdate(
            item.contestant_Id, 
            { $inc: { votes: item.vote } }, 
            { new: true }
          );
          
          if (!contestantUpdate) {
            const errorMsg = `Contestant ${item.contestant_Id} not found`;
            console.error(errorMsg);
            updateErrors.push(errorMsg);
          } else {
            console.log(`Successfully updated votes for contestant ${item.contestant_Id}. New vote count: ${contestantUpdate.votes}`);
          }
        } catch (updateError) {
          const errorMsg = `Error updating votes for contestant ${item.contestant_Id}: ${updateError}`;
          console.error(errorMsg);
          updateErrors.push(errorMsg);
        }
      }
      
      if (updateErrors.length > 0) {
        // Log error but don't fail the payment
        console.error(`Some vote updates failed: ${updateErrors.join('; ')}`);
      } else {
        console.log(`Successfully updated votes for ${bulkPaymentItems.length} contestant(s)`);
      }

      // Redirect to frontend payment status page instead of returning JSON
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    const remoteAmount = String(apiRes?.data?.purchaseAmount || apiRes?.data?.purchaseAmount || "").trim();
    const expectedAmount = payment.amount.toFixed(2);
    if (remoteAmount && remoteAmount !== expectedAmount) {
      payment.status = 'error';
      payment.apiVerificationStatus = 'failed';
      await payment.save();
      incMetric('amount_mismatch');
      
      // Redirect to frontend payment status page with error information
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?error=amount_mismatch_s2s&prn=${payment.prn}`);
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
          // Check if this is a bulk payment (R1 contains multiple contestants)
          let bulkPaymentItems: { contestant_Id: string; vote: number }[] = [];
          try {
            if (updated.r1 && updated.r1.trim() !== '') {
              bulkPaymentItems = parseBulkPaymentR1(updated.r1);
            } else {
              // Fallback to single contestant update
              bulkPaymentItems = [{ contestant_Id: updated.contestant_Id.toString(), vote: updated.vote }];
            }
          } catch (parseError) {
            console.error('Error parsing R1 for bulk payment:', parseError);
            // Fallback to single contestant update
            bulkPaymentItems = [{ contestant_Id: updated.contestant_Id.toString(), vote: updated.vote }];
          }

          // Update votes for all contestants in the bulk payment
          let updateErrors: string[] = [];
          for (const item of bulkPaymentItems) {
            try {
              const contestantUpdate = await ContestantModel.findByIdAndUpdate(
                item.contestant_Id, 
                { $inc: { votes: item.vote } }, 
                { new: true, session }
              );
              
              if (!contestantUpdate) {
                const errorMsg = `Contestant ${item.contestant_Id} not found`;
                console.error(errorMsg);
                updateErrors.push(errorMsg);
              } else {
                console.log(`Successfully updated votes for contestant ${item.contestant_Id}. New vote count: ${contestantUpdate.votes}`);
              }
            } catch (updateError) {
              const errorMsg = `Error updating votes for contestant ${item.contestant_Id}: ${updateError}`;
              console.error(errorMsg);
              updateErrors.push(errorMsg);
            }
          }
          
          if (updateErrors.length > 0) {
            throw new Error(`Failed to update votes for ${updateErrors.length} contestant(s): ${updateErrors.join('; ')}`);
          }
          
          await session.commitTransaction();
          incMetric('s2s_success');
          console.log(`Successfully updated votes for ${bulkPaymentItems.length} contestant(s)`);
        } else {
          await session.abortTransaction();
          incMetric('replay_attempt');
          console.log('Payment already processed, skipping vote update');
        }
      } catch (txErr) {
        await session.abortTransaction();
        payment.status = 'error';
        payment.apiVerificationStatus = 'failed';
        await payment.save();
        incMetric('tx_fail');
        console.error('Transaction failed during vote update:', txErr);
      } finally {
        session.endSession();
      }
      
      // Redirect to frontend payment status page for successful S2S verification
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    } else if (payStatus === "failed") {
      payment.status = "failed";
      payment.apiVerificationStatus = "failed";
      await payment.save();
      incMetric('s2s_failed_status');
      
      // Redirect to frontend payment status page for failed S2S verification
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    } else {
      payment.status = "pending";
      payment.apiVerificationStatus = "pending";
      await payment.save();
      incMetric('s2s_pending_status');
      
      // Redirect to frontend payment status page for pending S2S verification
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(302, `${frontendUrl}/payment/status?prn=${payment.prn}`);
    }

    // Production: Removed commented out JSON response code
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      isSuccess: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findByIdAndDelete(id);
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Payment deleted successfully" 
    });
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete payment",
      error: error.message 
    });
  }
};

export const deleteAllPayments = async (req: Request, res: Response) => {
  try {
    const result = await Payment.deleteMany({});
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully deleted ${result.deletedCount} payments` 
    });
  } catch (error: any) {
    console.error('Error deleting all payments:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete all payments",
      error: error.message 
    });
  }
};