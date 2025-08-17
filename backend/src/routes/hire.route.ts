import { Router } from "express";
import { createHire, deleteHiredModelById, getAllHires, getHireById } from "../controllers/hire.controller";
import { hireLimiter } from "../middleware/rateLimiters";
import { verifyAdminToken } from "../middleware/auth.middleware";


const router = Router();

// Get all hire requests (admin only)
router.get("/", getAllHires);

// Create hire request for specific model
router.post("/:id", createHire);

// Get single hire request by ID (admin only)
router.get("/:id", getHireById);

// Delete hire request by ID (admin only)
router.delete("/:id",
    verifyAdminToken,
    deleteHiredModelById
);

export default router;
