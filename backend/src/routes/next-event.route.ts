import { Router } from "express";
import {
    createNextEventItem,
    deleteNextEventById,
    getNextEventById,
    getNextEventItems,
    updateNextEventById
} from "../controllers/next-event.controller";
import { uploadAnyImages } from "../middleware/multer.middleware";

const router = Router();

// Get all next event items
router.route("/").get(getNextEventItems);

// Create next event item 
router.route("/").post(uploadAnyImages, createNextEventItem);

// Get single next event item by ID
router.route("/:id").get(getNextEventById);

// Update next event item by ID
router.route("/:id").patch(uploadAnyImages, updateNextEventById);

// Delete next event item by ID
router.route("/:id").delete(deleteNextEventById);

export default router;
