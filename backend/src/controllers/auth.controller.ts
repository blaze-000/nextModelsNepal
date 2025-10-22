import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminModel } from '../models/admin.model.js';
import { signupSchema } from '../validations/auth.validations.js';
import { changePasswordSchema } from '../validations/auth.validations.js';
import { AuthService, AuthServiceError } from '../services/auth.service.js';

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        const result = await AuthService.authenticateAdmin(email, password);
        AuthService.setAuthCookies(res, result);

        return res.json({ message: "Login successful" });
    } catch (err) {
        if (err instanceof AuthServiceError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            role: string;
            email: string;
        };

        // Verify admin still exists in database
        const admin = await AdminModel.findOne({ email: decoded.email });
        if (!admin) {
            return res.status(401).json({ message: "Admin not found" });
        }

        return res.json({
            user: {
                role: decoded.role,
                email: decoded.email
            }
        });
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        console.error("Auth verification error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        // 1. Validate input
        const result = changePasswordSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: result.error.flatten().fieldErrors,
            });
        }

        const { oldPassword, newPassword } = result.data;
        const { email } = (req as any).user;

        // 2. Ensure new password is different
        if (oldPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
            });
        }

        // 3. Find admin
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 4. Verify old password
        const valid = await bcrypt.compare(oldPassword, admin.password);
        if (!valid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // 5. Hash & save new password
        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        return res.json({ message: "Password changed successfully" });
    } catch (err) {
        // Production: Error handling for admin login
        return res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        // Clear token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.PRODUCTION === "TRUE",
            sameSite: process.env.PRODUCTION === "TRUE" ? "none" : "strict"
        });

        // Clear session cookie
        res.clearCookie("session", {
            httpOnly: false,
            path: '/',
            secure: process.env.PRODUCTION === "TRUE",
            sameSite: process.env.PRODUCTION === "TRUE" ? "none" : "strict"
        });

        return res.json({ message: "Logout successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const init = async (_req: Request, res: Response) => {
    try {
        const admin = await AdminModel.findOne();
        if (admin) return res.status(200).json({ message: true, description: "Admin already exists" });

        res.status(200).json({ message: false, description: "You can signup." });
    } catch {
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const body = signupSchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).json({ message: "Invalid input", errors: body.error.flatten().fieldErrors });
        }
        const { email, password } = body.data;

        const existingAdmin = await AdminModel.findOne();
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await AdminModel.create({ email, password: hashedPassword });

        res.status(201).json({ message: "Admin registered", admin: { email: admin.email } });
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
};
