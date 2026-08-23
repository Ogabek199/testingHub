"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";
import { LogIn, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const reason = searchParams.get("reason");

  useEffect(() => {
    if (reason === "auth_required") {
      toastWarning("Dashboard sahifasiga kirish uchun tizimga kiring!", "Xavfsizlik");
    }
  }, [reason]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      toastSuccess("Tizimga muvaffaqiyatli kirdingiz!", "Xush kelibsiz");
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } else {
      const errMsg = res.error || "Kirishda xatolik yuz berdi";
      setError(errMsg);
      toastError(errMsg, "Kirishda xatolik");
    }
  };

  return (
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
          {t("auth.loginTitle")}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {t("auth.loginSubtitle")}
        </p>
      </div>

      {/* Auth required warning if intercepted */}
      {reason === "auth_required" && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{t("auth.authRequired")}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            {t("auth.emailLabel")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@testinghub.uz"
            className="w-full h-10 px-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-foreground">
              {t("auth.passwordLabel")}
            </label>
          </div>
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
          className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-coral-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span>Kirilmoqda...</span>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>{t("auth.btnLogin")}</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to register */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="font-bold text-primary hover:underline">
          {t("auth.btnRegister")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-background">
      <Suspense fallback={<div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
