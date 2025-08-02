import { Router } from "express";
import { 
    createCareerItem, 
    deleteCareerById, 
    getCareerById, 
    getCareerItems, 
    updateCareerById 
} from "../controllers/career.controller";
import { uploadImages } from "../middleware/multer.middleware";

const router = Router();

// Get all career items
router.route("/").get(getCareerItems);

// Create career item 
router.route("/").post(uploadImages, createCareerItem);

// Get single career item by ID
router.route("/:id").get(getCareerById);

// Update career item by ID
router.route("/:id").patch(uploadImages, updateCareerById);

// Delete career item by ID
router.route("/:id").delete(deleteCareerById);

export default router; 