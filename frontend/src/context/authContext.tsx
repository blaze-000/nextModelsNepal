"use client";

import Cookies from "js-cookie";
import Cookies from 'js-cookie';
import { createContext, ReactNode, useEffect, useState } from "react";

export const authContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  const logout = () => {
    Cookies.remove("session");
    setUser(null);
  };

  const refreshAuth = () => {
    const sessionCookie = Cookies.get("session");
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
  };

  useEffect(() => {
    // refresh auth on mount
    refreshAuth();
    setLoading(false);

    // scroll reset on reload
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, loading, logout, refreshAuth }}>
      {children}
    </authContext.Provider>
  );
};
