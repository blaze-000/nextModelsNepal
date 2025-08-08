// src/routes/auth.route.ts
import { Router } from "express";
import { register, login, changePassword } from "../controllers/auth.controller";
import { verifyAdminToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyAdminToken, changePassword);

export default router;
