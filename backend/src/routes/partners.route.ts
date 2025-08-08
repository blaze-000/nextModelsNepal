import { Router } from "express";
import { 
    createPartnersItem, 
    deletePartnersById, 
    getPartnersById, 
    getPartnersItems, 
    updatePartnersById 
} from "../controllers/partners.controller";
import { uploadAnyImages } from "../middleware/multer.middleware";


const router = Router();

// Get all partners items
router.route("/").get(getPartnersItems);

// Create partners item (admin only)
router.route("/").post(uploadAnyImages, createPartnersItem);

// Get single partners item by ID
router.route("/:id").get(getPartnersById);

// Update partners item by ID (admin only)
router.route("/:id").patch(uploadAnyImages, updatePartnersById);

// Delete partners item by ID (admin only)
router.route("/:id").delete(deletePartnersById);

export default router; 