import { Router } from "express";
import { createHire, deleteHiredModelById, getAllHires, getHireById } from "../controllers/hire.controller";
import { hireLimiter } from "../middleware/rateLimiters";


const router = Router();

// Get all hire requests (admin only)
router.route("/").get(getAllHires);

// Create hire request for specific model
router.route("/:id").post(hireLimiter, createHire);

// Get single hire request by ID (admin only)
router.route("/:id").get(getHireById);

// Delete hire request by ID (admin only)
router.route("/:id").delete(deleteHiredModelById);

export default router;
