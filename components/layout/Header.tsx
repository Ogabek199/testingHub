"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, Language } from "@/lib/i18n";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize dark mode from html class or localstorage
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
      try {
        localStorage.setItem("testinghub_theme", "light");
      } catch { }
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      try {
        localStorage.setItem("testinghub_theme", "dark");
      } catch { }
    }
  };

  const navLinks = [
    { label: t("nav.bugCost"), href: "/#bug-cost" },
    { label: t("nav.calculator"), href: "/#calculator" },
    { label: t("nav.qaInfo"), href: "/#qa-info" },
    { label: t("nav.services"), href: "/#services" },
    { label: t("nav.cases"), href: "/#cases" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full ios-glass border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="container-max section-padding">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group shrink-0 transition-opacity hover:opacity-90">
            <Logo height={34} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 xl:px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Controls: CTA, Lang, Theme */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* CTA Button */}
            <Link
              href="/#calculator"
              className="px-3.5 xl:px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-sm shadow-primary/30 transition-all whitespace-nowrap shrink-0"
            >
              {t("hero.ctaConsult")}
            </Link>

            {/* Segmented 3-Language Switcher (UZ | RU | EN) */}
            <div className="ios-segmented shrink-0">
              {(["uz", "ru", "en"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`ios-segmented-btn uppercase cursor-pointer ${language === lang
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
              className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.05] flex items-center justify-center text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.1] transition-all shrink-0 cursor-pointer"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Actions: Free Consultation button + Hamburger toggle */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Free Consultation button (In front of hamburger menu, NOT inside) */}
            <Link
              href="/#calculator"
              className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-sm shadow-primary/30 transition-all whitespace-nowrap flex items-center gap-1 active:scale-95 shrink-0"
            >
              <span>{t("hero.ctaConsult")}</span>
            </Link>

            {/* Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className="p-1.5 sm:p-2 rounded-lg text-foreground border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.05] hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3 animate-fade-in">
            {/* Nav links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]" />

            {/* Language & Theme Controls Row inside Hamburger Menu */}
            <div className="px-3 pt-1 flex items-center justify-between gap-3 flex-wrap">
              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {language === "uz" ? "Til:" : language === "ru" ? "Язык:" : "Lang:"}
                </span>
                <div className="ios-segmented">
                  {(["uz", "ru", "en"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase cursor-pointer transition-all ${
                        language === lang
                          ? "bg-white dark:bg-[#252e50] text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark / Light Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {language === "uz" ? "Mavzu:" : language === "ru" ? "Тема:" : "Theme:"}
                </span>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="h-8 w-8 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.05] flex items-center justify-center text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.1] transition-all cursor-pointer"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
