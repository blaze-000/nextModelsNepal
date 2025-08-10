import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token found!" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string; email: string };
        (req as any).user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
