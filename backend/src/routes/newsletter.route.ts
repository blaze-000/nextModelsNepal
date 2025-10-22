import { Router } from "express";
import { createEmail, getEmailsList, deleteEmail, sendNewsletter, deleteNewsletter, getAllNewsletter, getSentNewsletters, deleteSentNewsletter } from '../controllers/newsletter.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import upload, { processImages } from '../middleware/upload.js';

const router = Router();

// Create newsletter subscription
router.post("/", createEmail);

// Get all newsletter subscriptions (admin only)
router.get("/", verifyAdminToken, getEmailsList);

// Delete newsletter subscription by ID (admin only)
router.delete("/:id", verifyAdminToken, deleteEmail);

// Send bulk newsletter (admin only)
router.post("/send", verifyAdminToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageOpt', maxCount: 1 }
]), sendNewsletter);

// Delete newsletter subscription (admin only)
router.delete("/delete/:id", verifyAdminToken, deleteNewsletter);

// Get all newsletter subscriptions (admin only)
router.get("/all", verifyAdminToken, getAllNewsletter);

// Get all sent newsletters (admin only)
router.get("/sent", verifyAdminToken, getSentNewsletters);



// Delete sent newsletter record (admin only)
router.delete("/sent/:id", verifyAdminToken, deleteSentNewsletter);

export default router;
