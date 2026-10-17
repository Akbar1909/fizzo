import type { TablePulleyParams } from "@/lib/content-types";
import type { AnimationDefinition, SceneProps } from "./types";
import { ArrowDefs } from "./arrow-defs";
import { Arrow } from "./arrow";
import { fmt, GRAVITY } from "./format";

const VIEW_W = 320;
const VIEW_H = 220;
const TABLE_Y = 120;
const TABLE_LEFT = 20;
const PULLEY = { x: 240, y: 104, r: 11 };
const STRING_VERTICAL_LEN = 56;
const SCALE = 2.2;
const MAX_LEN = 70;

function blockSize(mass: number) {
  return Math.min(50, 20 + mass * 5);
}

function arrowLen(forceN: number) {
  return Math.min(MAX_LEN, forceN * SCALE);
}

function TablePulleyScene({ params, step }: SceneProps<TablePulleyParams>) {
  const { mTable, mHanging, mu } = params;
  const tableBlockSize = blockSize(mTable);
  const hangingBlockSize = blockSize(mHanging);

  const tableBlock = { x: 95, y: TABLE_Y - tableBlockSize / 2 };
  const hangingBlock = {
    x: PULLEY.x,
    y: PULLEY.y + STRING_VERTICAL_LEN + hangingBlockSize / 2,
  };

  const normal = mTable * GRAVITY;
  const friction = mu * normal;
  const acceleration = (GRAVITY * (mHanging - mu * mTable)) / (mTable + mHanging);
  const tension = mHanging * (GRAVITY - acceleration);
  const isMoving = acceleration > 0;

  const dim = step >= 3 ? 0.2 : 1;

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="Stol ustidagi jism va blok orqali osilgan yuk">
      <ArrowDefs />

      <line x1={0} y1={185} x2={VIEW_W} y2={185} style={{ stroke: "var(--line)", strokeWidth: 2 }} />
      <rect x={40} y={TABLE_Y} width={16} height={65} style={{ fill: "var(--line-soft)", stroke: "var(--line)" }} />
      <rect
        x={TABLE_LEFT}
        y={TABLE_Y - 8}
        width={PULLEY.x - TABLE_LEFT}
        height={8}
        style={{ fill: "var(--line-soft)", stroke: "var(--line)", strokeWidth: 1.5 }}
      />

      <line x1={PULLEY.x} y1={TABLE_Y - 8} x2={PULLEY.x} y2={PULLEY.y} style={{ stroke: "var(--ink)", strokeWidth: 2 }} />
      <circle cx={PULLEY.x} cy={PULLEY.y} r={PULLEY.r} style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2.5 }} />

      <line
        x1={tableBlock.x + tableBlockSize / 2}
        y1={tableBlock.y}
        x2={PULLEY.x - PULLEY.r}
        y2={PULLEY.y}
        style={{ stroke: "var(--muted)", strokeWidth: 1.5 }}
      />
      <line
        x1={PULLEY.x}
        y1={PULLEY.y + PULLEY.r}
        x2={hangingBlock.x}
        y2={hangingBlock.y - hangingBlockSize / 2}
        style={{ stroke: "var(--muted)", strokeWidth: 1.5 }}
      />

      <g
        className={step >= 3 ? "fx-slide" : undefined}
        style={step >= 3 && isMoving ? ({ "--slide-x": "30px", "--slide-y": "0px" } as React.CSSProperties) : undefined}
      >
        <rect
          x={tableBlock.x - tableBlockSize / 2}
          y={tableBlock.y - tableBlockSize / 2}
          width={tableBlockSize}
          height={tableBlockSize}
          rx={4}
          style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2 }}
        />
      </g>

      <g
        className={step >= 3 ? "fx-slide" : undefined}
        style={step >= 3 && isMoving ? ({ "--slide-x": "0px", "--slide-y": "30px" } as React.CSSProperties) : undefined}
      >
        <rect
          x={hangingBlock.x - hangingBlockSize / 2}
          y={hangingBlock.y - hangingBlockSize / 2}
          width={hangingBlockSize}
          height={hangingBlockSize}
          rx={4}
          style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2 }}
        />
      </g>

      {step >= 0 && (
        <g opacity={dim}>
          <Arrow x1={tableBlock.x} y1={tableBlock.y} x2={tableBlock.x} y2={tableBlock.y + arrowLen(normal)} colorKey="ink" label="mg" />
          <Arrow x1={tableBlock.x} y1={tableBlock.y} x2={tableBlock.x} y2={tableBlock.y - arrowLen(normal)} colorKey="blue" label="N" />
          <Arrow
            x1={hangingBlock.x}
            y1={hangingBlock.y}
            x2={hangingBlock.x}
            y2={hangingBlock.y + arrowLen(mHanging * GRAVITY)}
            colorKey="ink"
            label="Mg"
          />
        </g>
      )}

      {step >= 1 && (
        <g opacity={dim}>
          <Arrow
            x1={tableBlock.x}
            y1={tableBlock.y}
            x2={tableBlock.x + arrowLen(tension)}
            y2={tableBlock.y}
            colorKey="accent"
            label="T"
          />
          <Arrow
            x1={hangingBlock.x}
            y1={hangingBlock.y}
            x2={hangingBlock.x}
            y2={hangingBlock.y - arrowLen(tension)}
            colorKey="accent"
            label="T"
          />
        </g>
      )}

      {step >= 2 && mu > 0 && (
        <g opacity={dim}>
          <Arrow
            x1={tableBlock.x}
            y1={tableBlock.y}
            x2={tableBlock.x - arrowLen(friction)}
            y2={tableBlock.y}
            colorKey="muted"
            label="F"
          />
        </g>
      )}

      {step >= 3 && isMoving && (
        <g className="fx-pulse">
          <Arrow
            x1={hangingBlock.x + 20}
            y1={hangingBlock.y}
            x2={hangingBlock.x + 20}
            y2={hangingBlock.y + 20}
            colorKey="accent"
            animate={false}
          />
        </g>
      )}
    </svg>
  );
}

