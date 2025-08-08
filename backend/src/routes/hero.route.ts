import { Router } from "express";
import { createHeroItem, deleteheroById, getHeroItem, getHeroItemById, updateheroById } from "../controllers/hero.controller";
import { uploadImages } from "../middleware/multer.middleware";


const router = Router();

// Get all hero items
router.route("/").get(getHeroItem);

// Get single hero item by ID
router.route("/:id").get(getHeroItemById);

// Create hero item (admin only)
router.route("/").post(uploadImages, createHeroItem);

// Update hero item by ID (admin only)
router.route("/:id").patch(uploadImages, updateheroById);

// Delete hero item by ID (admin only)
router.route("/:id").delete(deleteheroById);

export default router;
