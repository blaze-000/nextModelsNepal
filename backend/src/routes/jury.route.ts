import { Router } from "express";
import * as juryController from "../controllers/jury.controller";
import upload from "../middleware/upload"; // Import multer middleware

const router = Router();

// Create jury with image upload
router.post("/",
    upload.single('image'), // Handle single file upload for jury image
    juryController.createJury
);

// Get jury by season ID
router.get("/season/:seasonId", juryController.getJuryBySeason);

// Get jury by ID
router.get("/:id", juryController.getJuryById);

// Update jury with optional image upload
router.put("/:id",
    upload.single('image'), // Handle optional image update
    juryController.updateJury
);

// Delete jury
router.delete("/:id", juryController.deleteJury);

export default router;