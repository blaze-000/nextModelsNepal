import nodemailer from "nodemailer";
import { Request, Response } from "express";

import { ContactModel } from "../models/contact.model";
import { contactFormSchema } from "../validations/contact.validation";

//  Create contact: Save to DB and notify via email
export const createContact = async (req: Request, res: Response) => {
    try {
        const validatedData = contactFormSchema.parse(req.body);
        const { name, subject, email, phone, message } = validatedData;

        const contact = await ContactModel.create(validatedData);

        // Send email 
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
            from: `"${name}" <${email}>`,
            to: process.env.COMPANY_EMAIL,
            subject: `New Contact: ${subject}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
            replyTo: email,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "Contact submitted successfully.",
            data: contact,
        });
    } catch (error: any) {
        console.error("Error creating contact:", error);
        const status = error?.name === 'ZodError' ? 400 : 500;
        return res.status(status).json({
            success: false,
            message: status === 400 ? "Invalid input data." : "Failed to submit contact.",
        });
    }
};

// Fetch all Contact items
export const getContact = async (_req: Request, res: Response) => {
    try {
        const contactItems = await ContactModel.find({}).sort({ createdAt: -1 });
        if (!contactItems || contactItems.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No contact items found.",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact retrieved successfully.",
            data: contactItems,
        });
    } catch (error: any) {
        console.error("Error fetching Contact :", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Contact items.",
        });
    }
};

//  Get single Contact item by ID
export const getContactById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const contactItem = await ContactModel.findById(id);

        if (!contactItem) {
            return res.status(404).json({
                success: false,
                message: `Contact item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact item retrieved successfully.",
            data: contactItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Contact item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Contact item.",
        });
    }
};

//  Delete a Contact item by ID
export const deleteContactById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await ContactModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Contact item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting Contact item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Contact item.",
            error: error.message,
        });
    }
};
