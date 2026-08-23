"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="ios-card max-w-md w-full p-8 text-center shadow-ios border border-red-500/20">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {t("error.dashboardError")}
        </h2>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {error.message || t("error.desc")}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-coral-glow transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t("error.btnRetry")}</span>
          </button>

          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] text-foreground font-semibold text-xs border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center gap-2 transition-all"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span>{t("error.btnHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
