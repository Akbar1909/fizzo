"use client";

import type { OPart } from "@/lib/content-types";

export function OPartsInput({
  parts,
  response,
  onChange,
  partResults,
  disabled,
}: {
  parts: OPart[];
  response: Record<string, string>;
  onChange?: (key: string, value: string) => void;
  partResults: Record<string, boolean> | null;
  disabled: boolean;
}) {
  return (
    <div className="stack-sm">
      {parts.map((part) => {
        const isCorrect = partResults?.[part.key];
        return (
          <div key={part.key} className="field">
            <label htmlFor={`o-${part.key}`}>
              {part.label}
              {part.unit ? ` (${part.unit})` : ""}
            </label>
            <input
              id={`o-${part.key}`}
              className="input"
              type="text"
              inputMode="decimal"
              value={response[part.key] ?? ""}
              disabled={disabled}
              onChange={onChange ? (event) => onChange(part.key, event.target.value) : undefined}
              style={
                partResults
                  ? {
                      borderColor: isCorrect ? "var(--good)" : "var(--bad)",
                      background: isCorrect ? "var(--good-soft)" : "var(--bad-soft)",
                    }
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}
