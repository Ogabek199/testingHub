"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: "qa_lead" | "developer" | "client";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "testinghub_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // storage error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate auth check
    await new Promise((res) => setTimeout(res, 500));

    if (!email || !pass) {
      setIsLoading(false);
      return { success: false, error: "Email va parolni kiriting!" };
    }

    if (pass.length < 4) {
      setIsLoading(false);
      return { success: false, error: "Parol kamida 4 ta belgidan iborat bo'lishi kerak." };
    }

    const authUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 8),
      name: email.split("@")[0].toUpperCase() || "Ali Valiyev",
      email,
      company: "Tech Solutions",
      role: "qa_lead",
    };

    setUser(authUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } catch {
      // ignore
    }
    setIsLoading(false);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string, company?: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (!name || !email || !pass) {
      setIsLoading(false);
      return { success: false, error: "Barcha majburiy maydonlarni to'ldiring!" };
    }

    const authUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 8),
      name,
      email,
      company: company || "Startup Ltd",
      role: "client",
    };

    setUser(authUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } catch {
      // ignore
    }
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
