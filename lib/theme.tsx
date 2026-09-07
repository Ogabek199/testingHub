"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "testinghub_theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or system
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      const initialTheme: Theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      setThemeState(initialTheme);

      const systemTheme = getSystemTheme();
      const currentResolved: ResolvedTheme = initialTheme === "system" ? systemTheme : initialTheme;
      setResolvedTheme(currentResolved);

      if (currentResolved === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      }
    } catch {
      // Fallback
    }
    setMounted(true);
  }, []);

  // Apply theme changes to DOM and storage
  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}

    const targetResolved: ResolvedTheme = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(targetResolved);

    if (targetResolved === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  // Listen to system prefers-color-scheme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if theme is system
      const currentStored = (() => {
        try {
          return localStorage.getItem(STORAGE_KEY) as Theme | null;
        } catch {
          return null;
        }
      })();

      if (!currentStored || currentStored === "system") {
        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(newResolved);
        if (newResolved === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.style.colorScheme = "dark";
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.style.colorScheme = "light";
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    // Ground truth from DOM to guarantee instant reaction and prevent desync
    const isCurrentlyDark = typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : resolvedTheme === "dark";
    const nextTheme: Theme = isCurrentlyDark ? "light" : "dark";
    applyTheme(nextTheme);
  }, [resolvedTheme, applyTheme]);

  // Initial SSR / hydration fallback matching HTML element class
  const activeResolved: ResolvedTheme = mounted
    ? resolvedTheme
    : (typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: activeResolved,
        setTheme: applyTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
