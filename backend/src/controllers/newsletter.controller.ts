import { Request, Response } from "express";
import { NewsletterEmail, Newsletter } from "../models/newsletter.emails.model";
import nodemailer from "nodemailer";

// Create newsletter subscription
export const createEmail = async (req: Request, res: Response) => {
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

// Send bulk newsletter
export const sendNewsletter = async (req: Request, res: Response) => {
    try {
        const { title, description, descriptionOpt, linkLabel, link, websiteLink } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const image = files?.image || [];
        const imageOpt = files?.imageOpt || [];

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required.",
            });
        }

        // Get all newsletter subscribers
        const subscribers = await NewsletterEmail.find({});
        console.log("Found subscribers:", subscribers.length);

        if (!subscribers || subscribers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No newsletter subscribers found.",
            });
        }

        // Check if email configuration is available
        if (!process.env.COMPANY_EMAIL || !process.env.COMPANY_PASSWORD) {
            return res.status(500).json({
                success: false,
                message: "Email configuration not set up. Please configure COMPANY_EMAIL and COMPANY_PASSWORD environment variables.",
            });
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_PASSWORD
            }
        });

        // Process uploaded images
        const imageUrls: string[] = [];
        if (image && image.length > 0) {
            for (const img of image) {
                const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${img.filename}`;
                imageUrls.push(imageUrl);
            }
        }

        const imageOptUrls: string[] = [];
        if (imageOpt && imageOpt.length > 0) {
            for (const img of imageOpt) {
                const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${img.filename}`;
                imageOptUrls.push(imageUrl);
            }
        }

        // Create HTML email template
        const mainImagesHtml = imageUrls.map(url => `<img src="${url}" alt="${title}" class="image">`).join('');
        const optImagesHtml = imageOptUrls.map(url => `<img src="${url}" alt="${title}" class="image">`).join('');

        const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #ffaa00, #ff8800); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f9f9f9; padding: 30px; }
      .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      .btn { display: inline-block; background: #ffaa00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0 0 0; } /* add top margin */
      .image { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
      .website-link { color: #ffaa00; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        ${mainImagesHtml}
        <p>${description}</p>
        ${descriptionOpt ? `<p>${descriptionOpt}</p>` : ''}
        ${optImagesHtml}
        ${link && linkLabel ? `<a href="${link}" class="btn">${linkLabel}</a>` : ''}
      </div>
      <div class="footer">
        <p>© 2025 Next Models Nepal. All rights reserved.</p>
        <p><a href="${websiteLink || 'https://nextmodelsnepal.com/'}" class="website-link">Visit our website</a></p>
      </div>
    </div>
  </body>
  </html>
`;


        // Send emails to all subscribers with better error handling
        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (const subscriber of subscribers) {
            try {
                const mailOptions = {
                    from: process.env.COMPANY_EMAIL,
                    to: subscriber.email,
                    subject: title,
                    html: htmlTemplate
                };

                await transporter.sendMail(mailOptions);
                successCount++;
            } catch (error: any) {
                errorCount++;
                errors.push(`Failed to send to ${subscriber.email}: ${error.message}`);
                console.error(`Failed to send email to ${subscriber.email}:`, error);
            }
        }

        // Determine status based on results
        let status = 'sent';
        if (successCount === 0) {
            status = 'failed';
        } else if (errorCount > 0) {
            status = 'partial';
        }

        // Save newsletter data to database
        const newsletterData = {
            title,
            description,
            image: imageUrls,
            descriptionOpt,
            imageOpt: imageOptUrls,
            linkLabel,
            link,
            websiteLink,
            sentTo: successCount,
            totalSubscribers: subscribers.length,
            failedCount: errorCount,
            status
        };

        // Save newsletter data to database with error handling
        let savedNewsletter;
        try {
            savedNewsletter = await Newsletter.create(newsletterData);
        } catch (dbError: any) {
            console.error("Error saving newsletter to database:", dbError);
            // Continue with the response even if database save fails
            savedNewsletter = { _id: 'temp-id' };
        }

        if (successCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to send any emails. Please check your email configuration.",
                errors,
                newsletterId: savedNewsletter._id
            });
        }

        return res.status(200).json({
            success: true,
            message: `Newsletter sent successfully to ${successCount} out of ${subscribers.length} subscribers.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
            data: {
                newsletterId: savedNewsletter._id,
                sentTo: successCount,
                totalSubscribers: subscribers.length,
                failedCount: errorCount,
                title,
                description
            }
        });

    } catch (error: any) {
        console.error("Error sending bulk newsletter:", error);
        console.error("Environment variables check:");
        console.error("COMPANY_EMAIL:", process.env.COMPANY_EMAIL ? "Set" : "Not set");
        console.error("COMPANY_PASSWORD:", process.env.COMPANY_PASSWORD ? "Set" : "Not set");
        return res.status(500).json({
            success: false,
            message: "Failed to send bulk newsletter. Please try again.",
            debug: {
                hasEmailConfig: !!(process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD),
                error: error.message
            }
        });
    }
};

// Delete newsletter subscription
export const deleteNewsletter = async (req: Request, res: Response) => {
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

// Get all newsletter subscriptions
export const getAllNewsletter = async (_req: Request, res: Response) => {
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

// Get all sent newsletters (admin only)
export const getSentNewsletters = async (_req: Request, res: Response) => {
    try {
        const sentNewsletters = await Newsletter.find({}).sort({ createdAt: -1 });

        if (!sentNewsletters || sentNewsletters.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No sent newsletters found.",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sent newsletters retrieved successfully.",
            data: sentNewsletters,
        });
    } catch (error: any) {
        console.error("Error fetching sent newsletters:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving sent newsletters.",
        });
    }
};



// Delete sent newsletter record
export const deleteSentNewsletter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newsletter = await Newsletter.findByIdAndDelete(id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: `Sent newsletter with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sent newsletter record deleted successfully.",
            data: newsletter,
        });
    } catch (error: any) {
        console.error("Error deleting sent newsletter:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting sent newsletter.",
        });
    }
};
