import { Router } from "express";
import * as seasonController from "../controllers/season.controller";
import upload from "../middleware/upload"; // Import multer middleware
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Create season under an event (with file uploads)
router.post("/",
    verifyAdminToken,
    upload.any(), // Allow any field names for timeline icons
    seasonController.createSeason
);

// Get all seasons (with filtering)
router.get("/", seasonController.getAllSeasons);

// Get all upcoming events
router.get("/upcoming", seasonController.getAllUpcomingEvents);

// Get earliest upcoming event
router.get("/earliest-upcoming", seasonController.getEarliestUpcomingEvent);

// Get all events that are opened for voting
router.get("/voting", seasonController.getVotingEvents);

// Get details of a voting season
router.get("/voting/:slug", seasonController.getVotingSeasonDetails);

// Get seasons by event ID
router.get("/event/:eventId", seasonController.getSeasonsByEvent);

// Get season by ID
router.get("/:id", seasonController.getSeasonById);

// Get season by slug
router.get("/slug/:slug", seasonController.getSeasonBySlug);

// Update season (with file uploads)
router.patch("/:id",
    verifyAdminToken,
    upload.any(), // Allow any field names for timeline icons
    seasonController.updateSeason
);

// Delete season
router.delete("/:id",
    verifyAdminToken,
    seasonController.deleteSeason
);

export default router;