function steps(params: TablePulleyParams) {
  const { mTable, mHanging, mu } = params;
  const normal = mTable * GRAVITY;
  const friction = mu * normal;
  const acceleration = (GRAVITY * (mHanging - mu * mTable)) / (mTable + mHanging);
  const tension = mHanging * (GRAVITY - acceleration);

  return [
    {
      title: "Og'irlik va normal reaksiya",
      caption: "Stol ustidagi jismga og'irlik kuchi va normal reaksiya kuchi, osilgan yukka esa og'irlik kuchi ta'sir qiladi.",
      formula: `N = m_1g = ${fmt(normal)}\\ \\text{N},\\quad Mg = ${fmt(mHanging * GRAVITY)}\\ \\text{N}`,
    },
    {
      title: "Ip tarangligi",
      caption: "Ip va blok ideal bo'lgani uchun tarang kuch T ipning ikkala uchida bir xil.",
      formula: `T = ${fmt(tension)}\\ \\text{N}`,
    },
    {
      title: mu > 0 ? "Ishqalanish kuchi" : "Natijaviy kuch",
      caption:
        mu > 0
          ? "Stol yuzasidagi ishqalanish kuchi harakatga qarshi yo'nalgan."
          : "Tizimning tezlanishi ikkala jism uchun umumiy harakat tenglamalaridan topiladi.",
      formula:
        mu > 0
          ? `F_{ishq} = \\mu m_1 g = ${fmt(friction)}\\ \\text{N}`
          : `a = \\dfrac{Mg}{m_1+M} = ${fmt(acceleration)}\\ \\text{m/s}^2`,
    },
    {
      title: "Harakat",
      caption:
        acceleration > 0
          ? "Osilgan yuk pastga tushadi, stoldagi jism esa blok tomon siljiydi."
          : "Ishqalanish kuchi tizimni muvozanatlaydi — harakat yo'q.",
      formula:
        acceleration > 0
          ? `a = \\dfrac{g(M-\\mu m_1)}{m_1+M} = ${fmt(acceleration)}\\ \\text{m/s}^2`
          : "\\text{Jism tinch turadi}",
    },
  ];
}

export const tablePulleyDefinition: AnimationDefinition<TablePulleyParams> = {
  Scene: TablePulleyScene,
  steps,
};
