import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import upload from "../middleware/upload"; // Import multer middleware
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Use multer middleware for the create route
router.post("/",
  verifyAdminToken,
  upload.fields([
    { name: 'titleImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'purposeImage', maxCount: 1 }
  ]),
  eventController.createEvent
);

router.get("/", eventController.getEvents);
router.get("/timeline", eventController.getEventsForTimeline);
router.get("/:id", eventController.getEventById);

// Use multer middleware for the update route
router.patch("/:id",
  verifyAdminToken,
  upload.fields([
    { name: 'titleImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'purposeImage', maxCount: 1 }
  ]),
  eventController.updateEvent
);

router.delete("/:id",
  verifyAdminToken,
  eventController.deleteEvent
);

export default router;