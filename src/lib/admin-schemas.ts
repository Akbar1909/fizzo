import { z } from "zod";

export const y1OptionsSchema = z
  .array(z.object({ key: z.enum(["A", "B", "C", "D"]), text: z.string().min(1) }))
  .min(2);

export const y2OptionsSchema = z.object({
  left: z.array(z.object({ key: z.string().min(1), text: z.string().min(1) })).min(1),
  right: z.array(z.object({ key: z.string().min(1), text: z.string().min(1) })).min(1),
});

export const oPartsSchema = z
  .array(z.object({ key: z.string().min(1), label: z.string().min(1), unit: z.string().optional() }))
  .min(1);

export const y2AnswerSchema = z.record(z.string(), z.string());

export const oAnswerSchema = z.object({
  values: z.record(z.string(), z.number()),
  tolerance: z.number().positive().optional(),
});

export const solutionSchema = z.array(z.object({ text: z.string().min(1) })).min(1);

export const mistakesSchema = z.array(z.object({ when: z.string().optional(), text: z.string().min(1) }));

export const inclineParamsSchema = z.object({
  angle: z.number().min(1).max(89),
  mass: z.number().positive(),
  mu: z.number().min(0),
});

export const atwoodParamsSchema = z.object({
  m1: z.number().positive(),
  m2: z.number().positive(),
});

export const tablePulleyParamsSchema = z.object({
  mTable: z.number().positive(),
  mHanging: z.number().positive(),
  mu: z.number().min(0),
});

export const figureSchema = z.discriminatedUnion("template", [
  z.object({ template: z.literal("incline"), params: inclineParamsSchema }),
  z.object({ template: z.literal("atwood"), params: atwoodParamsSchema }),
  z.object({ template: z.literal("table-pulley"), params: tablePulleyParamsSchema }),
]);

export const questionFormSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Faqat kichik lotin harflari, raqamlar va chiziqcha"),
  topicId: z.string().min(1),
  type: z.enum(["Y1", "Y2", "O"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  text: z.string().min(1),
  optionsJson: z.string(),
  answerJson: z.string().min(1),
  solutionJson: z.string().min(1),
  mistakesJson: z.string(),
  figureJson: z.string(),
  isPublished: z.boolean(),
});

export type QuestionFormInput = z.infer<typeof questionFormSchema>;

interface ParsedQuestionContent {
  options: unknown;
  answer: unknown;
  solution: unknown;
  mistakes: unknown;
  figure: unknown;
}

function parseJsonField(raw: string, fieldLabel: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`${fieldLabel}: JSON formatida xatolik`);
  }
}

/** Parses and validates the per-type JSON fields of the admin form. Throws a readable Error on failure. */
export function parseQuestionContent(input: QuestionFormInput): ParsedQuestionContent {
  const optionsRaw = parseJsonField(input.optionsJson, "Variantlar");
  const answerRaw = parseJsonField(input.answerJson, "Javob");
  const solutionRaw = parseJsonField(input.solutionJson, "Yechim");
  const mistakesRaw = parseJsonField(input.mistakesJson, "Xatolar");
  const figureRaw = parseJsonField(input.figureJson, "Animatsiya");

  let options: unknown;
  let answer: unknown;

  if (input.type === "Y1") {
    options = y1OptionsSchema.parse(optionsRaw);
    answer = z.enum(["A", "B", "C", "D"]).parse(answerRaw);
  } else if (input.type === "Y2") {
    options = y2OptionsSchema.parse(optionsRaw);
    answer = y2AnswerSchema.parse(answerRaw);
  } else {
    options = oPartsSchema.parse(optionsRaw);
    answer = oAnswerSchema.parse(answerRaw);
  }

  const solution = solutionSchema.parse(solutionRaw);
  const mistakes = mistakesRaw === undefined ? undefined : mistakesSchema.parse(mistakesRaw);
  const figure = figureRaw === undefined ? undefined : figureSchema.parse(figureRaw);

  return { options, answer, solution, mistakes, figure };
}
