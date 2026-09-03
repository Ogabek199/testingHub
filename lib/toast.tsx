"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: { type: ToastType; message: string; title?: string; duration?: number }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const recentToastsRef = useRef<{ [key: string]: number }>({});

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      type,
      message,
      title,
      duration = 3500,
    }: {
      type: ToastType;
      message: string;
      title?: string;
      duration?: number;
    }) => {
      const now = Date.now();
      const toastKey = `${type}:${message.trim()}`;

      // Deduplication: if exact same toast was shown within the last 2.5 seconds, ignore
      if (recentToastsRef.current[toastKey] && now - recentToastsRef.current[toastKey] < 2500) {
        return;
      }
      recentToastsRef.current[toastKey] = now;

      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, message, title, duration };

      // Keep only 1 or max 2 single toasts on screen at once
      setToasts((prev) => {
        const filtered = prev.filter((t) => t.message !== message);
        return [newToast, ...filtered].slice(0, 2);
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => {
    toast({ type: "success", message, title });
  }, [toast]);

  const error = useCallback((message: string, title?: string) => {
    toast({ type: "error", message, title });
  }, [toast]);

  const warning = useCallback((message: string, title?: string) => {
    toast({ type: "warning", message, title });
  }, [toast]);

  const info = useCallback((message: string, title?: string) => {
    toast({ type: "info", message, title });
  }, [toast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-coral-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-white/95 dark:bg-[#1a213b]/95 shadow-emerald-500/10";
      case "error":
        return "border-rose-500/40 bg-white/95 dark:bg-[#1a213b]/95 shadow-rose-500/10 ring-1 ring-rose-500/20";
      case "warning":
        return "border-amber-500/40 bg-white/95 dark:bg-[#1a213b]/95 shadow-amber-500/10";
      case "info":
        return "border-blue-500/30 bg-white/95 dark:bg-[#1a213b]/95 shadow-blue-500/10";
    }
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}

      {/* Top-Center Fixed Toast Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 transition-all duration-300 animate-slide-up ${getStyles(
              t.type
            )}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getIcon(t.type)}
              <div className="min-w-0">
                {t.title && (
                  <h5 className="text-xs font-bold text-foreground mb-0.5 leading-none">
                    {t.title}
                  </h5>
                )}
                <p className="text-xs text-foreground/90 font-medium truncate">
                  {t.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
