"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import uzDict from "@/locales/uz.json";
import ruDict from "@/locales/ru.json";
import enDict from "@/locales/en.json";

export type Language = "uz" | "ru" | "en";

const dictionaries: Record<Language, typeof uzDict> = {
  uz: uzDict,
  ru: ruDict,
  en: enDict,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  dict: typeof uzDict;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("testinghub_lang") as Language;
      if (saved && (saved === "uz" || saved === "ru" || saved === "en")) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("testinghub_lang", lang);
    } catch {
      // ignore
    }
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = dictionaries[language] || uzDict;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to uzbek
        let fb: any = uzDict;
        for (const fbKey of keys) {
          if (fb && typeof fb === "object" && fbKey in fb) {
            fb = fb[fbKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fb === "string" ? fb : fallback || path;
      }
    }
    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dict: dictionaries[language] || uzDict,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
