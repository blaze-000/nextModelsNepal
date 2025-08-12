import { Router } from "express";
import { 
    createMember, 
    deleteMemberById, 
    getMemberById, 
    getAllMember, 
    updateMemberById 
} from "../controllers/member.controller";
import { uploadImagesAndIcons } from "../middleware/multer.middleware";


const router = Router();

// Get all members
router.route("/").get(getAllMember);

// Create member (admin only)
router.route("/").post(uploadImagesAndIcons, createMember);

// Get single member by ID
router.route("/:id").get(getMemberById);

// Update member by ID (admin only)
router.route("/:id").patch(uploadImagesAndIcons, updateMemberById);

// Delete member by ID (admin only)
router.route("/:id").delete(deleteMemberById);

export default router;