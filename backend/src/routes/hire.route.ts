import { Router } from "express";
import { createHire, deleteHiredModelById, getAllHires, getHireById } from "../controllers/hire.controller";

const router = Router();

// Get all hire requests
router.route("/").get(getAllHires);

// Create hire request for a specific model
router.route("/:id").post(createHire);

// Get single hire request by ID
router.route("/:id").get(getHireById);

// Delete Hire Model by ID
router.route("/:id").delete(deleteHiredModelById);

export default router;
