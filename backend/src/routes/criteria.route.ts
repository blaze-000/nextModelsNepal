import { Router } from "express";
import * as criteriaController from "../controllers/criteria.controller";
import upload from "../middleware/upload"; // Import multer middleware

const router = Router();

// Create criteria with icon upload
router.post("/",
    upload.single('icon'), // Handle single file upload for icon
    criteriaController.createCriteria
);

// Get all criteria for a season
router.get("/season/:seasonId", criteriaController.getCriteriaBySeason);

// Get criteria by ID
router.get("/:id", criteriaController.getCriteriaById);

// Update criteria with optional icon upload
router.put("/:id",
    upload.single('icon'), // Handle optional icon update
    criteriaController.updateCriteria
);

// Delete criteria
router.delete("/:id", criteriaController.deleteCriteria);

export default router;