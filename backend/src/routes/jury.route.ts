import { Router } from "express";
import * as juryController from '../controllers/jury.controller.js';
import upload, { processImages } from '../middleware/upload.js'; // Import multer middleware
import { verifyAdminToken } from '../middleware/auth.middleware.js';

const router = Router();

// Create jury with image upload
router.post("/",
    verifyAdminToken,
    upload.single('image'), // Handle single file upload for jury image
    juryController.createJury
);

// Get jury by season ID
router.get("/season/:seasonId", juryController.getJuryBySeason);

// Get jury by ID
router.get("/:id", juryController.getJuryById);

// Update jury with optional image upload
router.put("/:id",
    verifyAdminToken,
    upload.single('image'), // Handle optional image update
    juryController.updateJury
);

// Delete jury
router.delete("/:id",
    verifyAdminToken,
    juryController.deleteJury
);

export default router;