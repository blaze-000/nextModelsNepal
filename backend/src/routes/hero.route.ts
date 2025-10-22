import { Router } from "express";
import {
    createHeroItem,
    deleteheroById,
    getHeroItem,
    getHeroItemById,
    updateheroById,
} from '../controllers/hero.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import upload, { processImages } from '../middleware/upload.js';

const router = Router();

// Get all hero items
router.get("/", getHeroItem);

// Get single hero item by ID
router.get("/:id", getHeroItemById);

// Create hero item (admin only)
router.post(
    "/",
    verifyAdminToken,
    upload.fields([
        { name: "titleImage", maxCount: 1 },
        { name: "image_1", maxCount: 1 },
        { name: "image_2", maxCount: 1 },
        { name: "image_3", maxCount: 1 },
        { name: "image_4", maxCount: 1 },
    ]),
    processImages,
    createHeroItem,
);

// Update hero item by ID (admin only)
router.patch(
    "/:id",
    verifyAdminToken,
    upload.fields([
        { name: "titleImage", maxCount: 1 },
        { name: "image_1", maxCount: 1 },
        { name: "image_2", maxCount: 1 },
        { name: "image_3", maxCount: 1 },
        { name: "image_4", maxCount: 1 },
    ]),
    processImages,
    updateheroById,
);

// Delete hero item by ID (admin only)
router.delete("/:id", verifyAdminToken, deleteheroById);

export default router;
