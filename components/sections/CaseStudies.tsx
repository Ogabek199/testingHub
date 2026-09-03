"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Award, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export function CaseStudies() {
  const { t } = useTranslation();

  const cases = [
    {
      titleKey: "cases.case1Name",
      problemKey: "cases.case1Problem",
      solutionKey: "cases.case1Solution",
      resultKey: "cases.case1Result",
      tagKey: "cases.tagFintech",
      impactKey: "cases.case1Impact",
    },
    {
      titleKey: "cases.case2Name",
      problemKey: "cases.case2Problem",
      solutionKey: "cases.case2Solution",
      resultKey: "cases.case2Result",
      tagKey: "cases.tagEcommerce",
      impactKey: "cases.case2Impact",
    },
    {
      titleKey: "cases.case3Name",
      problemKey: "cases.case3Problem",
      solutionKey: "cases.case3Solution",
      resultKey: "cases.case3Result",
      tagKey: "cases.tagB2b",
      impactKey: "cases.case3Impact",
    },
  ];

  return (
    <section id="cases" className="py-16 md:py-24 bg-cream-100/60 dark:bg-[#11162a] border-t border-black/[0.04] dark:border-white/[0.04]">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-foreground mb-4">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span>{t("cases.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("cases.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t("cases.subtitle")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div
              key={i}
              className="ios-card p-6 md:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/10 text-muted-foreground uppercase">
                    {t(c.tagKey)}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {t(c.impactKey)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-4">
                  {t(c.titleKey)}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-500/[0.05] border border-red-500/15">
                    <span className="font-bold text-red-600 dark:text-red-400 block mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {t("cases.problemLabel")}
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(c.problemKey)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
                    <span className="font-bold text-foreground block mb-0.5 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      {t("cases.solutionLabel")}
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(c.solutionKey)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block mb-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t("cases.resultLabel")}
                </span>
                <p className="text-xs text-foreground/90 font-medium">
                  {t(c.resultKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
