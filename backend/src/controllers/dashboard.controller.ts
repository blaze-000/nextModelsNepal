import { Request, Response } from "express";
import { Model } from '../models/model.model.js';
import { EventModel, SeasonModel } from '../models/events.model.js';
import { AppModel } from '../models/appForm.model.js';
import { Payment } from '../models/payment.model.js';
import { ContestantModel } from '../models/events.model.js';

// Helper function to parse R1 parameter for bulk payments in dashboard
function parseBulkPaymentR1ForDashboard(r1String: string): { contestant_Id: string; vote: number }[] {
  try {
    if (!r1String || r1String.trim() === '') {
      return [];
    }
    
    const parsedR1 = JSON.parse(decodeURIComponent(r1String));
    
    // Handle different R1 formats:
    // 1. New compressed format: { i: [{ id, v }], c, t }
    // 2. Previous compressed format: { items: [{ contestant_Id, vote }], count, total } or { items: [{ id, v }], count, total }
    // 3. Original format: [{ contestant_Id, vote }]
    
    if (parsedR1.i) {
      // New compressed format: { i: [{ id, v }], c, t }
      return parsedR1.i.map((item: any) => ({
        contestant_Id: item.id,
        vote: item.v
      }));
    } else if (parsedR1.items) {
      // Previous compressed format
      return parsedR1.items.map((item: any) => ({
        contestant_Id: item.contestant_Id || item.id,
        vote: item.vote || item.v
      }));
    } else {
      // Original format
      return parsedR1;
    }
  } catch (parseError) {
    console.error('Error parsing R1 for bulk payment in dashboard:', parseError);
    return [];
  }
}

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    // Get total models count
    const totalModels = await Model.countDocuments();
    
    // Get male and female model counts
    const maleModels = await Model.countDocuments({ gender: "Male" });
    const femaleModels = await Model.countDocuments({ gender: "Female" });
    
    // Get total events count
    const totalEvents = await EventModel.countDocuments();
    
    // Get active events (events with at least one ongoing season)
    const activeEvents = await SeasonModel.countDocuments({ 
      status: "ongoing",
      votingOpened: true 
    });
    
    // Get total applications count
    const totalApplications = await AppModel.countDocuments();
    
    // Get this month's applications
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const thisMonthApplications = await AppModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    // Get total revenue from successful payments
    const revenueResult = await Payment.aggregate([
      {
        $match: {
          status: "success"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get payment statistics
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    
    // Format payment statistics
    const formattedPaymentStats: Record<string, { count: number; totalAmount: number }> = {};
    paymentStats.forEach(stat => {
      formattedPaymentStats[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount
      };
    });
    
    // Get recent applications (last 5)
    const recentApplications = await AppModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt");
    
    // Get recent models (last 5)
    const recentModels = await Model.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name gender createdAt");
    
    // Get recent payments (last 5) with contestant information for bulk payments
    const recentPaymentsRaw = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Enhance payments with contestant information for bulk payments
    const recentPayments = await Promise.all(recentPaymentsRaw.map(async (payment) => {
      // Check if this is a bulk payment (R1 contains multiple contestants)
      if (payment.r1 && payment.r1.trim() !== '') {
        try {
          // Parse R1 with support for different formats
          const bulkPaymentItems = parseBulkPaymentR1ForDashboard(payment.r1);
          
          // Get information for all contestants in the bulk payment
          const contestantsInfo = [];
          for (const item of bulkPaymentItems) {
            try {
              const contestant = await ContestantModel.findById(item.contestant_Id);
              contestantsInfo.push({
                id: item.contestant_Id,
                name: contestant ? contestant.name : `Contestant ${item.contestant_Id}`,
                votes: item.vote
              });
            } catch (contestantError) {
              console.error(`Error fetching contestant ${item.contestant_Id}:`, contestantError);
              // Add contestant with fallback info even if individual fetch fails
              contestantsInfo.push({
                id: item.contestant_Id,
                name: `Contestant ${item.contestant_Id}`,
                votes: item.vote
              });
            }
          }
          
          return {
            prn: payment.prn,
            status: payment.status,
            amount: payment.amount,
            contestants: contestantsInfo,
            createdAt: payment.createdAt
          };
        } catch (parseError) {
          console.error('Error parsing R1 for bulk payment:', parseError);
          // Fallback to single contestant
          return {
            prn: payment.prn,
            status: payment.status,
            amount: payment.amount,
            contestants: [{
              id: payment.contestant_Id.toString(),
              name: payment.contestant_Name,
              votes: payment.vote
            }],
            createdAt: payment.createdAt
          };
        }
      } else {
        // Single contestant payment
        return {
          prn: payment.prn,
          status: payment.status,
          amount: payment.amount,
          contestants: [{
            id: payment.contestant_Id.toString(),
            name: payment.contestant_Name,
            votes: payment.vote
          }],
          createdAt: payment.createdAt
        };
      }
    }));
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalModels,
          maleModels,
          femaleModels,
          totalEvents,
          activeEvents,
          totalApplications,
          thisMonthApplications,
          totalRevenue,
          paymentStats: formattedPaymentStats
        },
        recentApplications: recentApplications.map(app => ({
          name: app.name,
          time: app.createdAt
        })),
        recentModels: recentModels.map(model => ({
          name: model.name,
          gender: model.gender,
          time: model.createdAt
        })),
        recentPayments
      }
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message 
    });
  }
};