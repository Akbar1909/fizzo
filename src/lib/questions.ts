import "server-only";
import type { Question, Topic } from "@/generated/prisma/client";
import type {
  AnswerFeedback,
  MistakeEntry,
  PublicQuestion,
  QuestionAnswer,
  QuestionFigure,
  QuestionMistakes,
  QuestionOptions,
  QuestionSolution,
} from "@/lib/content-types";

type QuestionWithTopic = Question & { topic: Topic };

export function toPublicQuestion(question: QuestionWithTopic, sectionName?: string): PublicQuestion {
  return {
    id: question.id,
    slug: question.slug,
    type: question.type,
    difficulty: question.difficulty,
    text: question.text,
    options: question.options as unknown as QuestionOptions,
    figure: question.figure as unknown as QuestionFigure | null,
    topic: {
      id: question.topic.id,
      code: question.topic.code,
      name: question.topic.name,
      sectionName,
    },
  };
}

function pickMistake(
  mistakes: QuestionMistakes,
  response: unknown,
): MistakeEntry | null {
  if (!mistakes) return null;
  const chosenKey = typeof response === "string" ? response : null;
  const specific = mistakes.find((entry) => entry.when !== undefined && entry.when === chosenKey);
  if (specific) return specific;
  return mistakes.find((entry) => entry.when === undefined) ?? null;
}

export function buildFeedback(
  question: Question,
  response: unknown,
  isCorrect: boolean,
  partResults?: Record<string, boolean>,
): AnswerFeedback {
  return {
    isCorrect,
    correctAnswer: question.answer as unknown as QuestionAnswer,
    solution: question.solution as unknown as QuestionSolution,
    mistake: isCorrect
      ? null
      : pickMistake(question.mistakes as unknown as QuestionMistakes, response),
    figure: question.figure as unknown as QuestionFigure | null,
    partResults,
  };
}
