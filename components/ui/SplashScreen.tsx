"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "testinghub_tab_seen";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [phase, setPhase] = useState<"center" | "reveal" | "settled" | "exit">("center");
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    
    // Ushbu tabda animatsiya ko'rilganini belgilaymiz (tab yopilguncha saqlanadi)
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
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
    }, 550);
  }, []);

  useEffect(() => {
    setHasMounted(true);

    try {
      // Eski doimiy localStorage kalitini tozalash (avvalgi foydalanuvchilar bloklanib qolmasligi uchun)
      localStorage.removeItem("testinghub_intro_seen");

      // Joriy tabda allaqachon ko'rganmi? (F5 / refresh holatida qayta chiqmasligi uchun)
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (seen) {
        setIsVisible(false);
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
          document.documentElement.classList.remove("splash-active");
        }
        return;
      }

      // Tabda birinchi marta kirganda animatsiyani yoqamiz.
      // DIQQAT: sessionStorage.setItem ni bu yerda darhol chaqirmaymiz!
      // Chunki React StrictMode dev muhitida effectni 2 marta yurgizadi va
      // agar shu zahoti yozilsa, 2-qadamda animatsiya o'chib qoladi.
      setIsVisible(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }

      // Foydalanuvchi animatsiya tugamasdan sahifani yangilasa (refresh), qayta chiqmasligi uchun
      const handleBeforeUnload = () => {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch {}
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Harakat vaqt rejasi (Animatsiyadan tez va silliq o'tishi uchun)
      const t1 = setTimeout(() => setPhase("reveal"), 700);
      const t2 = setTimeout(() => setPhase("settled"), 1600);
      const t3 = setTimeout(() => dismiss(), 2600);

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
          transition={{ duration: 0.5, ease: "easeInOut" }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" } 
          }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#060810] text-white select-none overflow-hidden ${
            isExiting ? "pointer-events-none" : ""
          }`}
        >
          {/* ═════════════════════════════════════════════════════════════════
              BOSHQACHA TARQALUVCHI DASTURIY FON (EXPANDING DISPERSION WAVES)
          ═════════════════════════════════════════════════════════════════ */}
          
          {/* Chuqur vinetka foni */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, #0d162a 0%, #080c18 55%, #05070f 100%)",
            }}
          />

          {/* Markazdan kengayib tarqaluvchi nur aurası */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ 
              scale: isExiting ? 3.8 : isRevealed ? [1, 1.4, 1.25] : 0.9,
              opacity: isExiting ? 0 : [0, 0.45, 0.3]
            }}
            transition={{ duration: isExiting ? 0.6 : 1.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#17ff91]/30 via-[#00e5ff]/20 to-transparent blur-[110px] pointer-events-none"
          />

          {/* 1-Tarqaluvchi to'lqin: Zumrad neon to'lqini (Markazdan kengayuvchi) */}
          <motion.div
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{
              scale: [0.15, 2.6, 4.8],
              opacity: [0, 0.85, 0],
            }}
            transition={{
              delay: 0.4,
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320,
              height: 320,
              border: "1.5px solid rgba(23, 255, 145, 0.85)",
              boxShadow: "0 0 50px 8px rgba(23, 255, 145, 0.5), inset 0 0 30px 4px rgba(23, 255, 145, 0.25)",
            }}
          />

          {/* 2-Tarqaluvchi to'lqin: Elektr zangori to'lqin (Cyan secondary wave) */}
          <motion.div
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{
              scale: [0.15, 3.2, 5.5],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              delay: 0.6,
              duration: 1.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320,
              height: 320,
              border: "1px solid rgba(0, 229, 255, 0.7)",
              boxShadow: "0 0 40px 6px rgba(0, 229, 255, 0.35)",
            }}
          />

          {/* 3-Tarqaluvchi to'lqin: Oq-neon tashqi sonar nuri */}
          <motion.div
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{
              scale: [0.15, 3.8, 6.2],
              opacity: [0, 0.35, 0],
            }}
            transition={{
              delay: 0.8,
              duration: 2.0,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320,
              height: 320,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 0 30px 4px rgba(255, 255, 255, 0.15)",
            }}
          />

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={dismiss}
            className="absolute top-5 right-5 z-30 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white/70 hover:text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer group shadow-md"
          >
            <span>O&apos;tkazib yuborish</span>
            <ArrowRight className="h-3 w-3 text-[#17ff91] group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {/* ═════════════════════════════════════════════════════════════════
              ASOSIY LOGO KONTAYNERI (OLDINGI ANIMATSIYA DARAJASIDA SAQLANGAN)
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
                  src="/images/icon-dark.png"
                  alt="TestingHub Logo Mark"
                  width={150}
                  height={100}
                  priority
                  className="object-contain w-full h-full drop-shadow-[0_0_30px_rgba(23,255,145,0.65)]"
                />

                {/* Soft specular sheen sweep */}
                <motion.div
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={isRevealed ? { x: "200%", opacity: [0, 0.7, 0] } : {}}
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
                    <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                      Testing
                    </span>
                    <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#17ff91] drop-shadow-[0_0_30px_rgba(23,255,145,0.75)]">
                      Hub
                    </span>
                  </div>

                  {/* Subtitle / Tagline */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                    className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.22em] uppercase text-[#c0e1ff]/85 whitespace-nowrap mt-1 sm:mt-1.5"
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
