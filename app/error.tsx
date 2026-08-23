"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("App error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="ios-card max-w-lg w-full p-8 md:p-10 text-center shadow-ios-lg border border-red-500/20 dark:border-red-500/30">
        {/* Animated Warning Icon */}
        <div className="h-16 w-16 rounded-3xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>System Notice</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
          {t("error.title")}
        </h1>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {t("error.desc")}
        </p>

        {error?.digest && (
          <div className="mt-4 p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-[11px] font-mono text-muted-foreground break-all">
            Digest: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-coral-glow transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t("error.btnRetry")}</span>
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-foreground font-semibold text-xs border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center gap-2 transition-all"
          >
            <Home className="h-4 w-4 text-primary" />
            <span>{t("error.btnHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
