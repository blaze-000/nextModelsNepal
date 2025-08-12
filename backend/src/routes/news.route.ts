import { Router } from "express";
import {
    createNews,
    deleteNewsById,
    getNewsById,
    getAllNews,
    updateNewsById
} from "../controllers/news.controller";
import upload from "../middleware/upload";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Get all news items (public route)
router.get("/", getAllNews);

// Create news item (admin only) with image upload
router.post("/",
    verifyAdminToken,
    upload.single("image"),
    createNews
);

// Get single news item by ID (public route)
router.get("/:id", getNewsById);

// Update news item by ID (admin only) with optional image upload
router.patch("/:id",
    verifyAdminToken,
    upload.single("image"),
    updateNewsById
);

// Delete news item by ID (admin only)
router.delete("/:id",
    verifyAdminToken,
    deleteNewsById
);

export default router;