"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Check, ArrowRight, ShieldCheck, Clock, Layers } from "lucide-react";

export function ServicesComparison() {
  const { t } = useTranslation();

  const features = [
    "services.feature1",
    "services.feature2",
    "services.feature3",
    "services.feature4",
    "services.feature5",
    "services.feature6",
    "services.feature7",
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-cream-100/60 dark:bg-[#0B0B0E] border-t border-black/[0.04] dark:border-white/[0.04]">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-foreground mb-4">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>{t("services.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("services.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Model A: One-time */}
          <div className="ios-card p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                {t("services.tagOneTime")}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("services.modelA")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {t("services.modelADesc")}
              </p>

              <div className="my-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-muted-foreground block">{t("services.startingFrom")}</span>
                <span className="text-3xl font-black text-foreground mt-0.5 block">
                  {t("services.oneTimePrice")}
                </span>
                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {t("services.timelineOneTime")}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-muted-foreground mb-8">
                {features.slice(0, 5).map((fKey, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{t(fKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/#calculator"
              className="w-full py-3 px-4 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.12] text-foreground font-semibold text-xs text-center border border-black/[0.06] dark:border-white/[0.08] transition-colors block"
            >
              {t("services.btnSelect")}
            </Link>
          </div>

          {/* Model B: Retainer (Popular) */}
          <div className="ios-card p-6 md:p-8 border-primary/40 ring-2 ring-primary/30 relative flex flex-col justify-between shadow-coral-glow">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              {t("services.recommended")}
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                {t("services.tagMonthly")}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("services.modelB")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {t("services.modelBDesc")}
              </p>

              <div className="my-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-muted-foreground block">{t("services.subscriptionPrice")}</span>
                <span className="text-3xl font-black text-primary mt-0.5 block">
                  {t("services.monthlyPrice")}
                </span>
                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {t("services.continuousGuarantee")}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-foreground/90 font-medium mb-8">
                {features.map((fKey, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{t(fKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/#calculator"
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs text-center shadow-coral-glow transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t("services.btnConsult")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
