"use client";
import Cookies from 'js-cookie';
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: AdminUser | null;
  setUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  loading: boolean;
  logout: () => void;
  checkAuth: () => void;
}

export const authContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  const logout = () => {
    Cookies.remove('session');
    setUser(null);
  };

  const checkAuth = () => {
    const sessionCookie = Cookies.get('session');
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
    checkAuth();
    setLoading(false);
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, loading, logout, checkAuth }}>
      {children}
    </authContext.Provider>
  );
};
