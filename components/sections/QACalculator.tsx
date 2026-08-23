"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import {
  Globe,
  Database,
  Smartphone,
  Cpu,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  Layers,
  Zap,
  Check,
  X,
  ShieldCheck,
  FileCheck
} from "lucide-react";

interface ServiceItem {
  id: string;
  nameKey: string;
  descKey: string;
  basePriceUZS: number;
  baseDays: number;
  icon: any;
}

const SERVICES_LIST: ServiceItem[] = [
  {
    id: "website",
    nameKey: "calculator.serviceWebsite",
    descKey: "calculator.serviceWebsiteDesc",
    basePriceUZS: 1500000,
    baseDays: 3,
    icon: Globe,
  },
  {
    id: "bot",
    nameKey: "calculator.serviceBot",
    descKey: "calculator.serviceBotDesc",
    basePriceUZS: 900000,
    baseDays: 2,
    icon: Bot,
  },
  {
    id: "mobile",
    nameKey: "calculator.serviceMobile",
    descKey: "calculator.serviceMobileDesc",
    basePriceUZS: 2500000,
    baseDays: 4,
    icon: Smartphone,
  },
  {
    id: "crm",
    nameKey: "calculator.serviceCRM",
    descKey: "calculator.serviceCRMDesc",
    basePriceUZS: 3000000,
    baseDays: 5,
    icon: Database,
  },
  {
    id: "automation",
    nameKey: "calculator.serviceAutomation",
    descKey: "calculator.serviceAutomationDesc",
    basePriceUZS: 3200000,
    baseDays: 5,
    icon: Cpu,
  },
];

const formatUzbekPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "+998 ";

  let cleanDigits = digits;
  if (cleanDigits.startsWith("998")) {
    cleanDigits = cleanDigits.substring(3);
  }
  cleanDigits = cleanDigits.substring(0, 9);

  let formatted = "+998";
  if (cleanDigits.length > 0) {
    formatted += " " + cleanDigits.substring(0, 2);
  }
  if (cleanDigits.length >= 3) {
    formatted += " " + cleanDigits.substring(2, 5);
  }
  if (cleanDigits.length >= 6) {
    formatted += " " + cleanDigits.substring(5, 7);
  }
  if (cleanDigits.length >= 8) {
    formatted += " " + cleanDigits.substring(7, 9);
  }

  return formatted;
};

