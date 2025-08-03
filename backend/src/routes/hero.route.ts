import { Router } from "express";
import { createHeroItem, deleteheroById, getHeroItemById, getheroItem, updateheroById } from "../controllers/hero.controller";
import { uploadImages } from "../middleware/multer.middleware";

const router = Router();

// Get all hero Item
router.route("/").get(getheroItem);

// Get all hero Item by Id
router.route("/:id").get(getHeroItemById);

// Create hero Item 
router.route("/").post(uploadImages, createHeroItem);

// update hero Item by Id
router.route("/:id").patch(uploadImages, updateheroById);

// Delete hero Item by Id
router.route("/:id").delete(deleteheroById);

export default router;
