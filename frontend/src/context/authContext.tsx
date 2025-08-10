"use client";
import Cookies from 'js-cookie';
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: AdminUser | null;
  setUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  loading: boolean;
}

export const authContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AdminUser | null>(null);


  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    console.log(`Session: ${sessionCookie}`)
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
    setLoading(false);
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, loading }}>
      {children}
    </authContext.Provider>
  );
};
