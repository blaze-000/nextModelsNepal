import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

import { Request, Response } from "express";
import { AppModel } from "../models/appForm.model";
import { appModelSchema } from "../validations/appForm.validation";
import { EventModel } from "../models/events.model";

// createApplication Form
export const createAppForm = async (req: Request, res: Response) => {
    try {
        // Ensure Multer files exist
        if (!req.files || !(req.files as Express.Multer.File[]).length) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required.",
            });
        }

        // Convert uploaded files to relative paths
        const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);

        const { id } = req.params;

        const event = await EventModel.findById({ _id: id });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found with the provided ID.",
            });
        }

        // Parse and validate incoming data
        const validatedData = appModelSchema.parse({
            ...req.body,
            event: event.name,
            images: imagePaths,
            weight: Number(req.body.weight),
            languages: Array.isArray(req.body.languages)
                ? req.body.languages
                : req.body.languages?.split(",").map((lang: string) => lang.trim()),
        });

        // Create PDF
        const doc = new PDFDocument({ margin: 30, size: "A4" });
        const profilePic = imagePaths[0];

        doc.rect(0, 0, doc.page.width, 140).fill("#F3F4F6");
        doc.fillColor("black");

        try {
            doc.image(profilePic, 250, 20, { width: 100, height: 100 });
        } catch (err: any) {
            console.warn("Profile image failed to load:", err.message);
        }

        doc.moveDown(5);
        doc.font("Helvetica-Bold").fontSize(26).fillColor("#1D4ED8");
        doc.moveDown(2)
            .font("Helvetica")
            .fontSize(12)
            .fillColor("#6B7280")
            .text("Model Application Form: Submitted via Online Application Portal", {
                align: "center",
            });

        doc.moveDown(1);
        doc.strokeColor("#D1D5DB").lineWidth(1).moveTo(30, doc.y).lineTo(565, doc.y).stroke();
        doc.moveDown(2);

        // Personal Info
        doc.fontSize(14).fillColor("#374151");
        doc.text(`Name: ${validatedData.name}`);
        doc.text(`Mobile Number: ${validatedData.phone}`);
        doc.text(`Email: ${validatedData.email}`);
        doc.text(`Country: ${validatedData.country}, City: ${validatedData.city}`);
        doc.text(`Ethnicity: ${validatedData.ethnicity}`);
        doc.text(`Age: ${validatedData.age}`);
        doc.text(`Gender: ${validatedData.gender || "N/A"}`);
        doc.text(`Occupation: ${validatedData.occupation}`);
        doc.moveDown(1);

        // Appearance
        doc.text(`Dress Size: ${validatedData.dressSize}`);
        doc.text(`Shoe Size: ${validatedData.shoeSize}`);
        doc.text(`Hair Color: ${validatedData.hairColor}`);
        doc.text(`Eye Color: ${validatedData.eyeColor}`);
        doc.moveDown(1);

        // Event Info
        if (validatedData.event) doc.text(`Event: ${validatedData.event}`);
        if (validatedData.auditionPlace) doc.text(`Audition Place: ${validatedData.auditionPlace}`);
        doc.text(`Weight (kg): ${validatedData.weight}`);
        doc.moveDown(1);

        // Parents Info
        doc.text(`Parents Name: ${validatedData.parentsName}`);
        doc.text(`Parents Mobile: ${validatedData.parentsMobile}`);
        doc.text(`Parents Occupation: ${validatedData.parentsOccupation || "N/A"}`);
        doc.moveDown(1);

        // Address
        doc.text(`Permanent Address: ${validatedData.permanentAddress}`);
        doc.text(`Temporary Address: ${validatedData.temporaryAddress}`);
        doc.moveDown(1);

        // Extras
        doc.text(`Talents: ${validatedData.talents || "N/A"}`);
        doc.text(`Hobbies: ${validatedData.hobbies}`);
        doc.text(`How did you hear about us: ${validatedData.heardFrom || "N/A"}`);
        doc.text(`Additional Message: ${validatedData.additionalMessage || "N/A"}`);

        doc.end();

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            doc.on("data", chunk => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });

        // Email with PDF
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"${validatedData.name}" <${validatedData.email}>`,
            to: process.env.COMPANY_EMAIL,
            subject: "New Model Application Form",
            html: `<h2>New Application from ${validatedData.name}</h2><p>See attached PDF for details.</p>`,
            attachments: [
                {
                    filename: `ModelApplication-${Date.now()}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
            replyTo: validatedData.email,
        });

        // Save to DB
        const savedApplication = await AppModel.create(validatedData);

        res.status(201).json({
            success: true,
            message: "Application form submitted successfully.",
            data: savedApplication,
        });
    } catch (error: any) {
        console.error("Error submitting application form:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit application form.",
            error: error.message || error,
        });
    }
};

// Get Application Form
export const getAppForm = async (_req: Request, res: Response) => {
    try {
        const appForm = await AppModel.find();
        if (!appForm || appForm.length === 0) {
            return res.status(404).json({
                success: false,
                message: "List of Application Form  not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "List of Application Form retrieved successfully",
            data: appForm,
        });
    } catch (error: any) {
        console.error("Error Geting list of Application form :", error);
        return res.status(500).json({
            success: false,
            message: "Failed to  Geting list of Application form.",
        });
    }
}

// Get Application Form by Id 
export const getAppFormById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const applyForm = await AppModel.findById({ _id: id });

        if (!applyForm) {
            return res.status(404).json({
                success: false,
                message: `Application form with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application form retrieved successfully.",
            data: applyForm,
        });
    } catch (error: any) {
        console.error(`Error Getting application form with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while getting Application form.",
        });
    }
};

// Delete Application Form by Id 
export const deleteAppFormById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const applyForm = await AppModel.findById({ _id: id });

        if (!applyForm) {
            return res.status(404).json({
                success: false,
                message: `Application form with ID ${id} not found.`,
            });
        }

        const deleteAppForm = await AppModel.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            message: "Application form deleted successfully.",
            data: deleteAppForm,
        });
    } catch (error: any) {
        console.error(`Error deleting application form with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Application form.",
        });
    }
};