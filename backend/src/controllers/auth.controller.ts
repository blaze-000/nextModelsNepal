import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/admin.model";
import { signupSchema } from "../validations/auth.validations";
import { changePasswordSchema } from "../validations/auth.validations";

export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        console.log('Request body:', req.body);
        console.log('Email:', email);
        console.log('Password provided:', !!password); // Shows true/false without exposing password

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await AdminModel.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });
        console.log('Admin found:', !!admin);

        // Check if admin has a password stored
        if (!admin.password) {
            return res.status(500).json({ message: "Admin account error" });
        }
        console.log('Admin password exists:', !!admin?.password);


        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        const payload = {
            role: "admin",
            email: admin.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "7d"
        });

        // 1️⃣ Secure httpOnly token cookie for backend auth
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.PRODUCTION === "TRUE",
            sameSite: process.env.PRODUCTION === "TRUE" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 2️⃣ cookie for frontend route protection
        res.cookie(
            "session",
            encodeURIComponent(JSON.stringify(payload)),
            {
                httpOnly: false,
                path: '/',
                secure: process.env.PRODUCTION === "TRUE",
                sameSite: process.env.PRODUCTION === "TRUE" ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }
        );

        return res.json({ message: "Login successful" });
    } catch (err) {
        console.error(err);
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
        console.error(err); // Optional: log error for debugging
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

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await AdminModel.findOne();
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        await admin.deleteOne();
        res.json({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}