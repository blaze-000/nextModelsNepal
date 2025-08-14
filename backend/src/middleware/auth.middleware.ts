import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: { role: string; email: string };
}

export const verifyAdminToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("JWT token not received.");
        return res.status(401).json({ message: "No token found!" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string, email: string };
        req.user = decoded;
        next();
    } catch {
        console.log("JWT token verification failed.");
        res.status(401).json({ message: "Invalid or expired token" });
    }
};