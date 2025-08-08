import { Router } from "express";
import { createContact, deleteContactById, getContact, getContactById } from "../controllers/contact.controller";
import { contactLimiter } from "../middleware/rateLimiters";


const router = Router();

// Create contact form submission
router.route("/").post(contactLimiter, createContact);

// Get all contact submissions (admin only)
router.route("/").get(getContact);

// Get single contact submission by ID (admin only)
router.route("/:id").get(getContactById);

// Delete contact submission by ID (admin only)
router.route("/:id").delete(deleteContactById);

export default router;