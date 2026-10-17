import type { AtwoodParams } from "@/lib/content-types";
import type { AnimationDefinition, SceneProps } from "./types";
import { ArrowDefs } from "./arrow-defs";
import { Arrow } from "./arrow";
import { fmt, GRAVITY } from "./format";

const VIEW_W = 320;
const VIEW_H = 220;
const PULLEY = { x: 160, y: 40, r: 16 };
const LEFT_X = 110;
const RIGHT_X = 210;
const STRING_TOP_Y = PULLEY.y + 90;
const SCALE = 2.2;
const MAX_LEN = 70;
const SLIDE_PX = 26;

function blockSize(mass: number) {
  return Math.min(56, 22 + mass * 6);
}

function arrowLen(forceN: number) {
  return Math.min(MAX_LEN, forceN * SCALE);
}

function AtwoodScene({ params, step }: SceneProps<AtwoodParams>) {
  const { m1, m2 } = params;
  const size1 = blockSize(m1);
  const size2 = blockSize(m2);

  const block1 = { x: LEFT_X, y: STRING_TOP_Y + size1 / 2 };
  const block2 = { x: RIGHT_X, y: STRING_TOP_Y + size2 / 2 };

  const tension = (2 * m1 * m2 * GRAVITY) / (m1 + m2);
  const acceleration = (Math.abs(m1 - m2) * GRAVITY) / (m1 + m2);
  const m1Heavier = m1 > m2;
  const isMoving = acceleration > 0;

  const dim = step >= 3 ? 0.2 : 1;

  const slideStyle = (goingDown: boolean) =>
    step >= 3 && isMoving
      ? ({ "--slide-x": "0px", "--slide-y": `${goingDown ? SLIDE_PX : -SLIDE_PX}px` } as React.CSSProperties)
      : undefined;

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="Blok orqali o'tkazilgan ikki yuk">
      <ArrowDefs />

      <line x1={PULLEY.x - 36} y1={10} x2={PULLEY.x + 36} y2={10} style={{ stroke: "var(--ink)", strokeWidth: 3 }} />
      <line x1={PULLEY.x} y1={10} x2={PULLEY.x} y2={PULLEY.y - PULLEY.r} style={{ stroke: "var(--ink)", strokeWidth: 2 }} />
      <circle cx={PULLEY.x} cy={PULLEY.y} r={PULLEY.r} style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2.5 }} />

      <line x1={LEFT_X} y1={PULLEY.y} x2={LEFT_X} y2={block1.y - size1 / 2} style={{ stroke: "var(--muted)", strokeWidth: 1.5 }} />
      <line x1={RIGHT_X} y1={PULLEY.y} x2={RIGHT_X} y2={block2.y - size2 / 2} style={{ stroke: "var(--muted)", strokeWidth: 1.5 }} />

      <g className={step >= 3 ? "fx-slide" : undefined} style={slideStyle(m1Heavier)}>
        <rect
          x={block1.x - size1 / 2}
          y={block1.y - size1 / 2}
          width={size1}
          height={size1}
          rx={4}
          style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2 }}
        />
        <text x={block1.x} y={block1.y + 4} textAnchor="middle" fontSize={12} style={{ fontFamily: "var(--font-math)" }}>
          m₁
        </text>
      </g>

      <g className={step >= 3 ? "fx-slide" : undefined} style={slideStyle(!m1Heavier)}>
        <rect
          x={block2.x - size2 / 2}
          y={block2.y - size2 / 2}
          width={size2}
          height={size2}
          rx={4}
          style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2 }}
        />
        <text x={block2.x} y={block2.y + 4} textAnchor="middle" fontSize={12} style={{ fontFamily: "var(--font-math)" }}>
          m₂
        </text>
      </g>

      {step >= 0 && (
        <g opacity={dim}>
          <Arrow x1={block1.x} y1={block1.y} x2={block1.x} y2={block1.y + arrowLen(m1 * GRAVITY)} colorKey="ink" label="m₁g" />
          <Arrow x1={block2.x} y1={block2.y} x2={block2.x} y2={block2.y + arrowLen(m2 * GRAVITY)} colorKey="ink" label="m₂g" />
        </g>
      )}

      {step >= 1 && (
        <g opacity={dim}>
          <Arrow x1={block1.x} y1={block1.y} x2={block1.x} y2={block1.y - arrowLen(tension)} colorKey="blue" label="T" />
          <Arrow x1={block2.x} y1={block2.y} x2={block2.x} y2={block2.y - arrowLen(tension)} colorKey="blue" label="T" />
        </g>
      )}

      {step >= 2 && isMoving && (
        <g opacity={dim}>
          <Arrow
            x1={block1.x}
            y1={block1.y}
            x2={block1.x}
            y2={block1.y + (m1Heavier ? 1 : -1) * arrowLen(Math.abs(m1 * GRAVITY - tension))}
            colorKey="accent"
            label="F"
          />
          <Arrow
            x1={block2.x}
            y1={block2.y}
            x2={block2.x}
            y2={block2.y + (!m1Heavier ? 1 : -1) * arrowLen(Math.abs(m2 * GRAVITY - tension))}
            colorKey="accent"
            label="F"
          />
        </g>
      )}

      {step >= 3 && isMoving && (
        <g className="fx-pulse">
          <Arrow
            x1={block1.x - 24}
            y1={block1.y}
            x2={block1.x - 24}
            y2={block1.y + (m1Heavier ? 1 : -1) * 20}
            colorKey="accent"
            animate={false}
          />
        </g>
      )}
    </svg>
  );
}

function steps(params: AtwoodParams) {
  const { m1, m2 } = params;
  const tension = (2 * m1 * m2 * GRAVITY) / (m1 + m2);
  const acceleration = (Math.abs(m1 - m2) * GRAVITY) / (m1 + m2);
  const heavier = m1 === m2 ? null : m1 > m2 ? "m₁" : "m₂";

  return [
    {
      title: "Og'irlik kuchlari",
      caption: "Har ikkala yukka og'irlik kuchi pastga yo'nalgan holda ta'sir qiladi.",
      formula: `m_1g = ${fmt(m1 * GRAVITY)}\\ \\text{N},\\quad m_2g = ${fmt(m2 * GRAVITY)}\\ \\text{N}`,
    },
    {
      title: "Ip tarangligi",
      caption: "Ip cho'zilmaydi va blok ishqalanishsiz, shuning uchun tarang kuch T ipning har ikki uchida bir xil.",
      formula: `T = \\dfrac{2m_1m_2g}{m_1+m_2} = ${fmt(tension)}\\ \\text{N}`,
    },
    {
      title: "Natijaviy kuchlar",
      caption:
        heavier === null
          ? "Ikkala tomondagi kuchlar teng — tizim muvozanatda."
          : `Og'irroq yuk (${heavier}) tomonida natijaviy kuch pastga, ikkinchi tomonda yuqoriga yo'nalgan.`,
      formula: `a = \\dfrac{|m_1-m_2|g}{m_1+m_2} = ${fmt(acceleration)}\\ \\text{m/s}^2`,
    },
    {
      title: "Harakat",
      caption:
        heavier === null
          ? "Tizim tinch holatda qoladi."
          : `${heavier} pastga, ikkinchi yuk esa yuqoriga siljiydi.`,
      formula: `a = ${fmt(acceleration)}\\ \\text{m/s}^2`,
    },
  ];
}

export const atwoodDefinition: AnimationDefinition<AtwoodParams> = {
  Scene: AtwoodScene,
  steps,
};
