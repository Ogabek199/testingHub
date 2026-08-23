"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { ArrowLeft, Play, RefreshCw, CheckCircle2, XCircle, Clock, Copy, Check } from "lucide-react";
import Link from "next/link";

const testRuns = [
  { id: 1, status: "passed", duration: "1.2s", date: "2026-08-23 14:30", by: "Ali V." },
  { id: 2, status: "failed", duration: "1.8s", date: "2026-08-23 11:15", by: "Auto" },
  { id: 3, status: "passed", duration: "1.1s", date: "2026-08-22 16:45", by: "Bekzod T." },
  { id: 4, status: "passed", duration: "0.9s", date: "2026-08-22 09:20", by: "Auto" },
];

export function TestDetailClient({ id }: { id: string }) {
  const { t } = useTranslation();
  const { success: toastSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  const testCode = `describe('API Auth Tests', () => {
  it('should login with valid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'secret123'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: 'wrongpass'
      })
    });
    
    expect(response.status).toBe(401);
  });
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    toastSuccess(t("toasts.codeCopiedDesc"), t("toasts.codeCopiedTitle"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container-max section-padding py-10">
      {/* Back */}
      <Link
        href="/tests"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>{t("tests.backToTests")}</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              API autentifikatsiya testi
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {t("tests.tabPassed")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Test ID: <span className="font-mono text-foreground font-semibold">test_{id}</span>
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => toastSuccess(t("toasts.testRerunDesc"), t("toasts.testRerunTitle"))}
            className="px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-foreground font-semibold text-xs border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t("tests.btnRerun")}</span>
          </button>
          <button
            onClick={() => toastSuccess(t("toasts.testRunDesc"), t("toasts.testRunTitle"))}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-coral-glow flex items-center gap-1.5 transition-all"
          >
            <Play className="h-3.5 w-3.5" />
            <span>{t("tests.btnRun")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code */}
          <div className="ios-card overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">{t("tests.codeTitle")}</h3>
              <button
                onClick={copyCode}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Copy code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <pre className="px-6 py-4 font-mono text-xs text-foreground/90 bg-black/[0.02] dark:bg-white/[0.02] overflow-x-auto leading-relaxed">
              <code>{testCode}</code>
            </pre>
          </div>

          {/* Run history */}
          <div className="ios-card p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">{t("tests.historyTitle")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t("tests.historySubtitle")}</p>
            </div>
            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
              {testRuns.map((run) => (
                <div key={run.id} className="flex items-center gap-4 py-3.5">
                  {run.status === "passed" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">
                      {run.date}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {run.by} {t("tests.byUser")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {run.duration}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        run.status === "passed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {run.status === "passed" ? t("tests.tabPassed") : t("tests.tabFailed")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="ios-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">{t("tests.infoTitle")}</h3>
            <dl className="space-y-3 text-xs">
              {[
                { label: t("tests.catLabel"), value: "API" },
                { label: t("tests.lastRunLabel"), value: "14:30, 2026-08-23" },
                { label: t("tests.avgDurationLabel"), value: "1.25s" },
                { label: t("tests.passRateMetricLabel"), value: "92%" },
                { label: t("tests.createdLabel"), value: "2026-07-01" },
                { label: t("tests.authorLabel"), value: "Ali Valiyev" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1 border-b border-black/[0.03] dark:border-white/[0.03] last:border-none">
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="font-semibold text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="ios-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-3">{t("tests.tagsTitle")}</h3>
            <div className="flex flex-wrap gap-2">
              {["auth", "api", "jwt", "security", "login"].map((tag) => (
                <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-muted-foreground border border-black/[0.04] dark:border-white/[0.04]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
