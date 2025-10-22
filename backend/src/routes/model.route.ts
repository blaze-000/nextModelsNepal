import { Router } from "express";
import {
    createModel,
    deleteModelById,
    getAllModels,
    getModelBySlug,
    updateModelById,
} from '../controllers/model.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import upload, { processImages } from '../middleware/upload.js';

const router = Router();

// Create a new company with image uploads
// coverImage: single file, images: multiple files (array)
router.post(
    "/",
    verifyAdminToken,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 10 }, // Adjust maxCount here
    ]),
    processImages,
    createModel,
);

// Get all companies
router.get("/", getAllModels);

// Get a single company by ID
router.get("/:slug", getModelBySlug);

// Update a company by ID with optional image uploads
router.patch(
    "/:id",
    verifyAdminToken,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 10 }, // Adjust maxCount here
    ]),
    processImages,
    updateModelById,
);

// Delete a company by ID
router.delete("/:id", verifyAdminToken, deleteModelById);

export default router;
