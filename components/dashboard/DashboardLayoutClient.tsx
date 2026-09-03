"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTranslation, Language } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { 
  LogOut, 
  Home,
  AlertCircle,
  Sun,
  Moon
} from "lucide-react";
import { LogoIcon } from "@/components/ui/Logo";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { info: toastInfo } = useToast();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
      try {
        localStorage.setItem("testinghub_theme", "light");
      } catch {}
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      try {
        localStorage.setItem("testinghub_theme", "dark");
      } catch {}
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard&reason=auth_required");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-muted-foreground">{t("auth.securityChecking")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="ios-card max-w-md w-full p-8 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">{t("auth.unauthorizedTitle")}</h2>
          <p className="text-xs text-muted-foreground mb-6">
            {t("auth.unauthorizedDesc")}
          </p>
          <Link
            href="/login?redirect=/dashboard&reason=auth_required"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-coral-glow inline-block"
          >
            {t("auth.btnGoLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100/40 dark:bg-[#11162a] flex flex-col">
      {/* Single Clean Top Dashboard Nav Bar */}
      <header className="sticky top-0 z-40 w-full ios-glass border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="container-max section-padding">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
                <LogoIcon size={28} />
                <span className="text-base font-bold text-foreground tracking-tight">
                  Testing<span className="text-primary">Hub</span>
                  <span className="ml-1.5 text-[11px] font-semibold text-muted-foreground">Dashboard</span>
                </span>
              </Link>
              <span className="hidden md:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {t("dashboard.securedEnvironment")}
              </span>
            </div>

            {/* Controls, Lang, Theme, User Profile */}
            <div className="flex items-center gap-2.5">
              {/* Back to site */}
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("dashboard.backToSite")}</span>
              </Link>

              {/* Segmented Lang Switcher */}
              <div className="ios-segmented">
                {(["uz", "ru", "en"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`ios-segmented-btn uppercase ${
                      language === lang
                        ? "ios-segmented-btn-active"
                        : "ios-segmented-btn-inactive"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.05] flex items-center justify-center text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.1] transition-all"
              >
                {isDark ? (
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>

              {/* User badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-black/[0.08] dark:border-white/[0.08]">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-foreground block leading-none truncate max-w-[140px]">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none truncate max-w-[140px] block mt-0.5">
                    {user?.company || "QA Lead"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    toastInfo(t("toasts.logoutDesc"), t("toasts.logoutTitle"));
                    logout();
                  }}
                  title="Chiqish"
                  aria-label="Chiqish"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container-max section-padding py-8">
        {children}
      </main>
    </div>
  );
}
