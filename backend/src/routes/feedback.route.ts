import { Router } from "express";
import upload from "../middleware/upload";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
} from "../controllers/feedback.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Create a new feedback with image upload
router.post("/", verifyAdminToken, upload.single("image"), createFeedback);

// Get all feedbacks
router.get("/", getAllFeedbacks);

// Get a single feedback by ID
router.get("/:id", getFeedbackById);

// Update a feedback by ID with optional image upload
router.patch("/:id", verifyAdminToken, upload.single("image"), updateFeedbackById);

// Delete a feedback by ID
router.delete("/:id", verifyAdminToken, deleteFeedbackById);

export default router;