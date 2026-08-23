"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global critical error:", error);
  }, [error]);

  return (
    <html lang="uz">
      <body className="font-sans min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-[#111827] dark:text-[#F3F4F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#141417] border border-black/[0.08] dark:border-white/[0.08] text-center shadow-2xl">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black text-foreground">
            Kritik xatolik yuz berdi
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Ilova ishlashida xatolik aniqlandi. Iltimos, tizimni qayta yuklang.
          </p>

          {error?.digest && (
            <p className="text-xs font-mono text-gray-400 mt-2">
              Kod: {error.digest}
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 rounded-xl bg-[#F95738] hover:bg-[#E0482B] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#F95738]/20 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Qayta urinish</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
