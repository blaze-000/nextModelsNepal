import { Router } from "express";
import * as sponsorController from "../controllers/sponsor.controller";
import upload from "../middleware/upload"; // Import multer middleware
import { verifyAdminToken } from "src/middleware/auth.middleware";

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