"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
}

export function MockTimer({ endsAt, onExpire }: { endsAt: string; onExpire: () => void }) {
  const [remainingMs, setRemainingMs] = useState(() => new Date(endsAt).getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(new Date(endsAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  useEffect(() => {
    if (remainingMs <= 0) onExpire();
  }, [remainingMs, onExpire]);

  const low = remainingMs < 5 * 60 * 1000;

  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: 18,
        fontWeight: 700,
        color: low ? "var(--bad)" : "var(--ink)",
      }}
      aria-live="polite"
    >
      {formatRemaining(remainingMs)}
    </span>
  );
}
