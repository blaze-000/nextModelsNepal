import { Router } from "express";
import * as seasonController from "../controllers/season.controller";
import upload from "../middleware/upload"; // Import multer middleware
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Create season under an event (with file uploads)
router.post("/",
    verifyAdminToken,
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

// Get all upcoming events
router.get("/upcoming", seasonController.getAllUpcomingEvents);

// Get earliest upcoming event
router.get("/earliest-upcoming", seasonController.getEarliestUpcomingEvent);

// Get seasons by event ID
router.get("/event/:eventId", seasonController.getSeasonsByEvent);

// Get season by ID
router.get("/:id", seasonController.getSeasonById);

// Update season (with file uploads)
router.patch("/:id",
    verifyAdminToken,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'titleImage', maxCount: 1 },
        { name: 'posterImage', maxCount: 1 },
        { name: 'gallery', maxCount: 10 } // Added gallery with max 10 images
    ]),
    seasonController.updateSeason
);

// Delete season
router.delete("/:id",
    verifyAdminToken,
    seasonController.deleteSeason
);

export default router;