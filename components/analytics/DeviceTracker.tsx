"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const DEVICE_STORAGE_KEY = "testinghub_device_id";
const LAST_PING_KEY = "testinghub_last_ping_time";
const PING_DEBOUNCE_MS = 15 * 1000; // 15 soniya (bitta sahifani qayta-qayta yangilaganda ortiqcha yuklama bo'lmasligi uchun)

export function DeviceTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Get or instantly generate persistent device ID
      let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
      if (!deviceId || !deviceId.startsWith("dev_")) {
        deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
      }

      // 2. Track on route change or if debounce passed
      const now = Date.now();
      const lastPing = parseInt(sessionStorage.getItem(LAST_PING_KEY) || "0", 10);
      const isNewPage = lastPathRef.current !== pathname;

      // If on the exact same page and pinged within debounce window, skip
      if (!isNewPage && now - lastPing < PING_DEBOUNCE_MS) {
        return;
      }

      lastPathRef.current = pathname;
      sessionStorage.setItem(LAST_PING_KEY, now.toString());

      const screenResolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
      const language = navigator.language || "uz";

      const payload = JSON.stringify({
        deviceId,
        screenResolution,
        language,
        path: pathname,
      });

      // Prefer sendBeacon if supported for reliability during fast navigation
      let beaconSent = false;
      if (navigator.sendBeacon && typeof Blob !== "undefined") {
        try {
          const blob = new Blob([payload], { type: "application/json" });
          beaconSent = navigator.sendBeacon("/api/track-device", blob);
        } catch {
          beaconSent = false;
        }
      }

      if (!beaconSent) {
        fetch("/api/track-device", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
          body: payload,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.success && data.deviceId) {
              localStorage.setItem(DEVICE_STORAGE_KEY, data.deviceId);
            }
          })
          .catch(() => {
            // Ignore fetch errors
          });
      }
    } catch {
      // Ignore storage errors in restricted private browsing
    }
  }, [pathname]);

  return null;
}
