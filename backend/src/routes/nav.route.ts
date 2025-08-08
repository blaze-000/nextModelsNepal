import { Router } from "express";
import { createNavItem, deleteNavById, getNavItem, getNavItemById, updateNavById } from "../controllers/nav.controller";


const router = Router();

// Get all navigation items
router.route("/").get(getNavItem);

// Get single navigation item by ID
router.route("/:id").get(getNavItemById);

// Create navigation item (admin only)
router.route("/").post(createNavItem);

// Update navigation item by ID (admin only)
router.route("/:id").patch(updateNavById);

// Delete navigation item by ID (admin only)
router.route("/:id").delete(deleteNavById);

export default router;
