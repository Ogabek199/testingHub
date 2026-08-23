"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="container-max section-padding text-center">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-foreground mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{t("hero.badge")}</span>
        </div>

        {/* Main Headline with serif italic styling matching screenshot */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
          {t("hero.titlePrefix")}{" "}
          <span className="serif-italic-accent text-primary tracking-normal font-serif">
            {t("hero.titleItalic")}
          </span>{" "}
          {t("hero.titleSuffix")}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("hero.description")}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/#calculator"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-coral-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>{t("hero.ctaConsult")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#bug-cost"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-foreground font-semibold text-sm border border-black/[0.06] dark:border-white/[0.08] transition-all"
          >
            <span>{t("hero.ctaCalc")}</span>
          </Link>
        </div>

        {/* 4 Stats Cards matching screenshot row */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                {t("hero.stat1Num")}
              </span>
              <span className="text-[11px] md:text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">
                {t("hero.stat1Label")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                {t("hero.stat2Num")}
              </span>
              <span className="text-[11px] md:text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">
                {t("hero.stat2Label")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                {t("hero.stat3Num")}
              </span>
              <span className="text-[11px] md:text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">
                {t("hero.stat3Label")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                {t("hero.stat4Num")}
              </span>
              <span className="text-[11px] md:text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">
                {t("hero.stat4Label")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
