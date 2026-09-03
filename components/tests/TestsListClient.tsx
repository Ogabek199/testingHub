"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  Plus,
  Search,
  FlaskConical,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export const testsData = [
  {
    id: "1",
    name: "API autentifikatsiya testi",
    description: "Token-based auth va JWT tekshiruvi",
    status: "passed",
    category: "API",
    duration: "1.2s",
    lastRun: "14:30",
    passRate: 100,
  },
  {
    id: "2",
    name: "Ma'lumotlar bazasi ulanish",
    description: "PostgreSQL connection pool va query tezligi",
    status: "passed",
    category: "Database",
    duration: "2.8s",
    lastRun: "11:15",
    passRate: 98,
  },
  {
    id: "3",
    name: "Fayl yuklash xizmat",
    description: "S3 bucket upload va download tezligi",
    status: "failed",
    category: "Storage",
    duration: "4.1s",
    lastRun: "09:40",
    passRate: 67,
  },
  {
    id: "4",
    name: "Email xabarnomalar",
    description: "SMTP server va template render",
    status: "pending",
    category: "Notification",
    duration: "—",
    lastRun: "Hozir",
    passRate: 89,
  },
  {
    id: "5",
    name: "To'lov tizimi integratsiya",
    description: "Payme va Click API test suite",
    status: "passed",
    category: "Payment",
    duration: "3.5s",
    lastRun: "Kecha",
    passRate: 95,
  },
  {
    id: "6",
    name: "Cache invalidation",
    description: "Redis cache va TTL tekshiruvi",
    status: "failed",
    category: "Performance",
    duration: "0.9s",
    lastRun: "Kecha",
    passRate: 45,
  },
];

export function TestsListClient() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<"all" | "passed" | "failed" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = testsData.filter((test) => {
    const matchesStatus = activeFilter === "all" || test.status === activeFilter;
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "passed":
        return t("tests.tabPassed");
      case "failed":
        return t("tests.tabFailed");
      case "pending":
        return t("tests.tabPending");
      default:
        return status;
    }
  };

  return (
    <div className="container-max section-padding py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {t("tests.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredTests.length} {t("tests.found")}
          </p>
        </div>
        <button
          aria-label={t("tests.btnNew")}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-coral-glow flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{t("tests.btnNew")}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative flex items-center">
          <Search className="h-4 w-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("tests.searchPlaceholder")}
            aria-label={t("tests.searchPlaceholder")}
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="ios-segmented mb-6">
        {[
          { id: "all", label: t("tests.tabAll") },
          { id: "passed", label: t("tests.tabPassed") },
          { id: "failed", label: t("tests.tabFailed") },
          { id: "pending", label: t("tests.tabPending") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`ios-segmented-btn ${
              activeFilter === tab.id
                ? "ios-segmented-btn-active"
                : "ios-segmented-btn-inactive"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test cards */}
      <div className="grid gap-3">
        {filteredTests.map((test) => {
          const isPassed = test.status === "passed";
          const isFailed = test.status === "failed";

          return (
            <Link key={test.id} href={`/tests/${test.id}`} className="block">
              <div className="ios-card p-5 hover:border-primary/40 transition-all flex items-start gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-sm">
                        {test.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {test.description}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        isPassed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : isFailed
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {getStatusLabel(test.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-muted-foreground uppercase">
                      {test.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {test.duration}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {test.lastRun}
                    </span>
                    <span className="ml-auto text-xs font-bold text-foreground">
                      {test.passRate}% {t("tests.passRateLabel")}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors mt-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
