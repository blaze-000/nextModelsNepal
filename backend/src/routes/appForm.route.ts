import { Router } from "express";

import {
    createAppForm,
    deleteAppFormById,
    getAllForms,
    getAppFormById,
    getUpcomingInfo,
} from '../controllers/appForm.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import upload, { processImages } from '../middleware/upload.js';

const router = Router();

// Get all application forms (admin only)
router.get("/", verifyAdminToken, getAllForms);

// Create application form (upload images)
router.post(
    "/",
    upload.array("images", 10), // field name "images", max 10 files
    processImages,
    createAppForm,
);

router.get("/upcoming-info", getUpcomingInfo);

// Get single application form by ID (admin only)
router.get("/:id", verifyAdminToken, getAppFormById);

// Delete application form by ID (admin only)
router.delete("/:id", verifyAdminToken, deleteAppFormById);

export default router;
