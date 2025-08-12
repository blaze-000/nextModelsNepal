import { Router } from "express";
import {
    createPartner,
    deletePartnerById,
    getPartnerById,
    getPartners,
    updatePartnerById
} from "../controllers/partners.controller";
import upload from "../middleware/upload";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

// Get all partners (public route)
router.get("/", getPartners);

// Create partner (admin only) with image upload
router.post("/",
    verifyAdminToken,
    upload.single("sponserImage"),
    createPartner
);

// Get single partner by ID (public route)
router.get("/:id", getPartnerById);

// Update partner by ID (admin only) with optional image upload
router.patch("/:id",
    verifyAdminToken,
    upload.single("sponserImage"),
    updatePartnerById
);

// Delete partner by ID (admin only)
router.delete("/:id",
    verifyAdminToken,
    deletePartnerById
);

export default router;