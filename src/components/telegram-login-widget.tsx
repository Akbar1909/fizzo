"use client";

import { useEffect, useRef } from "react";

export function TelegramLoginWidget({
  botUsername,
  authUrl,
}: {
  botUsername: string;
  authUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !botUsername) return;

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-auth-url", authUrl);
    script.setAttribute("data-request-access", "write");
    container.appendChild(script);
  }, [botUsername, authUrl]);

  if (!botUsername) return null;

  return <div ref={containerRef} aria-label="Telegram orqali kirish" />;
}
