import type { OAnswer, QuestionAnswer, Y2Answer } from "@/lib/content-types";

export interface CheckResult {
  isCorrect: boolean;
  partResults?: Record<string, boolean>;
}

const DEFAULT_RELATIVE_TOLERANCE = 0.02;

/** Parses "3,6", " 3.60 ", "-1,2e3" into a number. Returns null if not parseable. */
export function parseLenientNumber(raw: unknown): number | null {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function isWithinTolerance(
  actual: number,
  expected: number,
  tolerance: number,
): boolean {
  if (expected === 0) {
    return Math.abs(actual) <= tolerance;
  }
  return Math.abs(actual - expected) / Math.abs(expected) <= tolerance;
}

export function checkAnswer(
  type: "Y1" | "Y2" | "O",
  correctAnswer: QuestionAnswer,
  response: unknown,
): CheckResult {
  if (type === "Y1") {
    const expected = correctAnswer as string;
    const isCorrect = typeof response === "string" && response === expected;
    return { isCorrect };
  }

  if (type === "Y2") {
    const expected = correctAnswer as Y2Answer;
    const given = (response ?? {}) as Record<string, unknown>;
    const partResults: Record<string, boolean> = {};
    for (const key of Object.keys(expected)) {
      partResults[key] = given[key] === expected[key];
    }
    const isCorrect = Object.values(partResults).every(Boolean);
    return { isCorrect, partResults };
  }

  // type === "O"
  const expected = correctAnswer as OAnswer;
  const tolerance = expected.tolerance ?? DEFAULT_RELATIVE_TOLERANCE;
  const given = (response ?? {}) as Record<string, unknown>;
  const partResults: Record<string, boolean> = {};
  for (const key of Object.keys(expected.values)) {
    const expectedValue = expected.values[key];
    const actualValue = parseLenientNumber(given[key]);
    partResults[key] = actualValue !== null && isWithinTolerance(actualValue, expectedValue, tolerance);
  }
  const isCorrect = Object.values(partResults).every(Boolean);
  return { isCorrect, partResults };
}
