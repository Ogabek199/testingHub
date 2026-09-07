"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "testinghub_tab_seen";

export function SplashScreen() {
  const [phase, setPhase] = useState<"center" | "reveal" | "settled" | "exit">("center");
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    
    // Ushbu tabda va PWA da animatsiya ko'rilganini belgilaymiz
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
      localStorage.setItem("testinghub_splash_last", Date.now().toString());
    } catch {}

    // Scrollni darhol tiklaymiz va chiqish fazasini boshlaymiz
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("splash-active");
    }
    setPhase("exit");

    // Silliq fade out tugashi bilan komponentni DOM dan yashiramiz
    setTimeout(() => {
      setIsDismissed(true);
    }, 350);
  }, []);

  useEffect(() => {
    try {
      // Agar html elementida splash-active bo'lmasa (avval ko'rilgan yoki prefers-reduced-motion) darhol yopamiz
      if (typeof document !== "undefined" && !document.documentElement.classList.contains("splash-active")) {
        setIsDismissed(true);
        return;
      }

      // Kuchsiz qurilmalar yoki harakatni cheklovchi rejimda animatsiyasiz darhol ochish
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        dismiss();
        return;
      }

      const seenSession = sessionStorage.getItem(STORAGE_KEY);
      const lastSeen = localStorage.getItem("testinghub_splash_last");
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any)?.standalone;

      // Agar joriy sessiyada yoki PWA da so'nggi 8 soat ichida ko'rilgan bo'lsa, qayta yuklamaymiz
      if (seenSession || (isStandalone && lastSeen && Date.now() - parseInt(lastSeen, 10) < 8 * 3600 * 1000)) {
        dismiss();
        return;
      }

      document.body.style.overflow = "hidden";

      const handleBeforeUnload = () => {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
          localStorage.setItem("testinghub_splash_last", Date.now().toString());
        } catch {}
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Tez va silliq harakat vaqt rejasi (Qurilma qotmasligi uchun 1.15s ichida yakunlanadi)
      const t1 = setTimeout(() => setPhase("reveal"), 280);
      const t2 = setTimeout(() => setPhase("settled"), 650);
      const t3 = setTimeout(() => dismiss(), 1150);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
          document.documentElement.classList.remove("splash-active");
        }
      };
    } catch {
      dismiss();
    }
  }, [dismiss]);

  // Unmount bo'lganda scroll va splash holatini kafolatli tiklash
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.classList.remove("splash-active");
      }
    };
  }, []);

  // Agar splash ko'rsatilishi kerak bo'lmasa, DOM dan butunlay olib tashlaymiz
  if (isDismissed) return null;

  const isRevealed = phase === "reveal" || phase === "settled" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <div
      id="testinghub-splash"
      className={`fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden bg-white dark:bg-[#15192e] text-[#161e43] dark:text-white transition-opacity duration-350 ease-in-out ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Chuqur vinetka foni */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#eef5fc_0%,#f7faff_60%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,#1e264a_0%,#171c35_55%,#15192e_100%)]"
      />

      {/* Markazdan kengayuvchi engil nur aurası (GPU friendly) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.2 }}
        animate={{ 
          scale: isExiting ? 2.5 : isRevealed ? [0.8, 1.2, 1.1] : 0.8,
          opacity: isExiting ? 0 : [0.2, 0.35, 0.25]
        }}
        transition={{ duration: isExiting ? 0.4 : 1.0, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-2xl pointer-events-none will-change-transform bg-gradient-to-tr from-[#0fae66]/15 via-[#38bdf8]/10 to-transparent dark:from-[#17ff91]/25 dark:via-[#00e5ff]/15 dark:to-transparent"
      />

      {/* Yengil va silliq impuls halqasi (GPU hardware accelerated) */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{
          scale: [0.3, 1.8, 3.2],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          delay: 0.2,
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute rounded-full pointer-events-none will-change-transform border border-[#0fae66]/50 dark:border-[rgba(23,255,145,0.6)]"
        style={{
          width: 240,
          height: 240,
          transform: "translateZ(0)",
        }}
      />

      {/* Skip Button */}
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-5 right-5 z-30 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer group shadow-md bg-black/5 hover:bg-black/10 border border-black/10 text-slate-700 hover:text-black dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15 dark:text-white/75 dark:hover:text-white"
      >
        <span>O&apos;tkazib yuborish</span>
        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform text-[#0fae66] dark:text-[#17ff91]" />
      </button>

      {/* ═════════════════════════════════════════════════════════════════
          ASOSIY LOGO KONTAYNERI
      ═════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-center justify-center px-6">
        
        {/* 1. Logo Icon: Avval markazda chiqadi, so'ng chapga suriladi */}
        <motion.div
          layout
          initial={{ scale: 0.9, opacity: 1 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
          }}
          transition={{
            layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }}
          className="relative shrink-0 flex items-center justify-center"
        >
          {/* Full uncropped icon (516x344 ratio = 1.5:1) */}
          <div className="relative w-[105px] h-[70px] sm:w-[129px] sm:h-[86px] md:w-[150px] md:h-[100px] flex items-center justify-center">
            <Image
              src="/images/icon-light.png"
              alt="TestingHub Logo Mark"
              width={150}
              height={100}
              priority
              className="object-contain w-full h-full block dark:hidden drop-shadow-[0_4px_20px_rgba(15,174,102,0.35)]"
            />
            <Image
              src="/images/icon-dark.png"
              alt="TestingHub Logo Mark"
              width={150}
              height={100}
              priority
              className="object-contain w-full h-full hidden dark:block drop-shadow-[0_0_30px_rgba(23,255,145,0.65)]"
            />

            {/* Soft specular sheen sweep */}
            <motion.div
              initial={{ x: "-150%", opacity: 0 }}
              animate={isRevealed ? { x: "200%", opacity: [0, 0.6, 0] } : {}}
              transition={{ delay: 0.4, duration: 0.85, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* 2. Company Name Text: Icon yonidan surilib ochiladi */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ 
                width: "auto", 
                opacity: 1, 
                x: 0 
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="overflow-hidden flex flex-col justify-center ml-4 sm:ml-5 md:ml-6 text-left shrink-0"
            >
              {/* Company Name: Testing + Hub */}
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1c275d] dark:text-white drop-shadow-xs dark:drop-shadow-sm">
                  Testing
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0fae66] dark:text-[#17ff91] drop-shadow-[0_0_25px_rgba(15,174,102,0.4)] dark:drop-shadow-[0_0_30px_rgba(23,255,145,0.75)]">
                  Hub
                </span>
              </div>

              {/* Subtitle / Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.22em] uppercase whitespace-nowrap mt-1 sm:mt-1.5 text-[#616e8a] dark:text-[#c0e1ff]/85"
              >
                Global Testing Community
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
