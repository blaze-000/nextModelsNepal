import { Router } from "express";
import { createNavItem, deleteNavById, getNavItemById, getNavItem, updateNavById } from "../controllers/nav.controller";

const router = Router();

// Get all Nav Item
router.route("/").get(getNavItem);

// Get all hero Item by Id
router.route("/:id").get(getNavItemById);

// Create Nav Item 
router.route("/").post(createNavItem);

// update Nav Item by Id
router.route("/:id").patch(updateNavById);

// Delete Nav Item by Id
router.route("/:id").delete(deleteNavById);

export default router;
