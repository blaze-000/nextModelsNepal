import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import upload from "../middleware/upload"; // Import multer middleware

const router = Router();

// Use multer middleware for the create route
router.post("/", 
  upload.fields([
    { name: 'titleImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'purposeImage', maxCount: 1 }
  ]), 
  eventController.createEvent
);

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.patch("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;