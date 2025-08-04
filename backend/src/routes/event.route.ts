import { Router } from "express";
import { createEventItem, deleteEventById, getEventById, getEventItems, updateEventById } from "../controllers/event.controller";
import { uploadEventFiles } from "../middleware/multer.middleware";

const router = Router();

// Get all event items
router.route("/").get(getEventItems);

// Create event item 
router.route("/").post(uploadEventFiles, createEventItem);

// Get single event item by ID
router.route("/:id").get(getEventById);

// Update event item by ID
router.route("/:id").patch(uploadEventFiles, updateEventById);

// Delete event item by ID
router.route("/:id").delete(deleteEventById);

export default router; 