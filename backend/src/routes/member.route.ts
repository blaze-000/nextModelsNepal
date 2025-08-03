import { Router } from "express";
import {
    createMember,
    getMemberById,
    getAllMember,
    updateMemberById,
    deleteMemberById
} from "../controllers/member.controller";
import { uploadImagesAndIcons } from "../middleware/multer.middleware";

const router = Router();

// Get all Nav Item
router.route("/").get(getAllMember);

// Create Nav Item 
router.route("/").post(uploadImagesAndIcons, createMember);

// Get all hero Item by Id
router.route("/:id").get(getMemberById);

// update Nav Item by Id
router.route("/:id").patch(uploadImagesAndIcons, updateMemberById);

// Delete Nav Item by Id
router.route("/:id").delete(deleteMemberById);


export default router;