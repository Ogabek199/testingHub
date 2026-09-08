"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import {
  CONTACT_PHONE,
  CONTACT_TELEGRAM,
  CONTACT_LINKEDIN,
  CONTACT_INSTAGRAM,
} from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-cream-100/40 dark:bg-[#11162a] py-12 transition-colors">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-black/[0.06] dark:border-white/[0.06]">
          {/* Logo & Tagline */}
          <div className="space-y-3">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Logo height={32} />
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t("footer.standardsNote")}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              {t("footer.servicesTitle")}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#bug-cost" className="hover:text-primary transition-colors">
                  {t("nav.bugCost")}
                </Link>
              </li>
              <li>
                <Link href="/#calculator" className="hover:text-primary transition-colors">
                  {t("nav.calculator")}
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/#cases" className="hover:text-primary transition-colors">
                  {t("nav.cases")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Aloqa / Contacts */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              {t("footer.contactsTitle")}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.phone")}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.telegram")}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.instagram")}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.linkedin")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              {t("footer.legalTitle")}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors font-medium text-foreground">
                  {t("footer.privacyLink")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} TestingHub. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>{t("footer.madeFor")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
