"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// true = faqat birinchi marta kirganda chiqadi
const PROD_MODE = true;
const STORAGE_KEY = "testinghub_intro_seen";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [phase, setPhase] = useState<"center" | "reveal" | "settled" | "exit">("center");

  const dismiss = useCallback(() => {
    setPhase("exit");
    try {
      if (PROD_MODE) {
        localStorage.setItem(STORAGE_KEY, "true");
        sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {}
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 600);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    try {
      const seen = PROD_MODE 
        ? (localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY))
        : null;
      if (!seen) {
        setIsVisible(true);
        document.body.style.overflow = "hidden";

        // Motion choreography timeline (Total ~2.8s - 3.0s)
        const t1 = setTimeout(() => setPhase("reveal"), 750);
        const t2 = setTimeout(() => setPhase("settled"), 1700);
        const t3 = setTimeout(() => dismiss(), 2900);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    } catch {}
  }, [dismiss]);

  if (!hasMounted || !isVisible) return null;

  const isRevealed = phase === "reveal" || phase === "settled" || phase === "exit";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="minimal-splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.02,
            transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white select-none overflow-hidden"
        >
          {/* Subtle minimal ambient center glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: phase === "exit" ? 0 : [0, 0.35, 0.2],
              scale: phase === "exit" ? 1.2 : [0.5, 1.1, 1] 
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#17ff91]/20 blur-[100px] pointer-events-none"
          />

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            onClick={dismiss}
            className="absolute top-5 right-5 z-30 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer group"
          >
            <span>O&apos;tkazib yuborish</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {/* ═════════════════════════════════════════════════════════════════
              CIRCULAR RIPPLE WAVES — Radiating outward from the center
          ═════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: [0.2, 2.4, 4.0],
              opacity: [0, 0.75, 0],
            }}
            transition={{
              delay: 0.5,
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 300,
              height: 300,
              border: "1.5px solid rgba(23, 255, 145, 0.75)",
              boxShadow: "0 0 40px 6px rgba(23, 255, 145, 0.5), inset 0 0 25px 2px rgba(23, 255, 145, 0.2)",
            }}
          />

          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: [0.2, 2.8, 4.6],
              opacity: [0, 0.45, 0],
            }}
            transition={{
              delay: 0.65,
              duration: 1.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 300,
              height: 300,
              border: "1px solid rgba(255, 255, 255, 0.35)",
              boxShadow: "0 0 30px 3px rgba(255, 255, 255, 0.2)",
            }}
          />

          {/* ═════════════════════════════════════════════════════════════════
              MAIN LOGO LOCKUP CONTAINER
              Starts centered -> smoothly expands as text reveals on the right
          ═════════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 flex items-center justify-center px-6">
            
            {/* 1. Logo Icon: Appears center first, then aligns next to text */}
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

            {/* 2. Company Name Text: Slides in gently next to icon as ripple expands */}
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
