import { Router } from "express";
import { createEventItem, deleteEventById, getEventById, getEventItems, updateEventById } from "../controllers/event.controller";
import { uploadImages, uploadImagesAndIcons } from "../middleware/multer.middleware";

const router = Router();

// Get all event items
router.route("/").get(getEventItems);

// Create event item 
router.route("/").post(uploadImagesAndIcons, createEventItem);

// Get single event item by ID
router.route("/:id").get(getEventById);

// Update event item by ID
router.route("/:id").patch(uploadImagesAndIcons, updateEventById);

// Delete event item by ID
router.route("/:id").delete(deleteEventById);

export default router; 