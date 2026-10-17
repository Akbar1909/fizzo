/** Formats a number Uzbek-style (comma decimal separator), rounded to 2 decimals. */
export function fmt(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toString().replace(".", ",");
}

export const GRAVITY = 10;
