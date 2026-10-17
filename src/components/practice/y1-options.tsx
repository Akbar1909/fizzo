"use client";

import type { Y1Option, Y1OptionKey } from "@/lib/content-types";
import { MarkdownMath } from "@/components/markdown-math";

export function Y1Options({
  options,
  selected,
  onSelect,
  correctKey,
  disabled,
}: {
  options: Y1Option[];
  selected: Y1OptionKey | null;
  onSelect?: (key: Y1OptionKey) => void;
  correctKey: Y1OptionKey | null;
  disabled: boolean;
}) {
  return (
    <div className="stack-sm">
      {options.map((option) => {
        const isSelected = selected === option.key;
        let state: "correct" | "wrong" | undefined;
        let tag: string | null = null;
        if (correctKey) {
          if (option.key === correctKey) {
            state = "correct";
            tag = "To'g'ri";
          } else if (isSelected) {
            state = "wrong";
            tag = "Sizning javob";
          }
        }

        return (
          <button
            key={option.key}
            type="button"
            className="option-btn"
            aria-pressed={isSelected}
            data-state={state}
            disabled={disabled}
            onClick={onSelect ? () => onSelect(option.key) : undefined}
          >
            <span className="option-key">{option.key}</span>
            <MarkdownMath inline>{option.text}</MarkdownMath>
            {tag && (
              <span className={`option-tag ${state === "correct" ? "option-tag-correct" : "option-tag-wrong"}`}>
                {tag}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
