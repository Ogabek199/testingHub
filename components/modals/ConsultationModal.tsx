"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConsultationModal } from "@/lib/consultation-context";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { CONTACT_TELEGRAM } from "@/lib/constants";
import {
  X,
  Send,
  Sparkles,
  Check,
  AlertCircle,
  Phone,
  User,
  Mail,
  Building2,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  formatPersonName,
  validatePersonName,
  formatPhoneNumber,
  validatePhoneNumber,
  formatEmail,
  validateEmail,
  formatTelegramUsername,
  validateTelegramUsername,
  formatCompanyName,
  formatComment,
  FormLanguage,
} from "@/lib/validation";

interface ServiceItem {
  id: string;
  labelKey: string;
}

const SERVICES_LIST: ServiceItem[] = [
  { id: "web", labelKey: "consultationModal.serviceWeb" },
  { id: "mobile", labelKey: "consultationModal.serviceMobile" },
  { id: "automation", labelKey: "consultationModal.serviceAutomation" },
  { id: "performance", labelKey: "consultationModal.servicePerformance" },
  { id: "general", labelKey: "consultationModal.serviceGeneral" },
];

export function ConsultationModal() {
  const { isOpen, options, closeConsultationModal } = useConsultationModal();
  const { t, language } = useTranslation();
  const { success: toastSuccess, error: toastError } = useToast();

  const currentLang = (language as FormLanguage) || "uz";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    company: "",
    comment: "",
    honeypot: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>(["general"]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Set default service/plan if passed from options
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setTouched({});
      if (options.defaultService) {
        setSelectedServices([options.defaultService]);
      } else {
        setSelectedServices(["general"]);
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, options]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeConsultationModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeConsultationModal]);

  if (!isOpen) return null;

  // Pure multi-select toggle logic
  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAllServices = () => {
    if (selectedServices.length === SERVICES_LIST.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(SERVICES_LIST.map((s) => s.id));
    }
  };

  // Validation states in current selected language
  const nameValidation = validatePersonName(formData.name, currentLang);
  const phoneValidation = validatePhoneNumber(formData.phone, currentLang);
  const emailValidation = validateEmail(formData.email, false, currentLang);
  const telegramValidation = validateTelegramUsername(formData.telegram, false, currentLang);

  const isFormValid =
    nameValidation.isValid &&
    phoneValidation.isValid &&
    emailValidation.isValid &&
    telegramValidation.isValid &&
    selectedServices.length > 0;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPersonName(e.target.value);
    setFormData((prev) => ({ ...prev, name: formatted }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const input = e.currentTarget;
      const { selectionStart, selectionEnd, value } = input;
      if (selectionStart !== null && selectionStart === selectionEnd && selectionStart > 0) {
        const charBefore = value[selectionStart - 1];
        if (charBefore === ")" || charBefore === "-" || charBefore === " " || charBefore === "(") {
          e.preventDefault();
          let deleteTo = selectionStart - 1;
          while (
            deleteTo > 0 &&
            (value[deleteTo - 1] === ")" ||
              value[deleteTo - 1] === "-" ||
              value[deleteTo - 1] === " " ||
              value[deleteTo - 1] === "(")
          ) {
            deleteTo--;
          }
          if (deleteTo > 0) {
            deleteTo--;
          }
          const newValue = value.slice(0, deleteTo) + value.slice(selectionStart);
          const formatted = formatPhoneNumber(newValue);
          setFormData((prev) => ({ ...prev, phone: formatted }));
        }
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEmail(e.target.value);
    setFormData((prev) => ({ ...prev, email: formatted }));
  };

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelegramUsername(e.target.value);
    setFormData((prev) => ({ ...prev, telegram: formatted }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCompanyName(e.target.value);
    setFormData((prev) => ({ ...prev, company: formatted }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formatted = formatComment(e.target.value);
    setFormData((prev) => ({ ...prev, comment: formatted }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      email: true,
      telegram: true,
      company: true,
    });

    if (!nameValidation.isValid) {
      toastError(
        nameValidation.error || t("consultationModal.valNameRequired"),
        t("toasts.validationErrorTitle")
      );
      return;
    }

    if (!phoneValidation.isValid) {
      toastError(
        phoneValidation.error || t("toasts.valPhoneInvalid"),
        t("toasts.validationErrorTitle")
      );
      return;
    }

    if (!emailValidation.isValid) {
      toastError(
        emailValidation.error || t("consultationModal.valEmailInvalid"),
        t("toasts.validationErrorTitle")
      );
      return;
    }

    if (!telegramValidation.isValid) {
      toastError(
        telegramValidation.error || t("consultationModal.valTgInvalid"),
        t("toasts.validationErrorTitle")
      );
      return;
    }

    if (selectedServices.length === 0) {
      toastError(
        t("consultationModal.valServiceRequired"),
        t("toasts.validationErrorTitle")
      );
      return;
    }

    if (!isFormValid) {
      toastError(
        t("consultationModal.valFormError"),
        t("toasts.validationErrorTitle")
      );
      return;
    }

    if (formData.honeypot) return;

    setIsSubmitting(true);
    const leadId = `CONS-${Math.floor(100000 + Math.random() * 900000)}`;

    const selectedServicesTitles = selectedServices
      .map((id) => {
        const found = SERVICES_LIST.find((s) => s.id === id);
        return found ? t(found.labelKey) : id;
      })
      .join(", ");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          telegram: formData.telegram.trim() || undefined,
          company: formData.company.trim() || undefined,
          services: `${t("consultationModal.badge")}: ${selectedServicesTitles}`,
          price: "0 UZS (Bepul konsultatsiya)",
          duration: "15 daqiqa ichida bog'lanish",
          comment: formData.comment.trim() || undefined,
          honeypot: formData.honeypot,
          formName: "Bepul Konsultatsiya (Modal)",
          source: "Bepul Konsultatsiya",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "So'rovni yuborishda xatolik yuz berdi");
      }

      setGeneratedLeadId(leadId);
      setIsSubmitted(true);
      toastSuccess(
        `${t("consultationModal.successTitle")} ID: ${leadId}`,
        t("toasts.leadSuccessTitle")
      );
    } catch (err: any) {
      console.error("Consultation submit error:", err);
      toastError(
        err.message || t("toasts.leadNetworkErrorDesc"),
        t("toasts.leadErrorTitle")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/65 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeConsultationModal();
      }}
    >
      <div className="ios-card w-full max-w-2xl p-4 sm:p-6 md:p-7 bg-background border border-black/10 dark:border-white/10 shadow-2xl relative animate-scale-in my-auto max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={closeConsultationModal}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10"
          aria-label={t("consultationModal.btnClose")}
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-4 sm:mb-5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>{t("consultationModal.badge")}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t("consultationModal.title")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                {t("consultationModal.subtitle")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Honeypot for bot spam */}
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

              {/* 1. Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t("consultationModal.fieldName")}</span>
                      <span className="text-primary">*</span>
                    </span>
                    {touched.name && nameValidation.isValid && (
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> {t("consultationModal.validCorrect")}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      onBlur={() => handleBlur("name")}
                      placeholder={t("consultationModal.fieldNamePlaceholder")}
                      className={`w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all ${
                        touched.name && !nameValidation.isValid
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : touched.name && nameValidation.isValid
                          ? "border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                          : "border-black/[0.08] dark:border-white/[0.1] focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      }`}
                    />
                  </div>
                  {touched.name && !nameValidation.isValid && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {nameValidation.error}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t("consultationModal.fieldPhone")}</span>
                      <span className="text-primary">*</span>
                    </span>
                    {touched.phone && phoneValidation.isValid && (
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> {t("consultationModal.validCorrect")}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onKeyDown={handlePhoneKeyDown}
                      onBlur={() => handleBlur("phone")}
                      placeholder={t("consultationModal.fieldPhonePlaceholder")}
                      maxLength={19}
                      className={`w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border text-xs sm:text-sm text-foreground font-mono placeholder:text-muted-foreground/60 focus:outline-none transition-all ${
                        touched.phone && !phoneValidation.isValid
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : touched.phone && phoneValidation.isValid
                          ? "border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                          : "border-black/[0.08] dark:border-white/[0.1] focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      }`}
                    />
                  </div>
                  {touched.phone && !phoneValidation.isValid && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {phoneValidation.error}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Email & Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t("consultationModal.fieldEmail")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({t("consultationModal.optionalLabel")})
                      </span>
                    </span>
                    {formData.email && touched.email && emailValidation.isValid && (
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur("email")}
                    placeholder={t("consultationModal.fieldEmailPlaceholder")}
                    className={`w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all ${
                      touched.email && !emailValidation.isValid
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-black/[0.08] dark:border-white/[0.1] focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    }`}
                  />
                  {touched.email && !emailValidation.isValid && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {emailValidation.error}
                    </p>
                  )}
                </div>

                {/* Telegram */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <Send className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t("consultationModal.fieldTelegram")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({t("consultationModal.optionalLabel")})
                      </span>
                    </span>
                    {formData.telegram && touched.telegram && telegramValidation.isValid && (
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={handleTelegramChange}
                    onBlur={() => handleBlur("telegram")}
                    placeholder={t("consultationModal.fieldTelegramPlaceholder")}
                    className={`w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border text-xs sm:text-sm text-foreground font-mono placeholder:text-muted-foreground/60 focus:outline-none transition-all ${
                      touched.telegram && !telegramValidation.isValid
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-black/[0.08] dark:border-white/[0.1] focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    }`}
                  />
                  {touched.telegram && !telegramValidation.isValid && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {telegramValidation.error}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Service Direction Multi-Selection */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 min-w-0">
                    <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{t("consultationModal.fieldService")}</span>
                    <span className="text-[11px] text-muted-foreground font-normal hidden md:inline">
                      {t("consultationModal.selectMultipleHint")}
                    </span>
                  </label>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={handleToggleAllServices}
                      className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline cursor-pointer"
                    >
                      {selectedServices.length === SERVICES_LIST.length
                        ? t("consultationModal.deselectAll")
                        : t("consultationModal.selectAll")}
                    </button>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary whitespace-nowrap">
                      {selectedServices.length} {t("consultationModal.itemsSelected")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES_LIST.map((srv) => {
                    const isSelected = selectedServices.includes(srv.id);
                    const label = t(srv.labelKey);
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => toggleService(srv.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left text-[11.5px] sm:text-xs transition-all cursor-pointer flex items-center justify-between gap-2 select-none min-h-[46px] ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-sm shadow-primary/25 ring-1 ring-primary font-semibold"
                            : "bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.08] dark:border-white/[0.1] text-foreground hover:border-primary/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-medium"
                        }`}
                      >
                        <span className="leading-snug line-clamp-2">{label}</span>
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-white text-primary"
                              : "border border-black/20 dark:border-white/20"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedServices.length === 0 && (
                  <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {t("consultationModal.valServiceRequired")}
                  </p>
                )}
              </div>

              {/* 4. Company Name & Comments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t("consultationModal.fieldCompany")}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={handleCompanyChange}
                    placeholder={t("consultationModal.fieldCompanyPlaceholder")}
                    className="w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t("consultationModal.fieldComment")}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formData.comment.length}/1000
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.comment}
                    onChange={handleCommentChange}
                    placeholder={t("consultationModal.fieldCommentPlaceholder")}
                    className="w-full h-10 sm:h-10.5 px-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Security & Guarantee badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>{t("consultationModal.ndaBadge")}</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-coral-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-[0.99] mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("consultationModal.btnSending")}</span>
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{t("consultationModal.btnSubmit")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-8 text-center space-y-4 animate-scale-in">
            <div className="h-20 w-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <FileCheck className="h-10 w-10" />
            </div>

            <h3 className="text-2xl font-bold text-foreground">
              {t("consultationModal.successTitle")}
            </h3>

            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t("consultationModal.successDesc")}
            </p>

            <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] inline-flex items-center gap-2 font-mono text-sm font-bold text-primary">
              <span>ID:</span>
              <span className="tracking-wider">{generatedLeadId}</span>
            </div>

            <div className="pt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={closeConsultationModal}
                className="px-6 py-2.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-sm font-bold text-foreground transition-colors cursor-pointer"
              >
                {t("consultationModal.btnClose")}
              </button>

              <a
                href={CONTACT_TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-coral-glow hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{t("consultationModal.btnTelegram")}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
