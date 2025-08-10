import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/admin.model";

export const init = async (_req: Request, res: Response) => {
    try {
        const admin = await AdminModel.findOne();
        if (admin) return res.status(400).json({ message: false });

        res.status(200).json({ message: true });
    } catch {
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password }: { email: string, password: string } = req.body;

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingAdmin = await AdminModel.findOne();
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await AdminModel.create({ email, password: hashedPassword });

        res.status(201).json({ message: "Admin registered", admin: { email: admin.email } });
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const admin = await AdminModel.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            {
                role: "admin",
                email: admin.email
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            // httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/api/auth",
            // secure: true,
            // sameSite: "none",
        });

        res.json({ token });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (oldPassword !== newPassword) {
            return res.status(400).json({ message: "New password must be the same as old password" });
        }

        const admin = await AdminModel.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const valid = await bcrypt.compare(oldPassword, admin.password);
        if (!valid) return res.status(400).json({ message: "Old password is wrong" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.json({ message: "Password changed successfully" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};
