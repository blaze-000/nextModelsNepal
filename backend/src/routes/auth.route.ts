import { Router } from "express";
import { register, login, changePassword, init, logout } from "../controllers/auth.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const authRoutes = Router();

authRoutes
    .post("/login", login)
    .patch("/change-password", verifyAdminToken, changePassword)
    .post("/logout", logout)
    .post("/register", register)
    .get("/init", init);

export default authRoutes;
