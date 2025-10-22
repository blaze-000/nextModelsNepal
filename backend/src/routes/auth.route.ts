import { Router } from "express";
import { register, login, changePassword, init, logout, verify } from '../controllers/auth.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';

const authRoutes = Router();

authRoutes
    .post("/login", login)
    .get("/verify", verify)
    .patch("/change-password", verifyAdminToken, changePassword)
    .post("/logout", logout)
    .post("/register", register)
    .get("/init", init);

export default authRoutes;
