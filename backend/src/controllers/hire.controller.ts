
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { HireModel } from "../models/hireModel.model";
import { hireFormSchema, replySchema } from "../validations/hire.validation";
import { ModelsModel } from "../models/models.model";

export const createHire = async (req: Request, res: Response) => {
    try {
        const modelId = req.params.id;
        const data = hireFormSchema.parse(req.body);
        const { date, email, phone, message } = data;

        // Get model details
        const getModel = await ModelsModel.findById(modelId);
        if (!getModel) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
            });
        }

        // Create hire record with model reference
        const hireData = {
            model: modelId,
            date,
            email,
            phone,
            message
        };

        const hireModel = await HireModel.create(hireData);

        // Send email to admin
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"${phone}"`,
            to: process.env.COMPANY_EMAIL,
            subject: `Application For Hire Model`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Model:</strong> ${getModel.name}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
            replyTo: email,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "Hire Model form submitted and email sent to admin successfully.",
            data: {
                model: getModel.name,
                date,
                email,
                phone,
                message
            },
        });

    } catch (error: any) {
        console.error("Error creating contact:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit contact.",
        });
    }
}

// Get all hire requests
export const getAllHires = async (req: Request, res: Response) => {
    try {
        const hiredModel = await HireModel.find();
        if (!hiredModel || hiredModel.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Model not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "List of Hired Model retrieved successfully",
            data: hiredModel,
        });
    } catch (error: any) {
        console.error("Error fetching list of hired Models requests:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch list of hired Models requests.",
        });
    }
};

// Get hire request by ID
export const getHireById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const HiredModel = await HireModel.findById({ _id: id });

        if (!HiredModel) {
            return res.status(404).json({
                success: false,
                message: `Hired Model with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hired Model retrieved successfully.",
            data: HiredModel,
        });
    } catch (error: any) {
        console.error(`Error fetching Hired Model with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Hired Model.",
        });
    }
};

export const deleteHiredModelById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const HiredModel = await HireModel.findById({ _id: id });

        if (!HiredModel) {
            return res.status(404).json({
                success: false,
                message: `Hired Model with ID ${id} not found.`,
            });
        }

        const deleteHiredModel = await HireModel.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            message: "Hired Model deleted successfully.",
            data: deleteHiredModel,
        });
    } catch (error: any) {
        console.error(`Error deleting Hired Model with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Hired Model.",
        });
    }
};
