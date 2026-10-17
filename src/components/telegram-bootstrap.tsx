"use client";

import { useEffect } from "react";

export function TelegramBootstrap() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    webApp?.ready();
    webApp?.expand();

    if (webApp?.initData) {
      document.documentElement.setAttribute("data-telegram-app", "true");
    }
  }, []);

  return null;
}
