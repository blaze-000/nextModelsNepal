import { Router } from "express";
import {
  createHeroItem,
  deleteheroById,
  getHeroItem,
  getHeroItemById,
  updateheroById,
} from "../controllers/hero.controller";
import upload from "../middleware/upload";

const router = Router();

// Get all hero items
router.route("/").get(getHeroItem);

// Get single hero item by ID
router.route("/:id").get(getHeroItemById);

// Create hero item (admin only)
router.route("/").post(upload.fields([
  { name: 'titleImage', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]), createHeroItem);

// Update hero item by ID (admin only)
router.route("/:id").patch(upload.fields([
  { name: 'titleImage', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]), updateheroById);

// Delete hero item by ID (admin only)
router.route("/:id").delete(deleteheroById);

export default router;
