import { Router } from "express";
import * as eventController from '../controllers/event.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import upload, { processImages } from '../middleware/upload.js'; // Import multer middleware

const router = Router();

// Use multer middleware for the create route
router.post(
    "/",
    verifyAdminToken,
    upload.fields([
        { name: "titleImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
        { name: "purposeImage", maxCount: 1 },
    ]),
    processImages,
    eventController.createEvent,
);

router.get("/", eventController.getEvents);
router.get("/timeline", eventController.getEventsForTimeline);
router.get("/past-events", eventController.getAllPastEvents);
router.get("/past-winners", eventController.getAllPastWinners);
router.get("/gallery/latest", eventController.getLatestGallery);
router.get("/gallery/:eventId/:year", eventController.getGalleryByEventAndYear);
router.get("/:id", eventController.getEventById);

// Use multer middleware for the update route
router.patch(
    "/:id",
    verifyAdminToken,
    upload.fields([
        { name: "titleImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
        { name: "purposeImage", maxCount: 1 },
    ]),
    eventController.updateEvent,
);

router.delete("/:id", verifyAdminToken, eventController.deleteEvent);

export default router;
