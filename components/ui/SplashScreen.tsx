"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "testinghub_tab_seen";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [phase, setPhase] = useState<"center" | "reveal" | "settled" | "exit">("center");
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

    // Silliq fade out tugashi bilan komponentni yashiramiz
    setTimeout(() => {
      setIsVisible(false);
    }, 350);
  }, []);

  useEffect(() => {
    setHasMounted(true);

    try {
      // Mavzuni html elementidan aniqlaymiz
      if (typeof document !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"));

        // Kuchsiz qurilmalar yoki harakatni cheklovchi rejimda animatsiyasiz darhol ochish
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setIsVisible(false);
          document.body.style.overflow = "";
          document.documentElement.classList.remove("splash-active");
          return;
        }

        const seenSession = sessionStorage.getItem(STORAGE_KEY);
        const lastSeen = localStorage.getItem("testinghub_splash_last");
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any)?.standalone;

        // Agar joriy sessiyada yoki PWA da so'nggi 8 soat ichida ko'rilgan bo'lsa, qayta yuklamaymiz (qurilma qotmasligi uchun)
        if (seenSession || (isStandalone && lastSeen) || (lastSeen && Date.now() - parseInt(lastSeen, 10) < 8 * 3600 * 1000)) {
          setIsVisible(false);
          document.body.style.overflow = "";
          document.documentElement.classList.remove("splash-active");
          return;
        }
      }

      // Tabda birinchi marta kirganda animatsiyani yoqamiz
      setIsVisible(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }

      const handleBeforeUnload = () => {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
          localStorage.setItem("testinghub_splash_last", Date.now().toString());
        } catch {}
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Tez va silliq harakat vaqt rejasi (Qurilma qotmasligi uchun 1.1s ichida yakunlanadi)
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
        }
      };
    } catch {
      setIsVisible(false);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.classList.remove("splash-active");
      }
    }
  }, [dismiss]);

  // Unmount bo'lganda scrollni kafolatli tiklash
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.classList.remove("splash-active");
      }
    };
  }, []);

  if (!hasMounted || !isVisible) return null;

  const isRevealed = phase === "reveal" || phase === "settled" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="testinghub-splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.35, ease: "easeInOut" } 
          }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden transition-colors duration-200 ${
            isDark ? "bg-[#15192e] text-white" : "bg-white text-[#161e43]"
          } ${isExiting ? "pointer-events-none" : ""}`}
        >
          {/* Chuqur vinetka foni */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(circle at 50% 50%, #1e264a 0%, #171c35 55%, #15192e 100%)"
                : "radial-gradient(circle at 50% 50%, #eef5fc 0%, #f7faff 60%, #ffffff 100%)",
            }}
          />

          {/* Markazdan kengayuvchi engil nur aurası (GPU friendly) */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ 
              scale: isExiting ? 2.5 : isRevealed ? [0.8, 1.2, 1.1] : 0.8,
              opacity: isExiting ? 0 : [0, isDark ? 0.35 : 0.2, isDark ? 0.25 : 0.15]
            }}
            transition={{ duration: isExiting ? 0.4 : 1.0, ease: "easeOut" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-2xl pointer-events-none will-change-transform ${
              isDark
                ? "bg-gradient-to-tr from-[#17ff91]/25 via-[#00e5ff]/15 to-transparent"
                : "bg-gradient-to-tr from-[#0fae66]/15 via-[#38bdf8]/10 to-transparent"
            }`}
          />

          {/* Yengil va silliq impuls halqasi (GPU hardware accelerated) */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{
              scale: [0.3, 1.8, 3.2],
              opacity: [0, isDark ? 0.75 : 0.5, 0],
            }}
            transition={{
              delay: 0.2,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute rounded-full pointer-events-none will-change-transform"
            style={{
              width: 240,
              height: 240,
              border: isDark
                ? "1.5px solid rgba(23, 255, 145, 0.6)"
                : "1.5px solid rgba(15, 174, 102, 0.5)",
              transform: "translateZ(0)",
            }}
          />

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            onClick={dismiss}
            className={`absolute top-5 right-5 z-30 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer group shadow-md ${
              isDark
                ? "bg-white/10 hover:bg-white/15 border border-white/15 text-white/75 hover:text-white"
                : "bg-black/5 hover:bg-black/10 border border-black/10 text-slate-700 hover:text-black"
            }`}
          >
            <span>O&apos;tkazib yuborish</span>
            <ArrowRight className={`h-3 w-3 group-hover:translate-x-0.5 transition-transform ${
              isDark ? "text-[#17ff91]" : "text-[#0fae66]"
            }`} />
          </motion.button>

          {/* ═════════════════════════════════════════════════════════════════
              ASOSIY LOGO KONTAYNERI
          ═════════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 flex items-center justify-center px-6">
            
            {/* 1. Logo Icon: Avval markazda chiqadi, so'ng chapga suriladi */}
            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
              }}
              transition={{
                layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5, ease: "easeOut" },
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }}
              className="relative shrink-0 flex items-center justify-center"
            >
              {/* Full uncropped icon (516x344 ratio = 1.5:1) */}
              <div className="relative w-[105px] h-[70px] sm:w-[129px] sm:h-[86px] md:w-[150px] md:h-[100px] flex items-center justify-center">
                <Image
                  src={isDark ? "/images/icon-dark.png" : "/images/icon-light.png"}
                  alt="TestingHub Logo Mark"
                  width={150}
                  height={100}
                  priority
                  className={`object-contain w-full h-full ${
                    isDark
                      ? "drop-shadow-[0_0_30px_rgba(23,255,145,0.65)]"
                      : "drop-shadow-[0_4px_20px_rgba(15,174,102,0.35)]"
                  }`}
                />

                {/* Soft specular sheen sweep */}
                <motion.div
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={isRevealed ? { x: "200%", opacity: [0, isDark ? 0.7 : 0.4, 0] } : {}}
                  transition={{ delay: 0.8, duration: 0.85, ease: "easeInOut" }}
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
                    duration: 0.75, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="overflow-hidden flex flex-col justify-center ml-4 sm:ml-5 md:ml-6 text-left shrink-0"
                >
                  {/* Company Name: Testing + Hub */}
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${
                      isDark ? "text-white drop-shadow-sm" : "text-[#1c275d] drop-shadow-xs"
                    }`}>
                      Testing
                    </span>
                    <span className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${
                      isDark
                        ? "text-[#17ff91] drop-shadow-[0_0_30px_rgba(23,255,145,0.75)]"
                        : "text-[#0fae66] drop-shadow-[0_0_25px_rgba(15,174,102,0.4)]"
                    }`}>
                      Hub
                    </span>
                  </div>

                  {/* Subtitle / Tagline */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                    className={`text-xs sm:text-sm md:text-base font-semibold tracking-[0.22em] uppercase whitespace-nowrap mt-1 sm:mt-1.5 ${
                      isDark ? "text-[#c0e1ff]/85" : "text-[#616e8a]"
                    }`}
                  >
                    Global Testing Community
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