export function QACalculator() {
  const { t } = useTranslation();
  const { toast, success: toastSuccess, error: toastError, warning: toastWarning } = useToast();

  // Selections
  const [selectedServices, setSelectedServices] = useState<string[]>(["website"]);
  const [projectState, setProjectState] = useState<string>("dev");
  const [projectSize, setProjectSize] = useState<string>("medium");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["web"]);
  const [packageTier, setPackageTier] = useState<string>("standard");
  const [urgency, setUrgency] = useState<string>("normal");
  const [supportType, setSupportType] = useState<string>("one_time");

  // Modal & Lead state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState("");

  // Lead Form inputs
  const [formData, setFormData] = useState({
    name: "",
    phone: "+998 ",
    email: "",
    company: "",
    telegram: "",
    comment: "",
    honeypot: "", // anti-spam
  });
  const [formError, setFormError] = useState("");

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      const updated = selectedServices.filter((s) => s !== id);
      setSelectedServices(updated);
      if (updated.length === 0) {
        toastWarning("Kamida 1 ta xizmat turini tanlashingiz kerak!", "Kalkulyator");
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  // Calculation coefficients calibrated for Uzbekistan IT & QA market
  const calculation = useMemo(() => {
    if (selectedServices.length === 0) {
      return {
        isValid: false,
        minPriceUZS: 0,
        maxPriceUZS: 0,
        minDays: 0,
        maxDays: 0,
        priceUSD: 0,
      };
    }

    let baseTotal = 0;
    let baseDaysTotal = 0;

    selectedServices.forEach((sId) => {
      const s = SERVICES_LIST.find((srv) => srv.id === sId);
      if (s) {
        baseTotal += s.basePriceUZS;
        baseDaysTotal += s.baseDays;
      }
    });

    // Multi-service combo discount (if user picks 2 or more, give 10-15% bundle efficiency)
    if (selectedServices.length > 1) {
      baseTotal = baseTotal * (1 - (selectedServices.length - 1) * 0.05);
    }

    // Size coefficient: small (0.8x), medium (1.0x), large (1.35x)
    const sizeCoeff = projectSize === "small" ? 0.8 : projectSize === "medium" ? 1.0 : 1.35;

    // Package tier coefficient: basic (0.85x), standard (1.0x), advanced (1.3x)
    const packageCoeff = packageTier === "basic" ? 0.85 : packageTier === "standard" ? 1.0 : 1.3;

    // Urgency coefficient: normal (1.0x), express (1.2x), urgent (1.4x)
    const urgencyCoeff = urgency === "normal" ? 1.0 : urgency === "express" ? 1.2 : 1.4;

    // State coefficient: in development (1.0x), production ready (1.05x), legacy (1.15x)
    const stateCoeff = projectState === "dev" ? 1.0 : projectState === "prod" ? 1.05 : 1.15;

    // Monthly adjustment (support model)
    const monthlyMultiplier = supportType === "monthly" ? 1.25 : 1.0;

    const calculatedBase = baseTotal * sizeCoeff * packageCoeff * urgencyCoeff * stateCoeff * monthlyMultiplier;
    
    // Smooth rounding to nearest 50,000 UZS
    const minPriceUZS = Math.max(750000, Math.round((calculatedBase * 0.92) / 50000) * 50000);
    const maxPriceUZS = Math.max(950000, Math.round((calculatedBase * 1.12) / 50000) * 50000);

    // Realistic days calculation
    const calculatedDays = Math.round(baseDaysTotal * (sizeCoeff * 0.8) * (urgency === "express" ? 0.75 : urgency === "urgent" ? 0.5 : 1.0));
    const minDays = Math.max(1, Math.round(calculatedDays * 0.8));
    const maxDays = Math.max(2, Math.round(calculatedDays * 1.2));

    const priceUSD = Math.round(minPriceUZS / 12850);

    return {
      isValid: true,
      minPriceUZS,
      maxPriceUZS,
      minDays,
      maxDays,
      priceUSD,
    };
  }, [selectedServices, projectState, projectSize, packageTier, urgency, supportType]);

  const handleOpenModal = () => {
    if (selectedServices.length === 0) {
      toastWarning("Iltimos, so'rov yuborish uchun kamida 1 ta xizmatni tanlang!", "Kalkulyator");
      return;
    }
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormError("");
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Spam bot trapped

    // Validation
    const nameTrim = formData.name.trim();
    if (!nameTrim || nameTrim.length < 3) {
      const errMsg = "Iltimos, ismingizni to'liq kiriting (kamida 3 ta harf)!";
      setFormError(errMsg);
      toastError(errMsg, "Validatsiya xatosi");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 12) {
      const errMsg = "Iltimos, to'liq telefon raqamingizni kiriting (+998 XX XXX XX XX)!";
      setFormError(errMsg);
      toastError(errMsg, "Validatsiya xatosi");
      return;
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        const errMsg = "Email manzili formati noto'g'ri (masalan: client@example.com)!";
        setFormError(errMsg);
        toastError(errMsg, "Validatsiya xatosi");
        return;
      }
    }

    setIsSubmitting(true);
    setFormError("");

    const leadId = "QA-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedLeadId(leadId);

    const formattedTelegram = formData.telegram.trim()
      ? formData.telegram.trim().startsWith("@")
        ? formData.telegram.trim()
        : "@" + formData.telegram.trim()
      : "";

    const selectedServiceNames = selectedServices
      .map((sId) => {
        const s = SERVICES_LIST.find((srv) => srv.id === sId);
        return s ? t(s.nameKey) : sId;
      })
      .join(", ");

    const priceText = `${calculation.minPriceUZS.toLocaleString()} – ${calculation.maxPriceUZS.toLocaleString()} UZS (~$${calculation.priceUSD})`;
    const durationText = `${calculation.minDays} – ${calculation.maxDays} ish kuni`;

    // Secure server-side Telegram dispatch via /api/lead
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameTrim,
          phone: formData.phone,
          email: formData.email.trim(),
          company: formData.company.trim(),
          telegram: formattedTelegram,
          comment: formData.comment.trim(),
          services: selectedServiceNames,
          price: priceText,
          duration: durationText,
          leadId,
          honeypot: formData.honeypot,
        }),
      });
    } catch (err) {
      console.error("API Lead dispatch error:", err);
    }

    // Save lead locally to display on dashboard
    try {
      const existingQuotes = JSON.parse(localStorage.getItem("testinghub_quotes") || "[]");
      existingQuotes.unshift({
        id: leadId,
        date: new Date().toISOString().split("T")[0],
        name: nameTrim,
        phone: formData.phone,
        services: selectedServiceNames,
        price: priceText,
        status: "pending",
      });
      localStorage.setItem("testinghub_quotes", JSON.stringify(existingQuotes));
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    toastSuccess("So'rovingiz qabul qilindi! ID: " + leadId, "Muvaffaqiyatli");
  };

  return (
    <section id="calculator" className="py-16 md:py-24 bg-background">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-50 dark:bg-coral-950/60 border border-coral-200/80 dark:border-coral-800/50 text-coral-600 dark:text-coral-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("calculator.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("calculator.title")}
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t("calculator.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Questions Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select Services */}
            <div className="ios-card p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">1</span>
                  {t("calculator.step1")}
                </h3>
                {selectedServices.length === 0 && (
                  <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Kamida 1 ta
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES_LIST.map((srv) => {
                  const Icon = srv.icon;
                  const isChecked = selectedServices.includes(srv.id);

                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? "bg-primary/[0.04] dark:bg-primary/[0.08] border-primary ring-1 ring-primary/40 shadow-sm"
                          : "bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-primary text-white"
                            : "bg-black/5 dark:bg-white/10 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {t(srv.nameKey)}
                          </h4>
                          {isChecked && (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 ml-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {t(srv.descKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2 & 3: Project State & Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Step 2: State */}
              <div className="ios-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-foreground text-xs font-bold">2</span>
                  {t("calculator.step2")}
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "dev", labelKey: "calculator.stateDev" },
                    { id: "prod", labelKey: "calculator.stateProd" },
                    { id: "relaunch", labelKey: "calculator.stateRelaunch" },
                    { id: "existing", labelKey: "calculator.stateExisting" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectState(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        projectState === item.id
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-foreground"
                      }`}
                    >
                      {t(item.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Size */}
              <div className="ios-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-foreground text-xs font-bold">3</span>
                  {t("calculator.step3")}
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "small", labelKey: "calculator.sizeSmall" },
                    { id: "medium", labelKey: "calculator.sizeMedium" },
                    { id: "large", labelKey: "calculator.sizeLarge" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectSize(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        projectSize === item.id
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-foreground"
                      }`}
                    >
                      {t(item.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4 & 5: Platform & Package Tier */}
            <div className="ios-card p-6 md:p-7">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-foreground text-xs font-bold">4</span>
                {t("calculator.step5")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "basic",
                    titleKey: "calculator.packageBasic",
                    descKey: "calculator.packageBasicDesc",
                    coeff: "1.0x",
                  },
                  {
                    id: "standard",
                    titleKey: "calculator.packageStandard",
                    descKey: "calculator.packageStandardDesc",
                    coeff: "1.5x (Tavsiya)",
                  },
                  {
                    id: "advanced",
                    titleKey: "calculator.packageAdvanced",
                    descKey: "calculator.packageAdvancedDesc",
                    coeff: "2.0x",
                  },
                ].map((pkg) => {
                  const isSelected = packageTier === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setPackageTier(pkg.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-primary/[0.04] dark:bg-primary/[0.08] border-primary ring-1 ring-primary/40 shadow-sm"
                          : "bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-sm font-bold text-foreground">
                            {t(pkg.titleKey)}
                          </h4>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t(pkg.descKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 6: Urgency & Support Type */}
            <div className="ios-card p-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-foreground text-xs font-bold">5</span>
                {t("calculator.step6")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Urgency */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Muddat tezligi:</label>
                  <div className="space-y-1.5">
                    {[
                      { id: "normal", labelKey: "calculator.urgencyNormal" },
                      { id: "express", labelKey: "calculator.urgencyExpress" },
                      { id: "urgent", labelKey: "calculator.urgencyUrgent" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUrgency(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          urgency === item.id
                            ? "bg-primary/10 border-primary text-primary font-bold"
                            : "border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-foreground"
                        }`}
                      >
                        {t(item.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Hamkorlik formati:</label>
                  <div className="space-y-1.5">
                    {[
                      { id: "one_time", labelKey: "calculator.supportOneTime" },
                      { id: "monthly", labelKey: "calculator.supportMonthly" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSupportType(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          supportType === item.id
                            ? "bg-primary/10 border-primary text-primary font-bold"
                            : "border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-foreground"
                        }`}
                      >
                        {t(item.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Calculation Result Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="ios-card p-6 md:p-8 bg-gradient-to-b from-white to-cream-100/60 dark:from-[#18181C] dark:to-[#121215] border-coral-500/30 dark:border-coral-500/20 shadow-ios-lg">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {t("calculator.estimateTitle")}
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                  {supportType === "monthly" ? "Oylik" : "1 martalik"}
                </span>
              </div>

              {calculation.isValid ? (
                <div className="space-y-5 mt-5">
                  {/* Selected Services Tags */}
                  <div>
                    <span className="text-xs text-muted-foreground block mb-2">
                      {t("calculator.selectedServices")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedServices.map((sId) => {
                        const s = SERVICES_LIST.find((srv) => srv.id === sId);
                        return (
                          <span
                            key={sId}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/[0.04] dark:bg-white/10 text-foreground"
                          >
                            <Check className="h-3 w-3 text-primary" />
                            {s ? t(s.nameKey) : sId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Price */}
                  <div className="p-4 rounded-2xl bg-primary/[0.05] dark:bg-primary/[0.1] border border-primary/20">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("calculator.estimatedPrice")}
                    </span>
                    <p className="text-2xl md:text-3xl font-black text-primary mt-1">
                      {calculation.minPriceUZS.toLocaleString()} – {calculation.maxPriceUZS.toLocaleString()} UZS
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Taxminan ~${calculation.priceUSD.toLocaleString()} USD
                    </p>
                  </div>

                  {/* Estimated Timeline */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {t("calculator.estimatedDuration")}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {calculation.minDays} – {calculation.maxDays} {t("calculator.daysUnit")}
                    </span>
                  </div>

                  {/* Included checklist */}
                  <div>
                    <span className="text-xs font-bold text-foreground block mb-2">
                      {t("calculator.includedTitle")}
                    </span>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Kritik va asosiy user flow&apos;lar tekshiruvi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Batafsil Bug Report (Skrinshot, Video va Loglar)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Retest (Tuzatilgan xatolarni qayta tekshirish)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Maxfiylik kafolati (NDA)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                    {t("calculator.disclaimer")}
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={handleOpenModal}
                    className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-coral-glow flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t("calculator.btnSubmitLead")}</span>
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {t("calculator.validationError")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Submission Modal (iOS style bottom/center sheet) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="ios-card w-full max-w-lg p-6 md:p-8 bg-background border border-black/10 dark:border-white/10 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("calculator.modalTitle")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-5">
                  {t("calculator.modalSubtitle")}
                </p>

                {formError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitLead} className="space-y-4">
                  {/* Honeypot for spam bots */}
                  <input
                    type="text"
                    name="website_url_hp"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        {t("calculator.fieldName")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ali Valiyev"
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
                        placeholder="client@example.com"
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
                        placeholder="@username"
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
                      placeholder="Kompaniya nomi yoki startup"
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
                      placeholder="Loyiha tafsilotlari yoki qo'shimcha talablar..."
                      className="w-full p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Summary preview */}
                  <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-xs space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Kalkulyator hisobi:</span>
                      <span className="font-bold text-foreground">
                        {calculation.minPriceUZS.toLocaleString()} – {calculation.maxPriceUZS.toLocaleString()} UZS
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Muddati:</span>
                      <span className="font-bold text-foreground">
                        {calculation.minDays} – {calculation.maxDays} ish kuni
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-coral-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-sm font-semibold text-foreground transition-colors"
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
