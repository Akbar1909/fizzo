"use client";

import type { Y2Options } from "@/lib/content-types";
import { MarkdownMath } from "@/components/markdown-math";

export function Y2OptionsInput({
  options,
  response,
  onChange,
  partResults,
  disabled,
}: {
  options: Y2Options;
  response: Record<string, string>;
  onChange?: (leftKey: string, rightKey: string) => void;
  partResults: Record<string, boolean> | null;
  disabled: boolean;
}) {
  return (
    <div className="stack-sm">
      {options.left.map((item) => {
        const value = response[item.key] ?? "";
        const isCorrect = partResults?.[item.key];
        return (
          <div key={item.key} className="field">
            <label htmlFor={`y2-${item.key}`}>
              <MarkdownMath inline>{item.text}</MarkdownMath>
            </label>
            <select
              id={`y2-${item.key}`}
              className="input"
              value={value}
              disabled={disabled}
              onChange={onChange ? (event) => onChange(item.key, event.target.value) : undefined}
              style={
                partResults
                  ? {
                      borderColor: isCorrect ? "var(--good)" : "var(--bad)",
                      background: isCorrect ? "var(--good-soft)" : "var(--bad-soft)",
                    }
                  : undefined
              }
            >
              <option value="" disabled>
                Tanlang
              </option>
              {options.right.map((right) => (
                <option key={right.key} value={right.key}>
                  {right.key} — {right.text}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
