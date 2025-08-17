import { Router } from "express";
import upload from "../middleware/upload";
import {
  createModel,
  getAllModels,
  getModelBySlug,
  updateModelById,
  deleteModelById,
} from "../controllers/model.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Create a new company with image uploads
// coverImage: single file, images: multiple files (array)
router.post(
  "/",
  verifyAdminToken,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 } // Adjust maxCount here
  ]),
  createModel
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
    { name: "images", maxCount: 10 } // Adjust maxCount here
  ]),
  updateModelById
);

// Delete a company by ID
router.delete("/:id",
  verifyAdminToken,
  deleteModelById
);

export default router;