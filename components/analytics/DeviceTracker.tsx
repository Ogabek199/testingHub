"use client";

import { useEffect } from "react";

const DEVICE_STORAGE_KEY = "testinghub_device_id";
const SESSION_PING_KEY = "testinghub_device_pinged";

export function DeviceTracker() {
  useEffect(() => {
    // Only execute on browser
    if (typeof window === "undefined") return;

    try {
      // Don't ping repeatedly in the same tab session
      const alreadyPinged = sessionStorage.getItem(SESSION_PING_KEY);
      if (alreadyPinged) return;

      const deviceId = localStorage.getItem(DEVICE_STORAGE_KEY) || undefined;
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
          if (data && data.success && data.deviceId) {
            localStorage.setItem(DEVICE_STORAGE_KEY, data.deviceId);
            sessionStorage.setItem(SESSION_PING_KEY, "1");
          }
        })
        .catch(() => {
          // Silent catch for ad-blockers or offline mode
        });
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, []);

  return null;
}
