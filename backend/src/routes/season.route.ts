import { Router } from "express";
import * as seasonController from "../controllers/season.controller";
import upload from "../middleware/upload"; // Import multer middleware

const router = Router();

// Create season under an event (with file uploads)
router.post("/",
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'titleImage', maxCount: 1 },
        { name: 'posterImage', maxCount: 1 },
        { name: 'gallery', maxCount: 100 } // Added gallery with max 100 images
    ]),
    seasonController.createSeason
);

// Get all seasons (with filtering)
router.get("/", seasonController.getAllSeasons);

// Get seasons by event ID
router.get("/event/:eventId", seasonController.getSeasonsByEvent);

// Get season by ID
router.get("/:id", seasonController.getSeasonById);

// Update season (with file uploads)
router.patch("/:id",
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'titleImage', maxCount: 1 },
        { name: 'posterImage', maxCount: 1 },
        { name: 'gallery', maxCount: 10 } // Added gallery with max 10 images
    ]),
    seasonController.updateSeason
);

// Delete season
router.delete("/:id", seasonController.deleteSeason);

// Sync event-seasons relationship (for fixing existing data)
router.post("/sync", seasonController.syncEventSeasons);

export default router;