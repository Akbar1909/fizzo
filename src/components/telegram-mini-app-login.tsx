"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function TelegramMiniAppLogin({ keyin }: { keyin: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    async function authenticate() {
      setStatus("checking");
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });
        if (!res.ok) throw new Error("auth failed");
        router.replace(keyin);
        router.refresh();
      } catch {
        setStatus("error");
      }
    }

    void authenticate();
  }, [keyin, router]);

  if (status === "checking") {
    return (
      <p className="stack-sm" style={{ color: "var(--muted)", fontSize: 14 }}>
        Tekshirilmoqda...
      </p>
    );
  }

  return null;
}
