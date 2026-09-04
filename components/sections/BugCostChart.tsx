"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";
import { 
  Code2, 
  FlaskConical, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  Flame,
  Info
} from "lucide-react";

export function BugCostChart() {
  const { t } = useTranslation();
  const [selectedStage, setSelectedStage] = useState<number>(3); // Default production
  const [bugCount, setBugCount] = useState<number>(15);

  const stages = [
    {
      id: 0,
      cost: "$1",
      costNum: 1,
      multiplier: "1x",
      titleKey: "bugCost.devStage",
      descKey: "bugCost.devDesc",
      icon: Code2,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
      height: "h-20 sm:h-28 md:h-32",
      riskKey: "bugCost.riskVeryLow",
      timeKey: "bugCost.timeDev",
      badgeVariant: "success"
    },
    {
      id: 1,
      cost: "$10",
      costNum: 10,
      multiplier: "10x",
      titleKey: "bugCost.testStage",
      descKey: "bugCost.testDesc",
      icon: FlaskConical,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40",
      height: "h-28 sm:h-36 md:h-48",
      riskKey: "bugCost.riskMedium",
      timeKey: "bugCost.timeTest",
      badgeVariant: "info"
    },
    {
      id: 2,
      cost: "$100",
      costNum: 100,
      multiplier: "100x",
      titleKey: "bugCost.uatStage",
      descKey: "bugCost.uatDesc",
      icon: UserCheck,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
      height: "h-40 sm:h-48 md:h-64",
      riskKey: "bugCost.riskHigh",
      timeKey: "bugCost.timeUat",
      badgeVariant: "warning"
    },
    {
      id: 3,
      cost: "$1000+",
      costNum: 1000,
      multiplier: "1000x",
      titleKey: "bugCost.prodStage",
      descKey: "bugCost.prodDesc",
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40",
      height: "h-56 sm:h-64 md:h-80",
      riskKey: "bugCost.riskCritical",
      timeKey: "bugCost.timeProd",
      badgeVariant: "danger"
    },
  ];

  // Simulator calculation
  // Assume without QA: 70% caught in Prod ($1000), 30% in UAT ($100)
  // With TestingHub QA: 90% caught in Test ($10), 10% in Dev ($1), 0 in Prod
  const costWithoutQA = Math.round(bugCount * (0.7 * 1000 + 0.3 * 100));
  const costWithQA = Math.round(bugCount * (0.9 * 10 + 0.1 * 1));
  const netSavings = costWithoutQA - costWithQA;

  const currentStage = stages[selectedStage];

  return (
    <section id="bug-cost" className="py-16 md:py-24 bg-cream-100/60 dark:bg-[#11162a] border-y border-black/[0.04] dark:border-white/[0.04]">
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{t("bugCost.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("bugCost.title")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("bugCost.subtitle")}
          </p>
        </div>

        {/* 4-Stage Growing Visual Chart */}
        <div className="ios-card p-3.5 sm:p-6 md:p-8 mb-10">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 items-end pt-4 sm:pt-8 pb-3 sm:pb-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`flex flex-col items-center justify-end cursor-pointer group transition-all duration-200 ${
                    isSelected ? "scale-[1.02]" : "opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Top Price Tag */}
                  <div className="mb-1.5 sm:mb-2 text-center w-full">
                    <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground whitespace-nowrap">
                      {stage.multiplier}
                    </span>
                    <p className={`text-xs sm:text-lg md:text-2xl font-black mt-0.5 sm:mt-1 truncate ${stage.textColor}`}>
                      {stage.cost}
                    </p>
                  </div>

                  {/* Exponential Height Pillar */}
                  <div
                    className={`w-full rounded-xl sm:rounded-2xl p-2 sm:p-3.5 md:p-4 flex flex-col justify-between transition-all duration-300 ${
                      stage.height
                    } ${
                      isSelected
                        ? "bg-gradient-to-t " + stage.color + " text-white shadow-lg ring-2 ring-primary ring-offset-2 dark:ring-offset-darkbg"
                        : "bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-foreground"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <Icon className={`h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0 ${isSelected ? "text-white" : stage.textColor}`} />
                      <span className={`text-[9px] sm:text-[11px] font-bold px-1 sm:px-2 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10"}`}>
                        #{stage.id + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-[10px] sm:text-xs md:text-sm font-bold leading-tight line-clamp-2 ${isSelected ? "text-white" : "text-foreground"}`}>
                        {t(stage.titleKey)}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Stage Explanation Box */}
          <div className={`mt-4 sm:mt-6 p-4 sm:p-5 md:p-6 rounded-2xl border transition-all duration-200 ${currentStage.bgColor}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 sm:p-2.5 rounded-xl bg-white dark:bg-black/30 shadow-sm shrink-0 ${currentStage.textColor}`}>
                  <currentStage.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {t(currentStage.titleKey)}
                    </h3>
                    <span className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-black/30 ${currentStage.textColor}`}>
                      {t("bugCost.estCostLabel")}: {currentStage.cost}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 mt-1 sm:mt-1.5 leading-relaxed">
                    {t(currentStage.descKey)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-black/10 dark:border-white/10">
                <div className="bg-white dark:bg-black/30 p-2.5 rounded-xl">
                  <span className="text-muted-foreground block text-[11px]">{t("bugCost.timeToFixLabel")}</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{t(currentStage.timeKey)}</span>
                </div>
                <div className="bg-white dark:bg-black/30 p-2.5 rounded-xl">
                  <span className="text-muted-foreground block text-[11px]">{t("bugCost.riskLabel")}</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{t(currentStage.riskKey)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive ROI & Savings Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Simulator Box */}
          <div className="lg:col-span-7 ios-card p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-coral-500" />
                  {t("bugCost.simulatorTitle")}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {t("bugCost.realtimeBadge")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {t("bugCost.simulatorSubtitle")}
              </p>

              {/* Slider */}
              <div className="space-y-3 bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>{t("bugCost.bugsCountLabel")}</span>
                  <span className="text-xl font-black text-coral-500">{bugCount} {t("bugCost.bugsUnit")}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  value={bugCount}
                  onChange={(e) => setBugCount(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-black/10 dark:bg-white/15 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>3 ({t("bugCost.sliderSmall")})</span>
                  <span>25 ({t("bugCost.sliderMedium")})</span>
                  <span>60 ({t("bugCost.sliderLarge")})</span>
                </div>
              </div>

              {/* Breakdown comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-red-500/[0.07] border border-red-500/20">
                  <span className="text-xs text-muted-foreground font-medium block">
                    {t("bugCost.withoutQA")}
                  </span>
                  <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 block">
                    ${formatNumber(costWithoutQA)}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    {t("bugCost.withoutQASub")}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20">
                  <span className="text-xs text-muted-foreground font-medium block">
                    {t("bugCost.withQA")}
                  </span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                    ${formatNumber(costWithQA)}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    {t("bugCost.withQASub")}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Savings Card */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-primary/10 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  {t("bugCost.savings")}
                </span>
                <p className="text-2xl sm:text-3xl font-black text-primary mt-0.5">
                  +${formatNumber(netSavings)} USD
                </p>
              </div>

              <Link
                href="/#calculator"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary/30 transition-all text-center shrink-0"
              >
                <span>{t("bugCost.btnCalculate")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Real-world Disasters Sidebar */}
          <div className="lg:col-span-5 ios-card p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-coral-500" />
                <h3 className="text-lg font-bold text-foreground">
                  {t("bugCost.realWorldTitle")}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {t("bugCost.realWorldSub")}
              </p>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">
                      {t("bugCost.case1Title")}
                    </h4>
                    <span className="text-xs font-black text-red-500">-$370,000,000</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t("bugCost.case1Desc")}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">
                      {t("bugCost.case2Title")}
                    </h4>
                    <span className="text-xs font-black text-red-500">-$440,000,000</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t("bugCost.case2Desc")}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">
                      {t("bugCost.case3Title")}
                    </h4>
                    <span className="text-xs font-black text-amber-500">200k+ users</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t("bugCost.case3Desc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t("bugCost.qualityNote")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
