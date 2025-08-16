import { Request, Response } from "express";
import { NewsletterEmail } from "../models/newsletter.emails.model";

// Create newsletter subscription
export const createNewsletter = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        // Check if email already exists
        const existingEmail = await NewsletterEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already subscribed to newsletter.",
            });
        }

        const newsletter = await NewsletterEmail.create({ email });

        return res.status(201).json({
            success: true,
            message: "Successfully subscribed to newsletter.",
            data: newsletter,
        });
    } catch (error: any) {
        console.error("Error creating newsletter subscription:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to subscribe to newsletter.",
        });
    }
};

// Get all newsletter subscriptions
export const getEmailsList = async (_req: Request, res: Response) => {
    try {
        const newsletters = await NewsletterEmail.find({}).sort({ createdAt: -1 });

        if (!newsletters || newsletters.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No newsletter subscriptions found.",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Newsletter subscriptions retrieved successfully.",
            data: newsletters,
        });
    } catch (error: any) {
        console.error("Error fetching newsletter subscriptions:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving newsletter subscriptions.",
        });
    }
};

// Delete newsletter subscription by ID
export const deleteEmail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newsletter = await NewsletterEmail.findByIdAndDelete(id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: `Newsletter subscription with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Newsletter subscription deleted successfully.",
            data: newsletter,
        });
    } catch (error: any) {
        console.error("Error deleting newsletter subscription:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting newsletter subscription.",
        });
    }
};
