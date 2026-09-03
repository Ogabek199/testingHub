"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from "lucide-react";

export function PrivacyPolicyClient() {
  const { t } = useTranslation();

  return (
    <div className="py-12 md:py-20 bg-background">
      <div className="container-max section-padding max-w-4xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t("nav.home")}</span>
        </Link>

        {/* Header Card */}
        <div className="ios-card p-8 md:p-12 mb-8 bg-gradient-to-b from-white to-cream-100/50 dark:from-[#18181C] dark:to-[#121215]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span>{t("privacy.badge")}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {t("privacy.title")}
          </h1>

          <p className="text-xs text-muted-foreground mt-3 font-mono">
            {t("privacy.lastUpdated")}
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-6">
          <div className="ios-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              {t("privacy.sec1Title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.sec1Text")}
            </p>
          </div>

          <div className="ios-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5 mb-3">
              <Lock className="h-5 w-5 text-primary" />
              {t("privacy.sec2Title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.sec2Text")}
            </p>
          </div>

          <div className="ios-card p-6 md:p-8 bg-coral-50/50 dark:bg-coral-950/20 border-coral-200/60 dark:border-coral-800/40">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5 mb-3">
              <ShieldCheck className="h-5 w-5 text-coral-500" />
              {t("privacy.sec3Title")}
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              {t("privacy.sec3Text")}
            </p>
          </div>

          <div className="ios-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5 mb-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {t("privacy.sec4Title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.sec4Text")}
            </p>
          </div>

          <div className="ios-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5 mb-3">
              <Lock className="h-5 w-5 text-primary" />
              {t("privacy.sec5Title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.sec5Text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
