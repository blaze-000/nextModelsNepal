"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { getSessionCookie, removeSessionCookie } from "@/lib/auth-actions";

export const authContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<AdminUser | null>(null);

    const logout = async () => {
        await removeSessionCookie();
        setUser(null);
    };

    const refreshAuth = async () => {
        try {
            const sessionCookie = await getSessionCookie();
            if (sessionCookie) {
                try {
                    const user = JSON.parse(decodeURIComponent(sessionCookie));
                    setUser(user);
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to refresh auth:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        // Refresh auth on mount
        refreshAuth().finally(() => setLoading(false));

        // Scroll reset on reload
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <authContext.Provider
            value={{ user, setUser, loading, logout, refreshAuth }}
        >
            {children}
        </authContext.Provider>
    );
};
