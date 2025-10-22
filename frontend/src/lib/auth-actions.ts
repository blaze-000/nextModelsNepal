"use server";

import { cookies } from "next/headers";

/**
 * Server Action: Get session cookie value
 * Used for client-side UI state (not authentication)
 */
export async function getSessionCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("session")?.value || null;
}

/**
 * Server Action: Remove session cookie
 * Used during logout (server-side cookie clearing happens via API)
 */
export async function removeSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

