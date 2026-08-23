"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { ArrowRight, Send, Sparkles } from "lucide-react";

export function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-max section-padding">
        <div className="ios-card p-8 md:p-14 bg-gradient-to-br from-primary via-coral-600 to-coral-700 text-white shadow-coral-lg text-center relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sifat va Ishonch</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {t("cta.title")}
            </h2>

            <p className="mt-4 text-white/85 text-sm sm:text-base md:text-lg leading-relaxed">
              {t("cta.subtitle")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/#calculator"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-white/95 text-coral-600 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>{t("cta.btnCalc")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://t.me/Javohiir"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{t("cta.btnTelegram")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
