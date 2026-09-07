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

export function formatUzbekPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "+998 ";

  let cleanDigits = digits;
  if (cleanDigits.startsWith("998")) {
    cleanDigits = cleanDigits.substring(3);
  }
  cleanDigits = cleanDigits.substring(0, 9);

  let formatted = "+998";
  if (cleanDigits.length > 0) {
    formatted += " " + cleanDigits.substring(0, 2);
  }
  if (cleanDigits.length >= 3) {
    formatted += " " + cleanDigits.substring(2, 5);
  }
  if (cleanDigits.length >= 6) {
    formatted += " " + cleanDigits.substring(5, 7);
  }
  if (cleanDigits.length >= 8) {
    formatted += " " + cleanDigits.substring(7, 9);
  }

  return formatted;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

