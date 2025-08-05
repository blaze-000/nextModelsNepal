import { Router } from "express";
import { 
    createFeedbackItem, 
    deleteFeedbackById, 
    getFeedbackById, 
    getFeedbackItems, 
    updateFeedbackById 
} from "../controllers/feedback.controller";
import { uploadAnyImages } from "../middleware/multer.middleware";

const router = Router();

// Get all feedback items
router.route("/").get(getFeedbackItems);

// Create feedback item 
router.route("/").post(uploadAnyImages, createFeedbackItem);

// Get single feedback item by ID
router.route("/:id").get(getFeedbackById);

// Update feedback item by ID
router.route("/:id").patch(uploadAnyImages, updateFeedbackById);

// Delete feedback item by ID
router.route("/:id").delete(deleteFeedbackById);

export default router; 