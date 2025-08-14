import { Router } from "express";

import upload from "../middleware/upload";
import { createAppForm, deleteAppFormById, getAllForms, getAppFormById } from "../controllers/appForm.controller";
import { appFormLimiter } from "../middleware/rateLimiters";

const router = Router();

// Get all application forms (admin only)
router.get("/", getAllForms);

// Create application form (upload images)
router.post("/",
  appFormLimiter,
  upload.array("images", 10), // field name "images", max 10 files
  createAppForm
);

// Get single application form by ID (admin only)
router.get("/:id", getAppFormById);

// Delete application form by ID (admin only)
router.delete("/:id", deleteAppFormById);

export default router;
