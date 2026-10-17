"use client";

export function notifyHaptic(type: "success" | "error" | "warning") {
  if (typeof window === "undefined") return;
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
}
