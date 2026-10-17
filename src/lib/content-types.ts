// Shapes for every Prisma `Json` field. Keep these in sync with prisma/schema.prisma.

export type Y1OptionKey = "A" | "B" | "C" | "D";

export interface Y1Option {
  key: Y1OptionKey;
  text: string;
}

export interface Y2MatchItem {
  key: string;
  text: string;
}

export interface Y2Options {
  left: Y2MatchItem[];
  right: Y2MatchItem[];
}

export interface OPart {
  key: string;
  label: string;
  unit?: string;
}

/** `Question.options`. For type O, this is the visible part labels (not the correct values). */
export type QuestionOptions = Y1Option[] | Y2Options | OPart[] | null;

/** `Question.answer` for type Y1 */
export type Y1Answer = Y1OptionKey;

/** `Question.answer` for type Y2 */
export type Y2Answer = Record<string, string>;

/** `Question.answer` for type O. Part labels/units live in `Question.options`, not here. */
export interface OAnswer {
  values: Record<string, number>;
  tolerance?: number;
}

export type QuestionAnswer = Y1Answer | Y2Answer | OAnswer;

export interface SolutionStep {
  text: string;
}

export type QuestionSolution = SolutionStep[];

export interface MistakeEntry {
  when?: string;
  text: string;
}

export type QuestionMistakes = MistakeEntry[] | null;

export type FigureTemplate = "incline" | "atwood" | "table-pulley" | "free-fall";

export interface InclineParams {
  angle: number;
  mass: number;
  mu: number;
}

export interface AtwoodParams {
  m1: number;
  m2: number;
}

export interface TablePulleyParams {
  mTable: number;
  mHanging: number;
  mu: number;
}

export interface FreeFallParams {
  height: number;
}

export type FigureParams = InclineParams | AtwoodParams | TablePulleyParams | FreeFallParams;

export interface QuestionFigure {
  template: FigureTemplate;
  params: FigureParams;
}

/** What the client receives before an attempt is recorded: never the answer. */
export interface PublicQuestion {
  id: string;
  slug: string;
  type: "Y1" | "Y2" | "O";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  options: QuestionOptions;
  figure: QuestionFigure | null;
  topic: {
    id: string;
    code: string;
    name: string;
    sectionName?: string;
  };
}

/** What the client receives after an attempt is recorded. */
export interface AnswerFeedback {
  isCorrect: boolean;
  correctAnswer: QuestionAnswer;
  solution: QuestionSolution;
  mistake: MistakeEntry | null;
  figure: QuestionFigure | null;
  partResults?: Record<string, boolean>;
  stats?: {
    accuracyPercent: number;
    mostCommonAnswer?: string;
    totalAttempts: number;
  };
}
