import { Router } from "express";
import { createNewsletter, getEmailsList, deleteEmail } from "../controllers/newsletter.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Create newsletter subscription
router.post("/", createNewsletter);

// Get all newsletter subscriptions (admin only)
router.get("/", verifyAdminToken, getEmailsList);

// Delete newsletter subscription by ID (admin only)
router.delete("/:id", verifyAdminToken, deleteEmail);

export default router;
