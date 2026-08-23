"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Search, FileText, Play, Bug, CheckCheck } from "lucide-react";

export function ProcessTimeline() {
  const { t } = useTranslation();

  const steps = [
    {
      numKey: "process.step1Num",
      titleKey: "process.step1Title",
      descKey: "process.step1Desc",
      icon: Search,
    },
    {
      numKey: "process.step2Num",
      titleKey: "process.step2Title",
      descKey: "process.step2Desc",
      icon: FileText,
    },
    {
      numKey: "process.step3Num",
      titleKey: "process.step3Title",
      descKey: "process.step3Desc",
      icon: Play,
    },
    {
      numKey: "process.step4Num",
      titleKey: "process.step4Title",
      descKey: "process.step4Desc",
      icon: Bug,
    },
    {
      numKey: "process.step5Num",
      titleKey: "process.step5Title",
      descKey: "process.step5Desc",
      icon: CheckCheck,
    },
  ];

  return (
    <section id="process" className="py-16 md:py-24 bg-background">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-foreground mb-4">
            <CheckCheck className="h-3.5 w-3.5 text-primary" />
            <span>{t("process.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t("process.subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="ios-card p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-primary/40 font-mono">
                      {t(step.numKey)}
                    </span>
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
