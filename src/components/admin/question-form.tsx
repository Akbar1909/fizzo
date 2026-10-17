"use client";

import { useActionState, useMemo, useState } from "react";
import { saveQuestionAction, type SaveQuestionState } from "@/app/admin/savollar/actions";
import { MarkdownMath } from "@/components/markdown-math";
import { StaticFigure } from "@/components/animations/static-figure";
import { AnimationPlayer } from "@/components/animations/animation-player";
import { Y1Options } from "@/components/practice/y1-options";
import { Y2OptionsInput } from "@/components/practice/y2-options";
import { OPartsInput } from "@/components/practice/o-parts";
import { checkAnswer } from "@/lib/check-answer";
import type {
  FigureParams,
  FigureTemplate,
  OPart,
  QuestionAnswer,
  QuestionOptions,
  QuestionSolution,
  Y1Answer,
  Y2Options,
} from "@/lib/content-types";

const TEMPLATES_BY_TYPE: Record<string, { options: string; answer: string }> = {
  Y1: {
    options: `[
  { "key": "A", "text": "..." },
  { "key": "B", "text": "..." },
  { "key": "C", "text": "..." },
  { "key": "D", "text": "..." }
]`,
    answer: `"A"`,
  },
  Y2: {
    options: `{
  "left": [{ "key": "1", "text": "..." }],
  "right": [{ "key": "A", "text": "..." }]
}`,
    answer: `{ "1": "A" }`,
  },
  O: {
    options: `[{ "key": "a", "label": "...", "unit": "N" }]`,
    answer: `{ "values": { "a": 10 }, "tolerance": 0.02 }`,
  },
};

interface QuestionFormValues {
  id?: string;
  slug: string;
  topicId: string;
  type: "Y1" | "Y2" | "O";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  optionsJson: string;
  answerJson: string;
  solutionJson: string;
  mistakesJson: string;
  figureJson: string;
  isPublished: boolean;
}

function tryParse(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return { __parseError: true };
  }
}

