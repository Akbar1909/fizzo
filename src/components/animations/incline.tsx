import type { InclineParams } from "@/lib/content-types";
import type { AnimationDefinition, SceneProps } from "./types";
import { ArrowDefs } from "./arrow-defs";
import { Arrow } from "./arrow";
import { fmt, GRAVITY } from "./format";

const VIEW_W = 320;
const VIEW_H = 220;
const GROUND_Y = 190;
const FOOT_X = 50;
const SLOPE_LENGTH = 180;
const BLOCK_SIZE = 26;
const BLOCK_T = 0.42;

function geometry(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const width = SLOPE_LENGTH * Math.cos(rad);
  const height = SLOPE_LENGTH * Math.sin(rad);
  const apex = { x: FOOT_X, y: GROUND_Y - height };
  const foot = { x: FOOT_X, y: GROUND_Y };
  const bottomRight = { x: FOOT_X + width, y: GROUND_Y };

  const slopeDir = { x: Math.cos(rad), y: Math.sin(rad) };
  const normalDir = { x: Math.sin(rad), y: -Math.cos(rad) };

  const onSlope = {
    x: apex.x + BLOCK_T * (bottomRight.x - apex.x),
    y: apex.y + BLOCK_T * (bottomRight.y - apex.y),
  };
  const blockCenter = {
    x: onSlope.x + normalDir.x * (BLOCK_SIZE / 2),
    y: onSlope.y + normalDir.y * (BLOCK_SIZE / 2),
  };

  return { rad, apex, foot, bottomRight, slopeDir, normalDir, blockCenter };
}

function InclineScene({ params, step }: SceneProps<InclineParams>) {
  const { angle, mass, mu } = params;
  const { rad, apex, foot, bottomRight, slopeDir, normalDir, blockCenter } = geometry(angle);
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  const unit = Math.min(90, 28 + mass * 7); // px standing for the magnitude "mg"
  const mgLen = unit;
  const mgSinLen = unit * sin;
  const mgCosLen = unit * cos;
  const frictionLen = unit * mu * cos;

  const acceleration = GRAVITY * (sin - mu * cos);
  const isMoving = acceleration > 0;

  const tip = (dir: { x: number; y: number }, len: number) => ({
    x: blockCenter.x + dir.x * len,
    y: blockCenter.y + dir.y * len,
  });

  const mgTip = tip({ x: 0, y: 1 }, mgLen);
  const mgSinTip = tip(slopeDir, mgSinLen);
  const mgCosTip = tip({ x: -normalDir.x, y: -normalDir.y }, mgCosLen);
  const normalTip = tip(normalDir, mgCosLen);
  const frictionTip = tip({ x: -slopeDir.x, y: -slopeDir.y }, frictionLen);
  const netTip = tip(slopeDir, Math.max(0, unit * (sin - mu * cos)));

  const dimOpacity = step >= 3 ? 0.2 : 1;
  const slideStyle =
    step >= 3 && isMoving
      ? ({
          "--slide-x": `${slopeDir.x * 46}px`,
          "--slide-y": `${slopeDir.y * 46}px`,
        } as React.CSSProperties)
      : undefined;

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="Qiya tekislikdagi jism">
      <ArrowDefs />

      <line x1={0} y1={GROUND_Y} x2={VIEW_W} y2={GROUND_Y} style={{ stroke: "var(--line)", strokeWidth: 2 }} />
      <path
        d={`M ${apex.x} ${apex.y} L ${foot.x} ${foot.y} L ${bottomRight.x} ${bottomRight.y} Z`}
        style={{ fill: "var(--line-soft)", stroke: "var(--line)", strokeWidth: 1.5 }}
      />

      <g className={step >= 3 ? "fx-slide" : undefined} style={slideStyle}>
        <rect
          x={blockCenter.x - BLOCK_SIZE / 2}
          y={blockCenter.y - BLOCK_SIZE / 2}
          width={BLOCK_SIZE}
          height={BLOCK_SIZE}
          rx={4}
          transform={`rotate(${angle} ${blockCenter.x} ${blockCenter.y})`}
          style={{ fill: "var(--surface)", stroke: "var(--ink)", strokeWidth: 2 }}
        />
      </g>

      {step >= 0 && (
        <g opacity={dimOpacity}>
          <Arrow x1={blockCenter.x} y1={blockCenter.y} x2={mgTip.x} y2={mgTip.y} colorKey="ink" label="mg" />
        </g>
      )}

      {step >= 1 && (
        <g opacity={dimOpacity}>
          <Arrow
            x1={blockCenter.x}
            y1={blockCenter.y}
            x2={mgSinTip.x}
            y2={mgSinTip.y}
            colorKey="accent"
            dashed
            label="mg·sinα"
          />
          <Arrow
            x1={blockCenter.x}
            y1={blockCenter.y}
            x2={mgCosTip.x}
            y2={mgCosTip.y}
            colorKey="muted"
            dashed
            label="mg·cosα"
          />
        </g>
      )}

      {step >= 2 && (
        <g opacity={dimOpacity}>
          <Arrow x1={blockCenter.x} y1={blockCenter.y} x2={normalTip.x} y2={normalTip.y} colorKey="blue" label="N" />
          {mu > 0 && (
            <Arrow
              x1={blockCenter.x}
              y1={blockCenter.y}
              x2={frictionTip.x}
              y2={frictionTip.y}
              colorKey="ink"
              label="F"
            />
          )}
        </g>
      )}

      {step >= 3 && isMoving && (
        <g className="fx-pulse">
          <Arrow
            x1={blockCenter.x}
            y1={blockCenter.y}
            x2={netTip.x}
            y2={netTip.y}
            colorKey="accent"
            animate={false}
            label="a"
          />
        </g>
      )}
    </svg>
  );
}

