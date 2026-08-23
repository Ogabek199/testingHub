"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { SeoHead } from "@/components/seo/SeoHead";
import { ArrowLeft, Home, FlaskConical, AlertCircle } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <SeoHead
        title="404 — Sahifa topilmadi"
        description="Kechirasiz, siz qidirayotgan sahifa topilmadi."
        noindex={true}
      />
      <div className="ios-card max-w-md w-full p-8 md:p-10 text-center shadow-ios-lg">
        {/* Animated Badge */}
        <div className="h-16 w-16 rounded-3xl bg-coral-50 dark:bg-coral-950/60 text-primary flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>

        <span className="text-5xl md:text-6xl font-black text-primary tracking-tight font-mono">
          404
        </span>

        <h1 className="text-2xl font-bold text-foreground mt-4">
          {t("notFound.title")}
        </h1>

        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {t("notFound.desc")}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-coral-glow transition-all"
          >
            <Home className="h-4 w-4" />
            <span>{t("notFound.btnHome")}</span>
          </Link>

          <Link
            href="/#calculator"
            className="px-5 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-foreground font-semibold text-xs border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center gap-2 transition-all"
          >
            <FlaskConical className="h-4 w-4 text-primary" />
            <span>{t("nav.calculator")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
