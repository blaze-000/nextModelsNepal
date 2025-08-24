import { Router } from "express";
import * as contestantController from "../controllers/contestant.controller";
import upload from "../middleware/upload";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Create contestant with image upload
router.post("/",
    verifyAdminToken,
    upload.single('image'), // Handle single file upload for contestant image
    contestantController.createContestant
);

// Get contestants by season ID
router.get("/season/:seasonId", contestantController.getContestantsBySeason);

// Get contestants by season slug
router.get("/season-slug/:slug", contestantController.getContestantsBySeasonSlug);

// Get contestant by ID
router.get("/:id", contestantController.getContestantById);

// Update contestant with optional image upload
router.put("/:id",
    verifyAdminToken,
    upload.single('image'), // Handle optional image update
    contestantController.updateContestant
);

// Delete contestant
router.delete("/:id",
    verifyAdminToken,
    contestantController.deleteContestant
);

export default router;
