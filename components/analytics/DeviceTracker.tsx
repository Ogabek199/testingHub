"use client";

import { useEffect, useRef } from "react";

const DEVICE_STORAGE_KEY = "testinghub_device_id";
const LAST_PING_KEY = "testinghub_last_ping_time";
const PING_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutlik sessiya oralig'i

export function DeviceTracker() {
  const pingedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || pingedRef.current) return;
    pingedRef.current = true;

    try {
      // 1. Get or instantly generate persistent device ID to eliminate race conditions
      let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
      if (!deviceId || !deviceId.startsWith("dev_")) {
        deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
      }

      // 2. Prevent spamming visits within cooldown window in the same browser
      const now = Date.now();
      const lastPing = parseInt(sessionStorage.getItem(LAST_PING_KEY) || "0", 10);
      if (now - lastPing < PING_COOLDOWN_MS) {
        return;
      }

      const screenResolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
      const language = navigator.language || "uz";

      fetch("/api/track-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          screenResolution,
          language,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            sessionStorage.setItem(LAST_PING_KEY, now.toString());
            if (data.deviceId && data.deviceId !== deviceId) {
              localStorage.setItem(DEVICE_STORAGE_KEY, data.deviceId);
            }
          }
        })
        .catch(() => {
          // Silent catch for offline or blocked requests
        });
    } catch {
      // Ignore storage errors in private browsing restrictions
    }
  }, []);

  return null;
}
