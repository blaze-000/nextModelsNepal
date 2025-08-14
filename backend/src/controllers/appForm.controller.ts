import { Request, Response } from "express";
import { AppModel } from "../models/appForm.model";
import { appModelSchema } from "../validations/appForm.validation";
import { EventModel } from "../models/events.model";
import { transporter } from "../config/mail";
import { buildApplicationPdf } from "../utils/pdf";

// createApplication Form
export const createAppForm = async (req: Request, res: Response) => {
    try {
        if (!req.files || !(req.files as Express.Multer.File[]).length) {
            return res.status(400).json({ success: false, message: "At least one image is required." });
        }

        const imagePaths = (req.files as Express.Multer.File[]).map((f) => f.path);
        const { id } = req.params;
        const event = await EventModel.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found with the provided ID." });
        }

        const validatedData = appModelSchema.parse({
            ...req.body,
            event: event.name,
            images: imagePaths,
            weight: Number(req.body.weight),
            languages: Array.isArray(req.body.languages)
                ? req.body.languages
                : req.body.languages?.split(",").map((lang: string) => lang.trim()),
        });

        // Build PDF here (now it actually generates)
        const pdfBuffer = await buildApplicationPdf(validatedData, imagePaths);

        await transporter.sendMail({
            from: `"${validatedData.name}" <${validatedData.email}>`,
            to: process.env.COMPANY_EMAIL,
            subject: "New Model Application Form",
            html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 0.3rem; background-color: black; padding-top: 1rem;">
                    <h2 style="color: #fa0; text-align: center;">You have received a new application form<strong> from ${validatedData.name}</strong></h2>
                    <div style="background: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                     <div>
                       <p><strong>Applicant:</strong> ${validatedData.name}</p>
                       <p><strong>Phone:</strong> ${validatedData.phone}</p>
                       <p><strong>Gender:</strong> ${validatedData.gender}</p>
                       <p><strong>Location:</strong> ${validatedData.permanentAddress}</p>
                       <p><strong>Event:</strong> ${validatedData.event}</p>
                       <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                       <p style="text-align: center;">© Next Peace Nepal</p>
                     </div>
                    </div>
                   </div>
                   <p>Please find the detailed application attached as a PDF.</p>
            `,
            attachments: [
                {
                    filename: `ModelApplication-${Date.now()}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
            replyTo: validatedData.email,
        });

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