import { Router } from "express";
import upload from "../middleware/upload";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
} from "../controllers/feedback.controller";

const router = Router();

// Create a new feedback with image upload
router.post("/", upload.single("image"), createFeedback);

// Get all feedbacks
router.get("/", getAllFeedbacks);

// Get a single feedback by ID
router.get("/:id", getFeedbackById);

// Update a feedback by ID with optional image upload
router.patch("/:id", upload.single("image"), updateFeedbackById);

// Delete a feedback by ID
router.delete("/:id", deleteFeedbackById);

export default router;