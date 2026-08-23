"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";
import { 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Plus, 
  FileText, 
  DollarSign, 
  ShieldAlert, 
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface TestRun {
  id: string;
  project: string;
  type: string;
  status: "passed" | "failed" | "running";
  passRate: number;
  duration: string;
  date: string;
}

interface QuoteLead {
  id: string;
  date: string;
  name: string;
  phone: string;
  services: string;
  price: string;
  status: string;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { success: toastSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "tests" | "bugs" | "quotes">("overview");
  const [quotes, setQuotes] = useState<QuoteLead[]>([]);

  const [testRuns, setTestRuns] = useState<TestRun[]>([
    {
      id: "TR-902",
      project: "Fintech Payment API Suite",
      type: "Automation & Security",
      status: "passed",
      passRate: 100,
      duration: "1.4s",
      date: "Bugun, 14:20",
    },
    {
      id: "TR-901",
      project: "E-Commerce Mobile App (iOS)",
      type: "Functional & UI/UX",
      status: "failed",
      passRate: 84,
      duration: "4.8s",
      date: "Bugun, 11:45",
    },
    {
      id: "TR-900",
      project: "B2B CRM User Roles & Permissions",
      type: "Security & CRUD",
      status: "passed",
      passRate: 98,
      duration: "2.1s",
      date: "Kecha, 18:30",
    },
    {
      id: "TR-899",
      project: "Telegram Delivery Bot Flow",
      type: "Integration & Webhook",
      status: "passed",
      passRate: 100,
      duration: "0.8s",
      date: "Kecha, 15:10",
    },
  ]);

  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem("testinghub_quotes");
      if (savedQuotes) {
        setQuotes(JSON.parse(savedQuotes));
      } else {
        // Mock default leads
        setQuotes([
          {
            id: "QA-849201",
            date: "2026-08-23",
            name: "Sardor Rahimov",
            phone: "+998 90 987 65 43",
            services: "Website, Mobile App",
            price: "12 500 000 – 16 000 000 UZS",
            status: "pending",
          },
          {
            id: "QA-849188",
            date: "2026-08-22",
            name: "Malika Karimova",
            phone: "+998 93 555 11 22",
            services: "CRM Testing",
            price: "6 000 000 – 8 500 000 UZS",
            status: "audit_done",
          },
        ]);
      }
    } catch {}
  }, []);

  const triggerNewTest = () => {
    const testId = "TR-" + Math.floor(903 + Math.random() * 50);
    const newRun: TestRun = {
      id: testId,
      project: "Real-time Smoke & Regression Suite",
      type: "Automated API & UI",
      status: "passed",
      passRate: 100,
      duration: "1.1s",
      date: "Hozir",
    };
    setTestRuns([newRun, ...testRuns]);
    toastSuccess(`${t("toasts.newTestStarted")} (${testId})`, t("toasts.newTestTitle"));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="ios-card p-6 md:p-8 bg-gradient-to-r from-primary/[0.08] via-amber-500/[0.04] to-transparent border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider mb-2">
            {t("dashboard.welcomeBadge")}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("dashboard.greeting")}, {user?.name || "Foydalanuvchi"}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <button
          onClick={triggerNewTest}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-coral-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
        >
          <Play className="h-4 w-4" />
          <span>{t("dashboard.btnNewTest")}</span>
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ios-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{t("dashboard.activeAudits")}</span>
            <FlaskConical className="h-4 w-4 text-primary" />
          </div>
          <span className="text-2xl font-black text-foreground">{t("dashboard.stat1Value")}</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            {t("dashboard.stat1Sub")}
          </span>
        </div>

        <div className="ios-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{t("dashboard.foundBugs")}</span>
            <ShieldAlert className="h-4 w-4 text-coral-500" />
          </div>
          <span className="text-2xl font-black text-coral-600 dark:text-coral-400">{t("dashboard.stat2Value")}</span>
          <span className="text-[11px] text-muted-foreground block mt-1">
            {t("dashboard.stat2Sub")}
          </span>
        </div>

        <div className="ios-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{t("dashboard.passRate")}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-foreground">96.8%</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            {t("dashboard.stat3Sub")}
          </span>
        </div>

        <div className="ios-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{t("dashboard.savedMoney")}</span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-foreground">$18,400+</span>
          <span className="text-[11px] text-muted-foreground block mt-1">
            {t("dashboard.stat4Sub")}
          </span>
        </div>
      </div>


      {/* Tabs Switcher */}
      <div className="ios-segmented">
        {[
          { id: "overview", labelKey: "dashboard.tabOverview" },
          { id: "tests", labelKey: "dashboard.tabTestRuns" },
          { id: "quotes", labelKey: "dashboard.tabQuotes" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`ios-segmented-btn ${
              activeTab === tab.id
                ? "ios-segmented-btn-active"
                : "ios-segmented-btn-inactive"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      {activeTab === "quotes" ? (
        /* Quotes / Leads from Calculator */
        <div className="ios-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {t("dashboard.quotesTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("dashboard.quotesDesc")}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {quotes.length} {t("dashboard.quotesCount")}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-muted-foreground border-b border-black/[0.06] dark:border-white/[0.06] uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">{t("dashboard.thLeadId")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.thClient")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.thServices")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.thPrice")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.thDate")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.thStatus")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-mono font-bold text-primary">{q.id}</td>
                    <td className="py-3.5">
                      <span className="font-bold text-foreground block">{q.name}</span>
                      <span className="text-muted-foreground">{q.phone}</span>
                    </td>
                    <td className="py-3.5 font-medium text-foreground">{q.services}</td>
                    <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{q.price}</td>
                    <td className="py-3.5 text-muted-foreground">{q.date}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {t("dashboard.statusReviewing")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Test Runs & Overview */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Test Runs */}
          <div className="lg:col-span-8 ios-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">
                {t("dashboard.recentTests")}
              </h3>
              <span className="text-xs font-semibold text-muted-foreground">
                {t("dashboard.liveResults")}
              </span>
            </div>

            <div className="space-y-3">
              {testRuns.map((run) => (
                <div
                  key={run.id}
                  className="p-4 rounded-2xl bg-black/[0.01] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        run.status === "passed"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {run.status === "passed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {run.project}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {run.type} &bull; <span className="font-mono">{run.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <span className="text-xs font-bold text-foreground block">
                        {run.passRate}% {t("dashboard.passRateSuffix")}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {run.duration}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        run.status === "passed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {run.status === "passed" ? t("dashboard.statusPassed") : t("dashboard.statusFailed")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Bug Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="ios-card p-6">
              <h3 className="text-base font-bold text-foreground mb-4">
                {t("dashboard.bugRegistryTitle")}
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex justify-between font-bold text-red-600 dark:text-red-400">
                    <span>#BUG-401 (Auth token expire)</span>
                    <span className="uppercase text-[10px]">Critical</span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Payment gateway webhook retry timeout in transaction settlement.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                    <span>#BUG-398 (Cart recalculation)</span>
                    <span className="uppercase text-[10px]">High</span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Coupon application formula rounding precision issue on bulk checkout.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex justify-between font-bold text-blue-600 dark:text-blue-400">
                    <span>#BUG-394 (Safari UI overflow)</span>
                    <span className="uppercase text-[10px]">Medium</span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    iOS Safari bottom viewport safe-area padding overlap on active sheets.
                  </p>
                </div>
              </div>
            </div>

            {/* Support info */}
            <div className="ios-card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                {t("dashboard.helpTitle")}
              </span>
              <h4 className="text-sm font-bold text-foreground">
                {t("dashboard.helpHeading")}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                {t("dashboard.helpDesc")}
              </p>
              <a
                href="https://t.me/Javohiir"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold text-center block shadow-coral-glow hover:bg-primary/90 transition-colors"
              >
                {t("dashboard.helpBtn")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

