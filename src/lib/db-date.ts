/** Converts a Prisma `@db.Date` value (stored at UTC midnight) to "YYYY-MM-DD". */
export function dbDateToTashkentString(date: Date | null): string | null {
  return date ? date.toISOString().slice(0, 10) : null;
}

/** Converts a "YYYY-MM-DD" string back into a value Prisma can store in a `@db.Date` column. */
export function tashkentStringToDbDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}
