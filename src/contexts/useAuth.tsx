"use client";
import { Account, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  account: (Account & { user: User }) | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
  getToken: () => string | null;
  checkAuthetification: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState<(Account & { user: User }) | null>(null);
  const router = useRouter();

  const saveToken = useCallback((token: string) => {
    localStorage.setItem("token", token);
  }, []);

  const removeToken = useCallback(() => {
    localStorage.removeItem("token");
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    setAccount(null);
    router.push("/");
  }, [removeToken, router]);

  const checkAuthetification = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        removeToken();
        return;
      }

      const data = await response.json();
      setAccount(data.account);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      removeToken();
    }
  }, [getToken, removeToken]);

  useEffect(() => {
    checkAuthetification();
  }, [checkAuthetification]);

  const contextValue = useMemo(
    () => ({ isAuthenticated, account, saveToken, removeToken, getToken, checkAuthetification, logout }),
    [isAuthenticated, account, saveToken, removeToken, getToken, checkAuthetification, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
