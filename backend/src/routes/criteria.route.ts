import { Router } from "express";
import * as criteriaController from '../controllers/criteria.controller.js';
import upload, { processImages } from '../middleware/upload.js'; // Import multer middleware
import { verifyAdminToken } from '../middleware/auth.middleware.js';
const router = Router();

// Create criteria with icon upload
router.post("/",
    verifyAdminToken,
    upload.single('icon'), // Handle single file upload for icon
    criteriaController.createCriteria
);

// Get all criteria for a season
router.get("/season/:seasonId", criteriaController.getCriteriaBySeason);

// Get criteria by ID
router.get("/:id", criteriaController.getCriteriaById);

// Update criteria with optional icon upload
router.put("/:id",
    verifyAdminToken,
    upload.single('icon'), // Handle optional icon update
    criteriaController.updateCriteria
);

// Delete criteria
router.delete("/:id",
    verifyAdminToken,
    criteriaController.deleteCriteria
);

export default router;