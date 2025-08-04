import { Router } from "express";

import { uploadImages } from "../middleware/multer.middleware";
import { createAppForm, deleteAppFormById, getAppForm, getAppFormById } from "../controllers/appForm.controller";

const router = Router();

// Get all career items
router.route("/").get(getAppForm);

// Create application form with event ID
router.route("/:id").post(uploadImages, createAppForm);

// Get single career item by ID
router.route("/:id").get(getAppFormById);

// Delete career item by ID
router.route("/:id").delete(deleteAppFormById);

export default router; 