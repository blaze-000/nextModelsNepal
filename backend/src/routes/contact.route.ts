import { Router } from "express";
import { createContact, deleteContactById, getContact, getContactById } from '../controllers/contact.controller.js';
import { contactLimiter } from '../middleware/rateLimiters.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';


const router = Router();

// Create contact form submission
router.post("/", createContact);

// Get all contact submissions (admin only)
router.get("/", verifyAdminToken, getContact);

// Get single contact submission by ID (admin only)
router.get("/:id", verifyAdminToken, getContactById);

// Delete contact submission by ID (admin only)
router.delete("/:id",
    verifyAdminToken,
    deleteContactById
);

export default router;