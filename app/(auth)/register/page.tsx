"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";
import { UserPlus, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await register(name, email, password, company);
    setIsLoading(false);

    if (res.success) {
      toastSuccess("Akkauntingiz muvaffaqiyatli yaratildi!", "Xush kelibsiz");
      router.push("/dashboard");
    } else {
      const errMsg = res.error || "Ro'yxatdan o'tishda xatolik";
      setError(errMsg);
      toastError(errMsg, "Xatolik");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-background">
      <div className="ios-card max-w-md w-full p-8 md:p-10 shadow-ios-lg">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("nav.home")}</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-coral-50 dark:bg-coral-950/60 text-primary flex items-center justify-center mx-auto mb-3 font-serif font-bold text-lg">
            QA
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("auth.registerTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("auth.registerSubtitle")}
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t("auth.nameLabel")} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ali Valiyev"
              className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t("auth.emailLabel")} *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ali@company.com"
              className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t("auth.companyLabel")}
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Startup / IT Company"
              className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t("auth.passwordLabel")} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-3 pr-10 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-coral-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span>Yaratilmoqda...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>{t("auth.btnRegister")}</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to login */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            {t("auth.btnLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