export function QuestionForm({
  topics,
  initialQuestion,
}: {
  topics: { id: string; code: string; name: string; sectionName: string }[];
  initialQuestion?: QuestionFormValues;
}) {
  const [values, setValues] = useState<QuestionFormValues>(
    initialQuestion ?? {
      slug: "",
      topicId: topics[0]?.id ?? "",
      type: "Y1",
      difficulty: "MEDIUM",
      text: "",
      optionsJson: TEMPLATES_BY_TYPE.Y1.options,
      answerJson: TEMPLATES_BY_TYPE.Y1.answer,
      solutionJson: `[{ "text": "..." }]`,
      mistakesJson: "",
      figureJson: "",
      isPublished: true,
    },
  );

  const [state, formAction] = useActionState<SaveQuestionState, FormData>(saveQuestionAction, { error: null });

  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  function update<K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTypeChange(type: QuestionFormValues["type"]) {
    setValues((prev) => ({
      ...prev,
      type,
      optionsJson: TEMPLATES_BY_TYPE[type].options,
      answerJson: TEMPLATES_BY_TYPE[type].answer,
    }));
  }

  const preview = useMemo(() => {
    const options = tryParse(values.optionsJson);
    const answer = tryParse(values.answerJson);
    const solution = tryParse(values.solutionJson);
    const mistakes = tryParse(values.mistakesJson);
    const figure = tryParse(values.figureJson);

    const hasParseError = [options, answer, solution, mistakes, figure].some(
      (v) => v && typeof v === "object" && "__parseError" in v,
    );

    if (hasParseError) return { error: "JSON maydonlarida xatolik bor" as const };

    let result: { isCorrect: boolean; partResults?: Record<string, boolean> } = { isCorrect: false };
    try {
      if (answer !== undefined) {
        result = checkAnswer(values.type, answer as QuestionAnswer, undefined);
      }
    } catch {
      // ignore — preview still renders without a computed result
    }

    return {
      options: options as QuestionOptions,
      answer: answer as QuestionAnswer | undefined,
      solution: (solution as QuestionSolution | undefined) ?? [],
      mistakes: mistakes as { when?: string; text: string }[] | undefined,
      figure: figure as { template: FigureTemplate; params: FigureParams } | undefined,
      partResults: result.partResults,
    };
  }, [values.optionsJson, values.answerJson, values.solutionJson, values.mistakesJson, values.figureJson, values.type]);

  return (
    <div className="admin-grid">
      <form action={formAction} className="stack card">
        {initialQuestion?.id && <input type="hidden" name="id" value={initialQuestion.id} />}

        <div className="field">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            className="input"
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="topicId">Mavzu</label>
          <select
            id="topicId"
            name="topicId"
            className="input"
            value={values.topicId}
            onChange={(e) => update("topicId", e.target.value)}
            required
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.sectionName} — {t.code} {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="type">Turi</label>
            <select
              id="type"
              name="type"
              className="input"
              value={values.type}
              onChange={(e) => handleTypeChange(e.target.value as QuestionFormValues["type"])}
            >
              <option value="Y1">Y1 — bitta tanlov</option>
              <option value="Y2">Y2 — moslashtirish</option>
              <option value="O">O — ochiq</option>
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="difficulty">Qiyinlik</label>
            <select
              id="difficulty"
              name="difficulty"
              className="input"
              value={values.difficulty}
              onChange={(e) => update("difficulty", e.target.value as QuestionFormValues["difficulty"])}
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="text">Savol matni (Markdown + $LaTeX$)</label>
          <textarea
            id="text"
            name="text"
            className="input"
            style={{ minHeight: 90 }}
            value={values.text}
            onChange={(e) => update("text", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="optionsJson">Variantlar (JSON)</label>
          <textarea
            id="optionsJson"
            name="optionsJson"
            className="input"
            value={values.optionsJson}
            onChange={(e) => update("optionsJson", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="answerJson">Javob (JSON)</label>
          <textarea
            id="answerJson"
            name="answerJson"
            className="input"
            value={values.answerJson}
            onChange={(e) => update("answerJson", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="solutionJson">Yechim bosqichlari (JSON)</label>
          <textarea
            id="solutionJson"
            name="solutionJson"
            className="input"
            value={values.solutionJson}
            onChange={(e) => update("solutionJson", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="mistakesJson">Xato tahlili (JSON, ixtiyoriy)</label>
          <textarea
            id="mistakesJson"
            name="mistakesJson"
            className="input"
            placeholder={`[{ "when": "B", "text": "..." }]`}
            value={values.mistakesJson}
            onChange={(e) => update("mistakesJson", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="figureJson">Animatsiya (JSON, ixtiyoriy)</label>
          <textarea
            id="figureJson"
            name="figureJson"
            className="input"
            placeholder={`{ "template": "incline", "params": { "angle": 30, "mass": 2, "mu": 0.2 } }`}
            value={values.figureJson}
            onChange={(e) => update("figureJson", e.target.value)}
          />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            name="isPublished"
            checked={values.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
          />
          Nashr qilingan
        </label>

        {state.error && (
          <p role="alert" style={{ color: "var(--bad)", fontSize: 14 }}>
            {state.error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block">
          Saqlash
        </button>
      </form>

      <aside className="stack card" style={{ position: "sticky", top: 24 }}>
        <strong style={{ fontSize: 14, color: "var(--muted)" }}>Ko&apos;rinish (talaba uchun)</strong>

        {preview.error ? (
          <p style={{ color: "var(--bad)", fontSize: 14 }}>{preview.error}</p>
        ) : (
          <div className="stack">
            <span className="badge badge-accent">{values.type}</span>
            <div style={{ fontSize: 16 }}>
              <MarkdownMath>{values.text || "_Savol matni yo'q_"}</MarkdownMath>
            </div>

            {preview.figure && (
              <StaticFigure template={preview.figure.template} params={preview.figure.params} />
            )}

            {values.type === "Y1" && Array.isArray(preview.options) && (
              <Y1Options
                options={preview.options as Parameters<typeof Y1Options>[0]["options"]}
                selected={null}
                correctKey={showAnswer ? (preview.answer as Y1Answer) : null}
                disabled
              />
            )}
            {values.type === "Y2" && preview.options && !Array.isArray(preview.options) && (
              <Y2OptionsInput
                options={preview.options as Y2Options}
                response={{}}
                partResults={showAnswer ? (preview.partResults ?? null) : null}
                disabled
              />
            )}
            {values.type === "O" && Array.isArray(preview.options) && (
              <OPartsInput
                parts={preview.options as OPart[]}
                response={{}}
                partResults={showAnswer ? (preview.partResults ?? null) : null}
                disabled
              />
            )}

            <button type="button" className="btn" onClick={() => setShowAnswer((v) => !v)}>
              {showAnswer ? "Javobni yashirish" : "Javobni ko'rsatish"}
            </button>

            {showAnswer && (
              <div className="stack-sm">
                {preview.solution.map((step, i) => (
                  <div key={i} style={{ fontSize: 14 }}>
                    {i + 1}. <MarkdownMath inline>{step.text}</MarkdownMath>
                  </div>
                ))}
                {preview.mistakes?.map((m, i) => (
                  <div key={i} className="callout callout-mistake" style={{ fontSize: 13 }}>
                    {m.when ? `[${m.when}] ` : ""}
                    {m.text}
                  </div>
                ))}
                {preview.figure && (
                  <button type="button" className="btn" onClick={() => setShowAnimation(true)}>
                    Animatsiyani ko&apos;rish
                  </button>
                )}
              </div>
            )}

            {showAnimation && preview.figure && (
              <AnimationPlayer template={preview.figure.template} params={preview.figure.params} />
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
