import { Router } from "express";
import {
    createContact,
    deleteContactById,
    getContactById,
    getContact,
} from "../controllers/contact.controller";

const router = Router();

// Create contact item (save to DB + send email)
router.route("/").post(createContact);

// Get all contact items
router.route("/").get(getContact);

// Get single contact item by ID
router.route("/:id").get(getContactById);

// Delete contact item by ID
router.route("/:id").delete(deleteContactById);


export default router;