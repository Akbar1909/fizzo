"use client";

import { useEffect, useState } from "react";
import type { FigureParams, FigureTemplate } from "@/lib/content-types";
import { KatexFormula } from "@/components/katex-formula";
import { ANIMATION_REGISTRY } from "./registry";
import "./animations.css";

const STEP_DURATION_MS = 3000;
const LAST_STEP_DURATION_MS = 6000;

export function AnimationPlayer({
  template,
  params,
}: {
  template: FigureTemplate;
  params: FigureParams;
}) {
  const definition = ANIMATION_REGISTRY[template];
  const stepList = definition.steps(params);
  const totalSteps = stepList.length;

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!playing) return;
    const duration = step === totalSteps - 1 ? LAST_STEP_DURATION_MS : STEP_DURATION_MS;
    const timeout = setTimeout(() => {
      setStep((s) => (s + 1) % totalSteps);
    }, duration);
    return () => clearTimeout(timeout);
  }, [step, playing, totalSteps]);

  function goTo(next: number) {
    setPlaying(false);
    setStep(((next % totalSteps) + totalSteps) % totalSteps);
  }

  function handlePrimaryAction() {
    if (step === totalSteps - 1) {
      setStep(0);
      setPlaying(true);
    } else {
      goTo(step + 1);
    }
  }

  const Scene = definition.Scene;
  const current = stepList[step];

  return (
    <div className="stack">
      <div
        className="figure-box"
        style={{
          borderRadius: 16,
          border: "1px solid var(--line)",
          background: "var(--surface)",
          padding: 12,
        }}
      >
        <Scene params={params} step={step} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {stepList.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`${i + 1}-bosqich: ${s.title}`}
            aria-current={i === step}
            onClick={() => goTo(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              border: "none",
              padding: 0,
              background: i === step ? "var(--accent)" : "var(--line)",
            }}
          />
        ))}
      </div>

      <div className="card stack-sm">
        <span style={{ fontSize: 12, color: "var(--quiet)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          {step + 1} / {totalSteps} bosqich
        </span>
        <strong style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>{current.title}</strong>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>{current.caption}</p>
        {current.formula && (
          <div style={{ fontSize: 15 }}>
            <KatexFormula formula={current.formula} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className="btn"
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          aria-label="Oldingi bosqich"
        >
          Oldingi
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pauza" : "Davom ettirish"}
        >
          {playing ? "Pauza" : "Davom ettirish"}
        </button>
        <button type="button" className="btn btn-primary btn-block" onClick={handlePrimaryAction}>
          {step === totalSteps - 1 ? "Qaytadan ko'rish" : "Keyingi qadam"}
        </button>
      </div>
    </div>
  );
}
