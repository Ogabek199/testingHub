import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatNumber(num: number | string): string {
  if (num === undefined || num === null || num === "") return "0";
  const n = typeof num === "string" ? Number(num) : num;
  if (isNaN(n)) return String(num);
  // Deterministic formatting using comma thousands separator (prevents SSR/CSR locale hydration mismatch)
  const parts = n.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

