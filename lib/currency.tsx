"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Currency = "UZS" | "USD";

// $100 = 1,200,000 so'm → 1 USD = 12,000 so'm
export const UZS_PER_USD = 12000;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format UZS amount in selected currency */
  format: (uzs: number) => string;
  /** Convert UZS to selected currency number */
  convert: (uzs: number) => number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("UZS");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("testinghub_currency") as Currency;
      if (saved === "UZS" || saved === "USD") {
        setCurrencyState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("testinghub_currency", c);
    } catch {}
  }, []);

  const format = useCallback(
    (uzs: number): string => {
      if (currency === "UZS") {
        return uzs.toLocaleString("ru-RU") + " so'm";
      } else {
        const rawUsd = uzs / UZS_PER_USD;
        // Round up to nearest 5: 43 -> 45, 82 -> 85
        const usd = Math.max(5, Math.ceil(rawUsd / 5) * 5);
        return "$" + usd.toLocaleString("en-US");
      }
    },
    [currency]
  );

  const convert = useCallback(
    (uzs: number): number => {
      if (currency === "UZS") return uzs;
      const rawUsd = uzs / UZS_PER_USD;
      return Math.max(5, Math.ceil(rawUsd / 5) * 5);
    },
    [currency]
  );

  const symbol = currency === "UZS" ? "so'm" : "$";

  const value = useMemo(
    () => ({ currency, setCurrency, format, convert, symbol }),
    [currency, setCurrency, format, convert, symbol]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
