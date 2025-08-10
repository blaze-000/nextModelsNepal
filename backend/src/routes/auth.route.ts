import { Router } from "express";
import { register, login, changePassword, init, deleteAdmin } from "../controllers/auth.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const authRoutes = Router();

authRoutes
    .post("/login", login)
    .patch("/change-password", verifyAdminToken, changePassword)
    .post("/register", register)
    .get('/delete', deleteAdmin)
    .get("/init", init);

export default authRoutes;