function steps(params: InclineParams) {
  const rad = (params.angle * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const mg = params.mass * GRAVITY;
  const acceleration = GRAVITY * (sin - params.mu * cos);

  const result =
    acceleration > 0
      ? `a = g(\\sin\\alpha - \\mu\\cos\\alpha) = ${fmt(acceleration)}\\ \\text{m/s}^2`
      : "\\text{Jism tinch turadi}";

  return [
    {
      title: "Og'irlik kuchi",
      caption: "Jismga og'irlik kuchi ta'sir qiladi.",
      formula: `mg = ${fmt(params.mass)} \\cdot ${GRAVITY} = ${fmt(mg)}\\ \\text{N}`,
    },
    {
      title: "Tashkil etuvchilarga ajratish",
      caption: "Og'irlik kuchi qiya tekislik yo'nalishi bo'yicha va unga perpendikulyar tashkil etuvchilarga ajratiladi.",
      formula: `mg\\sin\\alpha = ${fmt(mg * sin)}\\ \\text{N},\\quad mg\\cos\\alpha = ${fmt(mg * cos)}\\ \\text{N}`,
    },
    {
      title: params.mu > 0 ? "Normal reaksiya va ishqalanish" : "Normal reaksiya kuchi",
      caption:
        params.mu > 0
          ? "Tekislik normal reaksiya kuchi N bilan javob beradi, harakatga ishqalanish kuchi qarshilik qiladi."
          : "Tekislik normal reaksiya kuchi N bilan javob beradi.",
      formula:
        params.mu > 0
          ? `N = mg\\cos\\alpha = ${fmt(mg * cos)}\\ \\text{N},\\quad F_{ishq} = \\mu N = ${fmt(params.mu * mg * cos)}\\ \\text{N}`
          : `N = mg\\cos\\alpha = ${fmt(mg * cos)}\\ \\text{N}`,
    },
    {
      title: "Natijaviy kuch",
      caption:
        acceleration > 0
          ? "Qiyalik yo'nalishidagi natijaviy kuch jismni pastga tezlantiradi."
          : "Ishqalanish kuchi og'irlik kuchining tashkil etuvchisini muvozanatlaydi.",
      formula: result,
    },
  ];
}

export const inclineDefinition: AnimationDefinition<InclineParams> = {
  Scene: InclineScene,
  steps,
};
