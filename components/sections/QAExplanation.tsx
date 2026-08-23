"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { ShieldCheck, HeartHandshake, Zap, HelpCircle, Check, ArrowRight } from "lucide-react";

export function QAExplanation() {
  const { t } = useTranslation();

  return (
    <section id="qa-info" className="py-16 md:py-24 bg-background">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-foreground mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span>Ta&apos;lim va Tushuncha</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("qaInfo.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t("qaInfo.subtitle")}
          </p>
        </div>

        {/* QA vs Testing Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Testing */}
          <div className="ios-card p-6 md:p-8 bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-muted-foreground uppercase">
                Reaktiv yondashuv
              </span>
              <span className="text-xs text-muted-foreground font-mono">Bajarish bosqichi</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("qaInfo.testingConcept")}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {t("qaInfo.testingDesc")}
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span>Kod yozib bo&apos;lingandan so&apos;ng tekshiriladi</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span>Asosiy maqsad: Xatolarni ro&apos;yxatga olish</span>
              </li>
            </ul>
          </div>

          {/* QA */}
          <div className="ios-card p-6 md:p-8 bg-primary/[0.03] dark:bg-primary/[0.07] border-primary/30 ring-1 ring-primary/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-white uppercase">
                Proaktiv yondashuv
              </span>
              <span className="text-xs text-primary font-mono font-bold">Butun hayotiy sikl</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("qaInfo.qaConcept")}
            </h3>
            <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
              {t("qaInfo.qaDesc")}
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-foreground/90 font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Xatolar paydo bo&apos;lishining oldini oladi</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Arxitektura va biznes mantiqni boshidanoq mustahkamlaydi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Business Benefits */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-bold text-center text-foreground mb-8">
            {t("qaInfo.whyTitle")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ios-card p-6 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-coral-50 dark:bg-coral-950/60 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">
                {t("qaInfo.benefit1Title")}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("qaInfo.benefit1Desc")}
              </p>
            </div>

            <div className="ios-card p-6 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-coral-50 dark:bg-coral-950/60 text-primary flex items-center justify-center mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">
                {t("qaInfo.benefit2Title")}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("qaInfo.benefit2Desc")}
              </p>
            </div>

            <div className="ios-card p-6 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-coral-50 dark:bg-coral-950/60 text-primary flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">
                {t("qaInfo.benefit3Title")}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("qaInfo.benefit3Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
