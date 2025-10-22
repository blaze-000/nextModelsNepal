import { Router } from "express";
import {
    createFeedback,
    deleteFeedbackById,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedbackById,
} from '../controllers/feedback.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import upload, { processImages } from '../middleware/upload.js';

const router = Router();

// Create a new feedback with image upload
router.post(
    "/",
    verifyAdminToken,
    upload.single("image"),
    processImages,
    createFeedback,
);

// Get all feedbacks
router.get("/", getAllFeedbacks);

// Get a single feedback by ID
router.get("/:id", getFeedbackById);

// Update a feedback by ID with optional image upload
router.patch(
    "/:id",
    verifyAdminToken,
    upload.single("image"),
    processImages,
    updateFeedbackById,
);

// Delete a feedback by ID
router.delete("/:id", verifyAdminToken, deleteFeedbackById);

export default router;
