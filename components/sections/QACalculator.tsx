"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { formatNumber } from "@/lib/utils";
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
  FileCheck,
  Rocket
} from "lucide-react";

import { useCurrency, Currency, UZS_PER_USD } from "@/lib/currency";

interface ServiceItem {
  id: string;
  nameKey: string;
  descKey: string;
  /** Base prices in UZS (so'm) for [basic, standard, premium] tiers */
  pricesUZS: [number, number, number];
  baseDays: number;
  icon: any;
}

const SERVICES_LIST: ServiceItem[] = [
  {
    id: "website",
    nameKey: "calculator.serviceWebsite",
    descKey: "calculator.serviceWebsiteDesc",
    pricesUZS: [500_000, 700_000, 900_000],
    baseDays: 3,
    icon: Globe,
  },
  {
    id: "bot",
    nameKey: "calculator.serviceBot",
    descKey: "calculator.serviceBotDesc",
    pricesUZS: [200_000, 300_000, 400_000],
    baseDays: 2,
    icon: Bot,
  },
  {
    id: "mobile",
    nameKey: "calculator.serviceMobile",
    descKey: "calculator.serviceMobileDesc",
    pricesUZS: [800_000, 1_200_000, 1_500_000],
    baseDays: 4,
    icon: Smartphone,
  },
  {
    id: "crm",
    nameKey: "calculator.serviceCRM",
    descKey: "calculator.serviceCRMDesc",
    pricesUZS: [1_000_000, 1_300_000, 1_500_000],
    baseDays: 5,
    icon: Database,
  },
  {
    id: "automation",
    nameKey: "calculator.serviceAutomation",
    descKey: "calculator.serviceAutomationDesc",
    pricesUZS: [1_500_000, 1_800_000, 2_000_000],
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
  const { currency, setCurrency, format: formatCurrency } = useCurrency();

  // Selections
  const [selectedServices, setSelectedServices] = useState<string[]>(["website"]);
  const [projectState, setProjectState] = useState<string>("dev");
  const [projectSize, setProjectSize] = useState<string>("medium");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["web"]);
  const [packageTier, setPackageTier] = useState<string>("standard");
  const [urgency, setUrgency] = useState<string>("normal");
  const [supportType, setSupportType] = useState<string>("one_time");
  const [isStartup, setIsStartup] = useState<boolean>(true);

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

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      const updated = selectedServices.filter((s) => s !== id);
      setSelectedServices(updated);
      if (updated.length === 0) {
        toastWarning(t("toasts.calcSelectService"), t("toasts.calculatorTitle"));
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
        originalMinPriceUZS: 0,
        originalMaxPriceUZS: 0,
        savingsUZS: 0,
        isStartup: false,
        minDays: 0,
        maxDays: 0,
      };
    }

    // Tier index: basic=0, standard=1, advanced=2
    const tierIdx = packageTier === "basic" ? 0 : packageTier === "advanced" ? 2 : 1;

    let baseTotalUZS = 0;
    let baseDaysTotal = 0;

    selectedServices.forEach((sId) => {
      const s = SERVICES_LIST.find((srv) => srv.id === sId);
      if (s) {
        baseTotalUZS += s.pricesUZS[tierIdx];
        baseDaysTotal += s.baseDays;
      }
    });

    // Multi-service combo discount (5% per extra service, max 20%)
    if (selectedServices.length > 1) {
      baseTotalUZS = baseTotalUZS * (1 - Math.min((selectedServices.length - 1) * 0.05, 0.2));
    }

    // Size coefficient: small (0.8x), medium (1.0x), large (1.35x)
    const sizeCoeff = projectSize === "small" ? 0.8 : projectSize === "medium" ? 1.0 : 1.35;

    // Urgency coefficient: normal (1.0x), express (1.2x), urgent (1.4x)
    const urgencyCoeff = urgency === "normal" ? 1.0 : urgency === "express" ? 1.2 : 1.4;

    // State coefficient: in development (1.0x), production ready (1.05x), legacy (1.15x)
    const stateCoeff = projectState === "dev" ? 1.0 : projectState === "prod" ? 1.05 : 1.15;

    // Monthly adjustment (support model)
    const monthlyMultiplier = supportType === "monthly" ? 1.25 : 1.0;

    // 20% discount for Start-up / MVP projects
    const startupMultiplier = isStartup ? 0.8 : 1.0;

    const baseCalculatedUZS = baseTotalUZS * sizeCoeff * urgencyCoeff * stateCoeff * monthlyMultiplier;
    const calculatedUZS = baseCalculatedUZS * startupMultiplier;

    // Round to clean increments of 100,000 so'm (e.g. 500k -> 500k-600k, 700k -> 700k-800k)
    const roundTo100k = (v: number) => Math.max(100_000, Math.round(v / 100_000) * 100_000);

    const originalMinPriceUZS = roundTo100k(baseCalculatedUZS);
    const originalDelta = Math.max(100_000, Math.round((originalMinPriceUZS * 0.2) / 100_000) * 100_000);
    const originalMaxPriceUZS = originalMinPriceUZS + originalDelta;

    const minPriceUZS = roundTo100k(calculatedUZS);
    const delta = Math.max(100_000, Math.round((minPriceUZS * 0.2) / 100_000) * 100_000);
    const maxPriceUZS = minPriceUZS + delta;

    const savingsUZS = isStartup ? originalMinPriceUZS - minPriceUZS : 0;

    // Realistic days calculation
    const calculatedDays = Math.round(
      baseDaysTotal * (sizeCoeff * 0.8) *
      (urgency === "express" ? 0.75 : urgency === "urgent" ? 0.5 : 1.0)
    );
    const minDays = Math.max(1, Math.round(calculatedDays * 0.8));
    const maxDays = Math.max(2, Math.round(calculatedDays * 1.2));

    return {
      isValid: true,
      minPriceUZS,
      maxPriceUZS,
      originalMinPriceUZS,
      originalMaxPriceUZS,
      savingsUZS,
      isStartup,
      minDays,
      maxDays,
    };
  }, [selectedServices, projectState, projectSize, packageTier, urgency, supportType, isStartup]);

  const handleOpenModal = () => {
    if (selectedServices.length === 0) {
      toastWarning(t("toasts.calcSelectService"), t("toasts.calculatorTitle"));
      return;
    }
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Spam bot trapped

    // Validation
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

    const selectedServiceNames = selectedServices
      .map((sId) => {
        const s = SERVICES_LIST.find((srv) => srv.id === sId);
        return s ? t(s.nameKey) : sId;
      })
      .join(", ");

    const minUSD = Math.max(5, Math.ceil((calculation.minPriceUZS / UZS_PER_USD) / 5) * 5);
    const maxUSD = Math.max(5, Math.ceil((calculation.maxPriceUZS / UZS_PER_USD) / 5) * 5);
    const priceText = `${formatNumber(calculation.minPriceUZS)} – ${formatNumber(calculation.maxPriceUZS)} so'm (~$${minUSD} – $${maxUSD} USD)${isStartup ? " [Start-up -20% chegirma qo'llandi]" : ""}`;
    const durationText = `${calculation.minDays} – ${calculation.maxDays} ish kuni`;

    // Secure server-side Telegram dispatch via /api/lead
    try {
      const res = await fetch("/api/lead", {
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
      console.error("API Lead dispatch error:", err);
      setIsSubmitting(false);
      toastError(
        t("toasts.leadNetworkErrorDesc"),
        t("toasts.leadErrorTitle")
      );
      return;
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
    toastSuccess(`${t("toasts.leadSuccessDesc")} ID: ${leadId}`, t("toasts.leadSuccessTitle"));
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
                <div className="flex items-center gap-2">
                  {selectedServices.length === 0 && (
                    <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Kamida 1 ta
                    </span>
                  )}
                  {/* Currency Toggle */}
                  <div className="flex items-center rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] p-0.5 shrink-0">
                    {(["UZS", "USD"] as Currency[]).map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setCurrency(cur)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          currency === cur
                            ? "bg-primary text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>
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

            {/* Special Startup Discount Card */}
            <div
              onClick={() => setIsStartup(!isStartup)}
              className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isStartup
                  ? "bg-primary/[0.05] dark:bg-primary/[0.1] border-primary ring-1 ring-primary/40 shadow-sm"
                  : "bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    isStartup
                      ? "bg-primary text-white shadow-coral-glow"
                      : "bg-black/5 dark:bg-white/10 text-muted-foreground"
                  }`}
                >
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-foreground">
                      {t("calculator.isStartupLabel")}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary text-white tracking-wide">
                      -20% OFF
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {t("calculator.isStartupDesc")}
                  </p>
                </div>
              </div>

              {/* iOS Style Switch */}
              <div
                className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  isStartup ? "bg-primary" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    isStartup ? "translate-x-5" : "translate-x-0"
                  }`}
                />
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
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">{t("calculator.urgencyLabel")}</label>
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
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">{t("calculator.supportTypeLabel")}</label>
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
            <div className="ios-card p-6 md:p-8 bg-gradient-to-b from-white to-cream-100/60 dark:from-[#1a213b] dark:to-[#15192e] border-primary/30 dark:border-primary/20 shadow-ios-lg">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {t("calculator.estimateTitle")}
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                  {supportType === "monthly" ? t("calculator.supportMonthlyBadge") : t("calculator.supportOneTimeBadge")}
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("calculator.estimatedPrice")}
                      </span>
                      {isStartup && (
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-primary text-white inline-flex items-center gap-1">
                          <Rocket className="h-3 w-3" />
                          {t("calculator.offBadge")}
                        </span>
                      )}
                    </div>

                    {isStartup && (
                      <span className="text-xs line-through text-muted-foreground/70 font-semibold block mt-1.5">
                        {formatCurrency(calculation.originalMinPriceUZS)} – {formatCurrency(calculation.originalMaxPriceUZS)}
                      </span>
                    )}

                    <p className={`text-2xl md:text-3xl font-black text-primary ${isStartup ? "mt-0.5" : "mt-1"}`}>
                      {formatCurrency(calculation.minPriceUZS)} – {formatCurrency(calculation.maxPriceUZS)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        {currency === "UZS"
                          ? `≈ $${(Math.max(5, Math.ceil((calculation.minPriceUZS / UZS_PER_USD) / 5) * 5)).toLocaleString("en-US")} – $${(Math.max(5, Math.ceil((calculation.maxPriceUZS / UZS_PER_USD) / 5) * 5)).toLocaleString("en-US")}`
                          : `≈ ${calculation.minPriceUZS.toLocaleString("ru-RU")} – ${calculation.maxPriceUZS.toLocaleString("ru-RU")} so'm`
                        }
                      </span>
                      {isStartup && calculation.savingsUZS > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {t("calculator.savingsText")} ~{formatCurrency(calculation.savingsUZS)}
                        </span>
                      )}
                    </div>
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
                        <span>{t("calculator.includedItem1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{t("calculator.includedItem2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{t("calculator.includedItem3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{t("calculator.includedItem4")}</span>
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
                    className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-coral-glow flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <Send className="h-4 w-4 shrink-0" />
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

                <form onSubmit={handleSubmitLead} className="space-y-4">
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
                        {t("calculator.fieldName")}
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

                  {/* Summary preview */}
                  <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-xs space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("calculator.estimateTitle")}:</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(calculation.minPriceUZS)} – {formatCurrency(calculation.maxPriceUZS)}
                      </span>
                    </div>
                    {isStartup && (
                      <div className="flex justify-between text-coral-600 dark:text-coral-400 font-semibold">
                        <span>{t("calculator.savingsText")}</span>
                        <span>{t("calculator.startupDiscountBadge")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("calculator.estimatedDuration")}</span>
                      <span className="font-bold text-foreground">
                        {calculation.minDays} – {calculation.maxDays} {t("calculator.daysUnit")}
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
