import { Router } from "express";

import { uploadImages } from "../middleware/multer.middleware";
import { createAppForm, deleteAppFormById, getAppForm, getAppFormById } from "../controllers/appForm.controller";
import { appFormLimiter } from "../middleware/rateLimiters";


const router = Router();

// Get all application forms (admin only)
router.route("/").get(getAppForm);

// Create application form with event ID
router.route("/:id").post(appFormLimiter, uploadImages, createAppForm);

// Get single application form by ID (admin only)
router.route("/:id").get(getAppFormById);

// Delete application form by ID (admin only)
router.route("/:id").delete(deleteAppFormById);

export default router; 