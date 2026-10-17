"use client";

import { useMemo, useState, useTransition } from "react";
import type { OPart, PublicQuestion, Y1Answer, Y2Options } from "@/lib/content-types";
import { MarkdownMath } from "@/components/markdown-math";
import { StaticFigure } from "@/components/animations/static-figure";
import { Y1Options } from "@/components/practice/y1-options";
import { Y2OptionsInput } from "@/components/practice/y2-options";
import { OPartsInput } from "@/components/practice/o-parts";
import { saveMockAnswerAction, toggleFlagAction, finishMockAction } from "@/app/(app)/mock/actions";
import { Logo } from "@/components/logo";
import { MockTimer } from "./mock-timer";
import { MockNavigator } from "./mock-navigator";

export function MockTestClient({
  sessionId,
  questions,
  initialAnswers,
  initialFlagged,
  endsAt,
  shortBank,
}: {
  sessionId: string;
  questions: PublicQuestion[];
  initialAnswers: Record<string, unknown>;
  initialFlagged: string[];
  endsAt: string;
  shortBank: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers);
  const [flagged, setFlagged] = useState<Set<string>>(() => new Set(initialFlagged));
  const [finishing, startFinishing] = useTransition();

  const question = questions[index];
  const response = answers[question.id];

  const answeredIndexes = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (answers[q.id] !== undefined) set.add(i);
    });
    return set;
  }, [answers, questions]);

  const flaggedIndexes = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (flagged.has(q.id)) set.add(i);
    });
    return set;
  }, [flagged, questions]);

  function persist(questionId: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    void saveMockAnswerAction({ sessionId, questionId, response: value });
  }

  function handleFlag() {
    const id = question.id;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    void toggleFlagAction({ sessionId, questionId: id });
  }

  function handleFinish() {
    startFinishing(() => {
      void finishMockAction({ sessionId });
    });
  }

  return (
    <div className="stack" style={{ paddingBottom: 40 }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--paper)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="page-wide"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}
        >
          <div className="stack-sm" style={{ gap: 0 }}>
            <span className="mobile-only-logo">
              <Logo height={18} />
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Fizika · Milliy sertifikat mock testi</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MockTimer endsAt={endsAt} onExpire={handleFinish} />
            <button type="button" className="btn btn-primary" onClick={handleFinish} disabled={finishing}>
              Testni yakunlash
            </button>
          </div>
        </div>
      </header>

      {shortBank && (
        <div className="page-wide">
          <div className="callout" style={{ background: "var(--bad-soft)", color: "var(--bad)" }}>
            Savollar bazasi hali to&apos;liq emas — ba&apos;zi bo&apos;limlar uchun yetarli savol topilmadi, mavjud
            savollardan to&apos;ldirildi.
          </div>
        </div>
      )}

      <div className="page-wide mock-layout">
        <div className="card stack">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <strong>{index + 1}-savol</strong>
            <span className="badge badge-accent">{question.type}</span>
            {question.topic.sectionName && <span className="badge">{question.topic.sectionName}</span>}
          </div>

          <div style={{ fontSize: 17, lineHeight: 1.6 }}>
            <MarkdownMath>{question.text}</MarkdownMath>
          </div>

          {question.figure && <StaticFigure template={question.figure.template} params={question.figure.params} />}

          <div className="answer-grid">
            {question.type === "Y1" && (
              <Y1Options
                options={question.options as Parameters<typeof Y1Options>[0]["options"]}
                selected={typeof response === "string" ? (response as Y1Answer) : null}
                onSelect={(key) => persist(question.id, key)}
                correctKey={null}
                disabled={false}
              />
            )}
            {question.type === "Y2" && (
              <Y2OptionsInput
                options={question.options as Y2Options}
                response={(response as Record<string, string>) ?? {}}
                onChange={(leftKey, rightKey) =>
                  persist(question.id, { ...((response as Record<string, string>) ?? {}), [leftKey]: rightKey })
                }
                partResults={null}
                disabled={false}
              />
            )}
            {question.type === "O" && (
              <OPartsInput
                parts={question.options as OPart[]}
                response={(response as Record<string, string>) ?? {}}
                onChange={(key, value) =>
                  persist(question.id, { ...((response as Record<string, string>) ?? {}), [key]: value })
                }
                partResults={null}
                disabled={false}
              />
            )}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "space-between", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              ← Oldingi
            </button>
            <button type="button" className="btn" onClick={handleFlag}>
              {flagged.has(question.id) ? "Belgini olib tashlash" : "Belgilab qo'yish"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={index === questions.length - 1}
            >
              Keyingi →
            </button>
          </div>
        </div>

        <MockNavigator
          total={questions.length}
          current={index}
          answeredIndexes={answeredIndexes}
          flaggedIndexes={flaggedIndexes}
          onJump={setIndex}
        />
      </div>
    </div>
  );
}
