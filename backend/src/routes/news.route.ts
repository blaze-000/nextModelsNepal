import { Router } from "express";
import { 
    createNewsItem, 
    deleteNewsById, 
    getNewsById, 
    getNewsItems, 
    updateNewsById 
} from "../controllers/news.controller";
import { uploadImages } from "../middleware/multer.middleware";

const router = Router();

// Get all news items
router.route("/").get(getNewsItems);

// Create news item 
router.route("/").post(uploadImages, createNewsItem);

// Get single news item by ID
router.route("/:id").get(getNewsById);

// Update news item by ID
router.route("/:id").patch(uploadImages, updateNewsById);

// Delete news item by ID
router.route("/:id").delete(deleteNewsById);

export default router; 