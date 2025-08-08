import { Router } from "express";
import { 
    createModels, 
    deleteModelsById, 
    getModels, 
    getModelsById, 
    updateModelsById 
} from "../controllers/companyModels.controller";
import { uploadCompanyModelFiles } from "../middleware/multer.middleware";


const router = Router();

// Get all models
router.route("/").get(getModels);

// Create model (admin only)
router.route("/").post(uploadCompanyModelFiles, createModels);

// Get single model by ID
router.route("/:id").get(getModelsById);

// Update model by ID (admin only)
router.route("/:id").patch(uploadCompanyModelFiles, updateModelsById);

// Delete model by ID (admin only)
router.route("/:id").delete(deleteModelsById);

export default router; 