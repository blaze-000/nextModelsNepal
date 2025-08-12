import { Router } from "express";
import upload from "../middleware/upload";
import {
  createModel,
  getAllModels,
  getModelById,
  updateModelById,
  deleteModelById,
} from "../controllers/model.controller";

const router = Router();

// Create a new company with image uploads
// coverImage: single file, images: multiple files (array)
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 } // Adjust maxCount here
  ]),
  createModel
);

// Get all companies
router.get("/", getAllModels);

// Get a single company by ID
router.get("/:id", getModelById);

// Update a company by ID with optional image uploads
router.patch(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 } // Adjust maxCount here
  ]),
  updateModelById
);

// Delete a company by ID
router.delete("/:id", deleteModelById);

export default router;