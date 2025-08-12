import { Router } from "express";

import upload from "src/middleware/upload";
import { createAppForm, deleteAppFormById, getAppForm, getAppFormById } from "../controllers/appForm.controller";
import { appFormLimiter } from "../middleware/rateLimiters";

const router = Router();

// Get all application forms (admin only)
router.route("/").get(getAppForm);

// Create application form with event ID (upload images)
router
  .route("/:id")
  .post(
    appFormLimiter,
    upload.array("images", 10), // field name "images", max 10 files
    createAppForm
  );

// Get single application form by ID (admin only)
router.route("/:id").get(getAppFormById);

// Delete application form by ID (admin only)
router.route("/:id").delete(deleteAppFormById);

export default router;
