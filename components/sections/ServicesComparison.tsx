"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency";
import { useToast } from "@/lib/toast";
import { formatUzbekPhone } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  X,
  Send,
  FileCheck,
  Sparkles,
} from "lucide-react";

export function ServicesComparison() {
  const { t } = useTranslation();
  const { format: formatCurrency } = useCurrency();
  const { success: toastSuccess, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"modelA" | "modelB">("modelB");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "+998 ",
    email: "",
    company: "",
    telegram: "",
    comment: "",
    honeypot: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleOpenModal = (plan: "modelA" | "modelB") => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    const nameTrim = formData.name.trim();
    if (!nameTrim || nameTrim.length < 3) {
      toastError(t("toasts.valNameMin"), t("toasts.validationErrorTitle"));
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 12) {
      toastError(t("toasts.valPhoneInvalid"), t("toasts.validationErrorTitle"));
      return;
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toastError(t("toasts.valEmailInvalid"), t("toasts.validationErrorTitle"));
        return;
      }
    }

    setIsSubmitting(true);

    const leadId = "QA-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedLeadId(leadId);

    const formattedTelegram = formData.telegram.trim()
      ? formData.telegram.trim().startsWith("@")
        ? formData.telegram.trim()
        : "@" + formData.telegram.trim()
      : "";

    const planTitle = selectedPlan === "modelB" ? t("services.modelB") : t("services.modelA");
    const planPrice =
      selectedPlan === "modelB"
        ? `${formatCurrency(2_000_000)} / ${t("services.monthlyUnit", "oy")}`
        : `${formatCurrency(1_200_000)}`;

    const payload = JSON.stringify({
      leadId,
      name: nameTrim,
      phone: formData.phone,
      email: formData.email.trim(),
      company: formData.company.trim(),
      telegram: formattedTelegram,
      comment: formData.comment.trim(),
      services: `Konsultatsiya: ${planTitle}`,
      price: planPrice,
      duration: selectedPlan === "modelB" ? "Doimiy / Oylik" : "3 – 7 ish kuni",
      honeypot: formData.honeypot,
    });

    try {
      let res: Response | null = null;
      try {
        res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
      } catch (firstErr) {
        res = await fetch(`${SITE_URL}/api/lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
      }

      if (!res) throw new Error("No response received");

      const resData = await res.json().catch(() => null);
      if (!res.ok || resData?.success === false) {
        setIsSubmitting(false);
        const errMsg =
          res.status === 429
            ? t("toasts.leadRateLimitDesc")
            : t("toasts.leadErrorDesc");
        toastError(errMsg, t("toasts.leadErrorTitle"));
        return;
      }
    } catch (err) {
      console.error("API Lead error:", err);
      setIsSubmitting(false);
      toastError(t("toasts.leadNetworkErrorDesc"), t("toasts.leadErrorTitle"));
      return;
    }

    try {
      const existingQuotes = JSON.parse(localStorage.getItem("testinghub_quotes") || "[]");
      existingQuotes.unshift({
        id: leadId,
        date: new Date().toISOString().split("T")[0],
        name: nameTrim,
        phone: formData.phone,
        services: planTitle,
        price: planPrice,
        status: "pending",
      });
      localStorage.setItem("testinghub_quotes", JSON.stringify(existingQuotes));
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    toastSuccess(`${t("toasts.leadSuccessDesc")} ID: ${leadId}`, t("toasts.leadSuccessTitle"));
  };

  const features = [
    "services.feature1",
    "services.feature2",
    "services.feature3",
    "services.feature4",
    "services.feature5",
    "services.feature6",
    "services.feature7",
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-cream-100/60 dark:bg-[#11162a] border-t border-black/[0.04] dark:border-white/[0.04]">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-foreground mb-4">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>{t("services.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("services.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Model A: One-time */}
          <div className="ios-card p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                {t("services.tagOneTime")}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("services.modelA")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {t("services.modelADesc")}
              </p>

              <div className="my-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-muted-foreground block">{t("services.startingFrom")}</span>
                <span className="text-3xl font-black text-foreground mt-0.5 block">
                  {formatCurrency(1_200_000)}
                </span>
                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {t("services.timelineOneTime")}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-muted-foreground mb-8">
                {features.slice(0, 5).map((fKey, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{t(fKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal("modelA")}
              className="w-full py-3 px-4 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.12] text-foreground font-semibold text-xs text-center border border-black/[0.06] dark:border-white/[0.08] transition-colors block cursor-pointer"
            >
              {t("services.btnSelect")}
            </button>
          </div>

          {/* Model B: Retainer (Popular) */}
          <div className="ios-card p-6 md:p-8 border-primary/40 ring-2 ring-primary/30 relative flex flex-col justify-between shadow-coral-glow">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              {t("services.recommended")}
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                {t("services.tagMonthly")}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("services.modelB")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {t("services.modelBDesc")}
              </p>

              <div className="my-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-muted-foreground block">{t("services.subscriptionPrice")}</span>
                <span className="text-3xl font-black text-primary mt-0.5 block">
                  {formatCurrency(2_000_000)} / {t("services.monthlyUnit", "oy")}
                </span>
                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {t("services.continuousGuarantee")}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-foreground/90 font-medium mb-8">
                {features.map((fKey, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{t(fKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal("modelB")}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs text-center shadow-coral-glow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>{t("services.btnConsult")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Consultation Form Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="ios-card w-full max-w-lg p-6 md:p-8 bg-background border border-black/10 dark:border-white/10 shadow-2xl relative animate-scale-in max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("services.btnConsult")}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("calculator.modalTitle")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  {t("calculator.modalSubtitle")}
                </p>

                {/* Selected Package Banner */}
                <div className="p-3 mb-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold block">
                      {t("services.badge")}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {selectedPlan === "modelB" ? t("services.modelB") : t("services.modelA")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-primary block">
                      {selectedPlan === "modelB"
                        ? `${formatCurrency(2_000_000)} / ${t("services.monthlyUnit", "oy")}`
                        : `${formatCurrency(1_200_000)}`}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {selectedPlan === "modelB"
                        ? t("services.continuousGuarantee")
                        : t("services.timelineOneTime")}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmitLead} className="space-y-3.5">
                  {/* Honeypot for spam bots */}
                  <input
                    type="text"
                    name="website_url_hp"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        {t("calculator.fieldName")} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("calculator.fieldNamePlaceholder")}
                        className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        {t("calculator.fieldPhone")} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: formatUzbekPhone(e.target.value) })
                        }
                        placeholder="+998 90 123 45 67"
                        maxLength={17}
                        className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        {t("calculator.fieldEmail")}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t("calculator.fieldEmailPlaceholder")}
                        className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        {t("calculator.fieldTelegram")}
                      </label>
                      <input
                        type="text"
                        value={formData.telegram}
                        onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val && !val.startsWith("@")) {
                            setFormData({ ...formData, telegram: "@" + val });
                          }
                        }}
                        placeholder={t("calculator.fieldTelegramPlaceholder")}
                        className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      {t("calculator.fieldCompany")}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t("calculator.fieldCompanyPlaceholder")}
                      className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      {t("calculator.fieldComment")}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder={t("calculator.fieldCommentPlaceholder")}
                      className="w-full p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-coral-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span>{t("calculator.sending")}</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{t("calculator.btnSend")}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <FileCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("calculator.successTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {t("calculator.successDesc")}
                </p>
                <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] inline-block font-mono text-sm font-bold text-primary">
                  {t("calculator.leadId")} {generatedLeadId}
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-sm font-semibold text-foreground transition-colors cursor-pointer"
                  >
                    {t("calculator.btnClose")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
