import { Router } from "express";
import * as winnerController from "../controllers/winner.controller";
import upload from "../middleware/upload"; // Import multer middleware

const router = Router();

// Create winner with image upload
router.post("/",
    upload.single('image'), // Handle single file upload for winner image
    winnerController.createWinner
);

// Get winners by season ID
router.get("/season/:seasonId", winnerController.getWinnersBySeason);

// Get winner by ID
router.get("/:id", winnerController.getWinnerById);

// Update winner with optional image upload
router.put("/:id",
    upload.single('image'), // Handle optional image update
    winnerController.updateWinner
);

// Delete winner
router.delete("/:id", winnerController.deleteWinner);

export default router;