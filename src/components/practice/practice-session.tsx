"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  AnswerFeedback,
  OPart,
  PublicQuestion,
  Y1Answer,
  Y1OptionKey,
  Y2Options,
} from "@/lib/content-types";
import { MarkdownMath } from "@/components/markdown-math";
import { StaticFigure } from "@/components/animations/static-figure";
import { AnimationPlayer } from "@/components/animations/animation-player";
import { FreeFallScene } from "@/components/animations/free-fall-scene";
import type { FreeFallParams } from "@/lib/content-types";
import { notifyHaptic } from "@/lib/haptics";
import { checkAnswerAction } from "@/app/(app)/mashq/[mavzu]/actions";
import { Y1Options } from "./y1-options";
import { Y2OptionsInput } from "./y2-options";
import { OPartsInput } from "./o-parts";
import { SessionSummary } from "./session-summary";
import { QuestionStatsCard } from "./question-stats-card";

type Response = Y1OptionKey | Record<string, string> | undefined;

const Y1_KEYS: Y1OptionKey[] = ["A", "B", "C", "D"];

function isAnswered(question: PublicQuestion, response: Response): boolean {
  if (question.type === "Y1") {
    return typeof response === "string" && response.length > 0;
  }
  if (question.type === "Y2") {
    const options = question.options as Y2Options;
    const given = (response ?? {}) as Record<string, string>;
    return options.left.every((item) => Boolean(given[item.key]));
  }
  const parts = question.options as OPart[];
  const given = (response ?? {}) as Record<string, string>;
  return parts.every((part) => (given[part.key] ?? "").trim().length > 0);
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function PracticeSession({
  questions,
  topicName,
  botUsername,
}: {
  questions: PublicQuestion[];
  topicName: string;
  botUsername: string;
}) {
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<Response>(undefined);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [sessionStartedAt] = useState(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  const question = questions[index];
  const answered = question ? isAnswered(question, response) : false;

  // free-fall is a self-contained, continuously interactive simulation with
  // its own play/pause/scrub controls - it renders the same way whether
  // answered or not, unlike the discrete-step captioned walkthrough the
  // other templates use via AnimationPlayer.
  function renderFigure(figure: NonNullable<PublicQuestion["figure"]>, mode: "static" | "animated") {
    if (figure.template === "free-fall") {
      return <FreeFallScene initialHeight={(figure.params as FreeFallParams).height} />;
    }
    return mode === "static" ? (
      <StaticFigure template={figure.template} params={figure.params} />
    ) : (
      <AnimationPlayer template={figure.template} params={figure.params} />
    );
  }

  function goNext() {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) setFinishedAt(Date.now());
    setFeedback(null);
    setResponse(undefined);
    setQuestionStartedAt(Date.now());
    setIndex(nextIndex);
  }

  async function handleCheck() {
    if (!question) return;
    setSubmitting(true);
    try {
      const timeMs = Date.now() - questionStartedAt;
      const result = await checkAnswerAction({ questionId: question.id, response, timeMs });
      setFeedback(result);
      if (result.isCorrect) setCorrectCount((c) => c + 1);
      notifyHaptic(result.isCorrect ? "success" : "error");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!question || isTypingTarget(event.target)) return;

      if (event.key === "Enter") {
        event.preventDefault();
        if (feedback) goNext();
        else if (answered && !submitting) void handleCheck();
        return;
      }

      if (!feedback && question.type === "Y1" && /^[1-4]$/.test(event.key)) {
        const key = Y1_KEYS[Number(event.key) - 1];
        setResponse(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, feedback, answered, submitting, response, index]);

  if (questions.length === 0) {
    return (
      <main className="page stack" style={{ paddingTop: 48, alignItems: "center", textAlign: "center" }}>
        <p style={{ color: "var(--muted)" }}>Bu mavzu uchun hozircha savollar yo&apos;q.</p>
        <Link href="/mavzular" className="btn">
          Mavzularga qaytish
        </Link>
      </main>
    );
  }

  if (index >= questions.length) {
    return (
      <SessionSummary
        correctCount={correctCount}
        total={questions.length}
        elapsedMs={(finishedAt ?? sessionStartedAt) - sessionStartedAt}
        topicName={topicName}
        onRestart={() => window.location.reload()}
      />
    );
  }

  const reportUrl = botUsername
    ? `https://t.me/${botUsername}?start=xato-${encodeURIComponent(question.slug)}`
    : undefined;

  const hasSideColumn = Boolean(question.figure) || Boolean(feedback?.stats);

  return (
    <main
      className={hasSideColumn ? "page-wide practice-grid" : "page-wide stack"}
      style={{ paddingTop: 20, paddingBottom: 32 }}
    >
      <div className="stack-sm" style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/mavzular" className="icon-btn" aria-label="Yopish">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <strong style={{ fontSize: 14 }}>{topicName}</strong>
          <span style={{ fontSize: 13, color: "var(--muted)", minWidth: 40, textAlign: "right" }}>
            {index + 1} / {questions.length}
          </span>
        </div>
        <div className="segmented-bar">
          {questions.map((q, i) => (
            <span key={q.id} data-filled={i <= index} />
          ))}
        </div>
      </div>

      <div className="stack">
        <span className="badge badge-accent">{question.type}</span>
        <div style={{ fontSize: 17, lineHeight: 1.6 }}>
          <MarkdownMath>{question.text}</MarkdownMath>
        </div>

        {!hasSideColumn && question.figure && (
          <StaticFigure template={question.figure.template} params={question.figure.params} />
        )}

        {question.type === "Y1" && (
          <Y1Options
            options={question.options as Parameters<typeof Y1Options>[0]["options"]}
            selected={typeof response === "string" ? (response as Y1OptionKey) : null}
            onSelect={(key) => !feedback && setResponse(key)}
            correctKey={feedback ? ((feedback.correctAnswer as Y1Answer) ?? null) : null}
            disabled={Boolean(feedback)}
          />
        )}

        {question.type === "Y2" && (
          <Y2OptionsInput
            options={question.options as Y2Options}
            response={(response as Record<string, string>) ?? {}}
            onChange={(leftKey, rightKey) =>
              !feedback &&
              setResponse((prev) => ({ ...((prev as Record<string, string>) ?? {}), [leftKey]: rightKey }))
            }
            partResults={feedback?.partResults ?? null}
            disabled={Boolean(feedback)}
          />
        )}

        {question.type === "O" && (
          <OPartsInput
            parts={question.options as OPart[]}
            response={(response as Record<string, string>) ?? {}}
            onChange={(key, value) =>
              !feedback &&
              setResponse((prev) => ({ ...((prev as Record<string, string>) ?? {}), [key]: value }))
            }
            partResults={feedback?.partResults ?? null}
            disabled={Boolean(feedback)}
          />
        )}
      </div>

      {feedback && (
        <div className="stack pop-in">
          {feedback.mistake && <div className="callout callout-mistake">{feedback.mistake.text}</div>}

          <div className="stack-sm">
            {feedback.solution.map((s, i) => (
              <div
                key={i}
                className="card"
                style={
                  i === feedback.solution.length - 1
                    ? { borderColor: "var(--accent)", background: "var(--good-soft)" }
                    : undefined
                }
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontWeight: 700, color: "var(--accent)" }}>{i + 1}.</span>
                  <MarkdownMath>{s.text}</MarkdownMath>
                </div>
              </div>
            ))}
          </div>

          {!hasSideColumn && feedback.stats && <QuestionStatsCard stats={feedback.stats} question={question} />}

          <button type="button" className="btn btn-primary btn-block" onClick={goNext}>
            Keyingi savol
          </button>

          {reportUrl && (
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: "var(--quiet)", textAlign: "center" }}
            >
              Savolda xato bormi? Xabar bering
            </a>
          )}
        </div>
      )}

      {!feedback && (
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={goNext}>
            O&apos;tkazish
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!answered || submitting}
            onClick={handleCheck}
          >
            Tekshirish
          </button>
        </div>
      )}

      {hasSideColumn && (
        <div className="practice-figure-col stack">
          {!feedback && question.figure && renderFigure(question.figure, "static")}
          {feedback && (
            <>
              {question.figure && renderFigure(question.figure, "animated")}
              {feedback.stats && <QuestionStatsCard stats={feedback.stats} question={question} />}
            </>
          )}
        </div>
      )}
    </main>
  );
}
