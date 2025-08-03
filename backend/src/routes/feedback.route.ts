import { Router } from "express";
import { 
    createFeedbackItem, 
    deleteFeedbackById, 
    getFeedbackById, 
    getFeedbackItems, 
    updateFeedbackById 
} from "../controllers/feedback.controller";
import { uploadImages } from "../middleware/multer.middleware";

const router = Router();

// Get all feedback items
router.route("/").get(getFeedbackItems);

// Create feedback item 
router.route("/").post(uploadImages, createFeedbackItem);

// Get single feedback item by ID
router.route("/:id").get(getFeedbackById);

// Update feedback item by ID
router.route("/:id").patch(uploadImages, updateFeedbackById);

// Delete feedback item by ID
router.route("/:id").delete(deleteFeedbackById);

export default router; 