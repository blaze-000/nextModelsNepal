import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

import { Request, Response } from "express";
import { AppModel } from "../models/appForm.model";
import { appModelSchema } from "../validations/appForm.validation";
import { EventModel } from "../models/events.model";

// createApplication Form
export const createAppForm = async (req: Request, res: Response) => {
    try {
        // Debug: Log request details
        console.log("Request body keys:", Object.keys(req.body));
        console.log("Request files:", req.files);
        
        // Ensure Multer files exist
        if (!req.files || !(req.files as Express.Multer.File[]).length) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required.",
            });
        }
        
        // Convert uploaded files to relative paths
        const files = req.files as Express.Multer.File[];
        const imagePaths = files.map(file => file.path);
        console.log("Image paths extracted:", imagePaths);
        
        // Get event ID from request body (optional)
        const { eventId } = req.body;
        let eventName = "";
        
        // Only fetch event if eventId is provided
        if (eventId) {
            const event = await EventModel.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found with the provided ID.",
                });
            }
            eventName = event.name;
        }
        
        // Prepare data for validation (without images)
        const dataToValidate = {
            ...req.body,
            event: eventName,
            weight: Number(req.body.weight),
            languages: Array.isArray(req.body.languages)
                ? req.body.languages
                : req.body.languages?.split(",").map((lang: string) => lang.trim()),
        };
        
        // Parse and validate incoming data (without images)
        const validatedData = appModelSchema.parse(dataToValidate);
        
        // Debug: Log validated data before saving
        console.log("Validated data before saving:", JSON.stringify(validatedData, null, 2));
        
        // Add images to the validated data
        const dataToSave = {
            ...validatedData,
            images: imagePaths,
        };
        
        // Debug: Log data to save
        console.log("Data to save (with images):", JSON.stringify(dataToSave, null, 2));
        
        // Save to DB
        const savedApplication = await AppModel.create(dataToSave);
        
        // Debug: Log saved application
        console.log("Saved application:", JSON.stringify(savedApplication, null, 2));
        
        // Verify images were saved
        if (!savedApplication.images || savedApplication.images.length === 0) {
            console.error("Images were not saved to the database!");
            // We'll still continue but log the error
        }
        
        try {
            // Create HTML email template (without photos section)
            const emailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Model Application Form</title>
                    <style>
                        body {
                            font-family: 'Urbanist', sans-serif;
                            background-color: #12110d;
                            color: #ffffff;
                            margin: 0;
                            padding: 0;
                            line-height: 1.6;
                        }
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 0;
                            padding: 20px;
                            background-color: #080808;
                            border-radius: 10px 10px 0 0;
                        }
                        .header h1 {
                            color: #ffaa00;
                            font-size: 28px;
                            margin: 0;
                            font-weight: 300;
                        }
                        .header p {
                            color: #ffffff70;
                            margin: 10px 0 0 0;
                            font-size: 16px;
                        }
                        .content {
                            background-color: #080808;
                            border-radius: 0 0 10px 10px;
                            padding: 30px;
                            margin-top: 0;
                        }
                        .section {
                            margin-bottom: 30px;
                        }
                        .section-title {
                            color: #ffaa00;
                            font-size: 20px;
                            margin-bottom: 15px;
                            border-bottom: 1px solid #1e1e1e;
                            padding-bottom: 10px;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 15px;
                        }
                        .info-item {
                            margin-bottom: 15px;
                        }
                        .info-label {
                            color: #ffffff50;
                            font-size: 14px;
                            margin-bottom: 5px;
                        }
                        .info-value {
                            color: #ffffff;
                            font-size: 16px;
                        }
                        .full-width {
                            grid-column: span 2;
                        }
                        .photo-notice {
                            background-color: #1e1e1e;
                            border-radius: 8px;
                            padding: 15px;
                            margin-top: 15px;
                            text-align: center;
                            color: #ffffff80;
                        }
                        .footer {
                            text-align: center;
                            color: #ffffff50;
                            font-size: 14px;
                            margin-top: 30px;
                        }
                        @media (max-width: 600px) {
                            .info-grid {
                                grid-template-columns: 1fr;
                            }
                            .full-width {
                                grid-column: span 1;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Model Application Form</h1>
                            <p>Submitted via Online Application Portal</p>
                        </div>
                        
                        <div class="content">
                            <div class="section">
                                <h2 class="section-title">Personal Information</h2>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Full Name</div>
                                        <div class="info-value">${validatedData.name}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Email</div>
                                        <div class="info-value">${validatedData.email}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Phone</div>
                                        <div class="info-value">${validatedData.phone}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Age</div>
                                        <div class="info-value">${validatedData.age}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Gender</div>
                                        <div class="info-value">${validatedData.gender || "Not specified"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Ethnicity</div>
                                        <div class="info-value">${validatedData.ethnicity}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Occupation</div>
                                        <div class="info-value">${validatedData.occupation}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Languages</div>
                                        <div class="info-value">${validatedData.languages.join(", ")}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2 class="section-title">Physical Attributes</h2>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Dress Size</div>
                                        <div class="info-value">${validatedData.dressSize}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Shoe Size</div>
                                        <div class="info-value">${validatedData.shoeSize}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Hair Color</div>
                                        <div class="info-value">${validatedData.hairColor}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Eye Color</div>
                                        <div class="info-value">${validatedData.eyeColor}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Weight</div>
                                        <div class="info-value">${validatedData.weight} kg</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2 class="section-title">Event Information</h2>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Event</div>
                                        <div class="info-value">${validatedData.event || "Not specified"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Audition Place</div>
                                        <div class="info-value">${validatedData.auditionPlace || "Not specified"}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2 class="section-title">Parents Information</h2>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Parent's Name</div>
                                        <div class="info-value">${validatedData.parentsName}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Parent's Mobile</div>
                                        <div class="info-value">${validatedData.parentsMobile}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Parent's Occupation</div>
                                        <div class="info-value">${validatedData.parentsOccupation || "Not specified"}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2 class="section-title">Address Information</h2>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Country</div>
                                        <div class="info-value">${validatedData.country}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">City</div>
                                        <div class="info-value">${validatedData.city}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <div class="info-label">Permanent Address</div>
                                        <div class="info-value">${validatedData.permanentAddress}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <div class="info-label">Temporary Address</div>
                                        <div class="info-value">${validatedData.temporaryAddress}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2 class="section-title">Additional Information</h2>
                                <div class="info-grid">
                                    <div class="info-item full-width">
                                        <div class="info-label">Hobbies</div>
                                        <div class="info-value">${validatedData.hobbies}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <div class="info-label">Talents</div>
                                        <div class="info-value">${validatedData.talents || "Not specified"}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <div class="info-label">How did you hear about us?</div>
                                        <div class="info-value">${validatedData.heardFrom || "Not specified"}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <div class="info-label">Additional Message</div>
                                        <div class="info-value">${validatedData.additionalMessage || "Not specified"}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2 class="section-title">Photos</h2>
                                <div class="photo-notice">
                                    <p>Photos are attached to this email for your review.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer">
                            This email was sent from the Model Application Portal.
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            // Prepare attachments
            const attachments = await Promise.all(
                files.map(async (file, index) => {
                    try {
                        // Read the file as a buffer
                        const fs = require('fs').promises;
                        const path = require('path');
                        const filePath = path.resolve(file.path);
                        const fileBuffer = await fs.readFile(filePath);
                        
                        return {
                            filename: `photo_${index + 1}_${file.originalname}`,
                            content: fileBuffer,
                            contentType: file.mimetype,
                        };
                    } catch (err) {
                        console.error(`Error reading file ${file.path}:`, err);
                        return null;
                    }
                })
            );
            
            // Filter out any null attachments (files that couldn't be read)
            const validAttachments = attachments.filter(attachment => attachment !== null);
            
            // Email with HTML content and attachments
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
                html: emailHtml,
                attachments: validAttachments,
                replyTo: validatedData.email,
            });
            
            // Return success response
            res.status(201).json({
                success: true,
                message: "Application form submitted successfully.",
                data: savedApplication,
            });
            
        } catch (emailError: any) {
            console.error("Error sending email:", emailError);
            // Still return success but note the email issue
            res.status(201).json({
                success: true,
                message: "Application submitted successfully, but email notification failed.",
                data: savedApplication,
            });
        }
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
export const getAllForms = async (_req: Request, res: Response) => {
    try {
        const appForm = await AppModel.find();
        if (!appForm || appForm.length === 0) {
            return res.status(200).json({
                success: false,
                message: "List of Application Form is empty.",
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