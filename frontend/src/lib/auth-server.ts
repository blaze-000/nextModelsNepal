import { redirect } from "next/navigation";
import { orpc } from "./orpc-client";

interface AuthUser {
    role: string;
    email: string;
}

/**
 * Server-side authentication verification
 * Checks httpOnly token cookie and validates with backend
 * Redirects to /login if not authenticated
 */
export async function verifyServerAuth(): Promise<AuthUser> {
    try {
        const result = await orpc.auth.verify();
        return result.user;
    } catch (error) {
        // ORPC throws on authentication failure
        redirect("/login");
    }
}

/**
 * Check if user is authenticated (for login page)
 * Returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    try {
        await orpc.auth.verify();
        return true;
    } catch {
        return false;
    }
}

