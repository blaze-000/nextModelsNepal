import { Router } from "express";
import {
    createModels,
    getModels,
    getModelsById,
    updateModelsById,
    deleteModelsById
} from "../controllers/companyModels.controller";
import { uploadCompanyModelFiles } from "../middleware/multer.middleware";

const router = Router();

// Get all models items
router.route("/").get(getModels);

// Create models item 
router.route("/").post(uploadCompanyModelFiles, createModels);

// Get single models item by ID
router.route("/:id").get(getModelsById);

// Update models item by ID
router.route("/:id").patch(uploadCompanyModelFiles, updateModelsById);

// Delete models item by ID
router.route("/:id").delete(deleteModelsById);

export default router; 