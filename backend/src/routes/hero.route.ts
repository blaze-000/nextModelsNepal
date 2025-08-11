import { Router } from "express";
import {
  createHeroItem,
  deleteheroById,
  getHeroItem,
  getHeroItemById,
  updateheroById,
} from "../controllers/hero.controller";
import { uploadAnyImages } from "../middleware/multer.middleware";

const router = Router();

// Get all hero items
router.route("/").get(getHeroItem);

// Get single hero item by ID
router.route("/:id").get(getHeroItemById);

// Create hero item (admin only)
router.route("/").post(uploadAnyImages, createHeroItem);

// Update hero item by ID (admin only)
router.route("/:id").patch(uploadAnyImages, updateheroById);

// Delete hero item by ID (admin only)
router.route("/:id").delete(deleteheroById);

export default router;
