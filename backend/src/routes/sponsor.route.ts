import { Router } from "express";
import * as sponsorController from '../controllers/sponsor.controller.js';
import upload, { processImages } from '../middleware/upload.js'; // Import multer middleware
import { verifyAdminToken } from '../middleware/auth.middleware.js';

const router = Router();

// Create sponsor with image upload
router.post("/",
    verifyAdminToken,
    upload.single('image'), // Handle single file upload for sponsor image
    sponsorController.createSponsor
);

// Get sponsors by season ID
router.get("/season/:seasonId", sponsorController.getSponsorsBySeason);

// Get sponsor by ID
router.get("/:id", sponsorController.getSponsorById);

// Update sponsor with optional image upload
router.patch("/:id",
    verifyAdminToken,
    upload.single('image'), // Handle optional image update
    sponsorController.updateSponsor
);

// Delete sponsor
router.delete("/:id",
    verifyAdminToken,
    sponsorController.deleteSponsor
);

export default router;