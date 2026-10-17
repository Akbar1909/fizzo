"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDefs } from "./arrow-defs";
import { sceneTheme } from "./scene-theme";
import { fmt, GRAVITY } from "./format";
import { KatexFormula } from "@/components/katex-formula";

const VIEW_W = 360;
const VIEW_H = 320;
const GROUND_Y = 280;
const RULER_X = 56;
const BALL_X = 220;
const PX_PER_METER = 6;
const MIN_H = 5;
const MAX_H = 40;
const DEFAULT_H = 20;
const BALL_RADIUS = 9;
const V_SCALE = 2.5; // px per (m/s), fixed so the arrow never rescales with h0
const ACCEL_ARROW_LEN = 48;
const ACCEL_OFFSET_X = 28;
// The fall itself only lasts 1-3 real seconds, too fast to read the changing
// numbers - play it in slow motion. The physics is still real (x(t)/v(t)
// integrated each frame), just time-dilated, the same way a slow-motion
// camera doesn't change what actually happened.
const TIME_SCALE = 0.3;
// How often the numeric readout refreshes during playback. Much slower than
// the 60fps visual loop on purpose - a number changing every frame reads as
// a blur, not a value you can follow.
const TEXT_UPDATE_INTERVAL_MS = 180;

function heightToY(height: number): number {
  return GROUND_Y - height * PX_PER_METER;
}

/** Arrow tip Y, clamped so vectors never visually cross the ground line. */
function clampedArrowEnd(startY: number, length: number): number {
  return startY + Math.min(length, Math.max(0, GROUND_Y - startY));
}

function clientToHeight(svg: SVGSVGElement, clientY: number): number {
  const point = svg.createSVGPoint();
  point.y = clientY;
  const ctm = svg.getScreenCTM();
  const svgY = ctm ? point.matrixTransform(ctm.inverse()).y : clientY;
  const height = (GROUND_Y - svgY) / PX_PER_METER;
  return Math.min(MAX_H, Math.max(MIN_H, height));
}

export function FreeFallScene() {
  const svgRef = useRef<SVGSVGElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);
  const guideLineRef = useRef<SVGLineElement>(null);
  const velocityGroupRef = useRef<SVGGElement>(null);
  const velocityLineRef = useRef<SVGLineElement>(null);
  const velocityLabelRef = useRef<SVGTextElement>(null);
  const accelGroupRef = useRef<SVGGElement>(null);
  const accelLineRef = useRef<SVGLineElement>(null);
  const accelLabelRef = useRef<SVGTextElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const timeTextRef = useRef<HTMLSpanElement>(null);
  const velocityTextRef = useRef<HTMLSpanElement>(null);
  const heightTextRef = useRef<HTMLSpanElement>(null);

  const [h0, setH0] = useState(DEFAULT_H);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [landed, setLanded] = useState(false);
  const [canSetInitialHeight, setCanSetInitialHeight] = useState(true);

  const elapsedRef = useRef(0);
  const dragHeightRef = useRef(DEFAULT_H);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const lastTextUpdateRef = useRef(0);

  const fallTime = Math.sqrt((2 * h0) / GRAVITY);

  const applyState = useCallback(
    // The ball/arrows update every frame for smooth 60fps motion, but the
    // numeric readout is throttled: refreshing text 60x/second makes the
    // last digit an unreadable blur even though the fall itself is slow.
    // User-triggered changes (scrub, reset, play) force an immediate update.
    (t: number, forceTextUpdate = false) => {
      const clampedT = Math.min(t, fallTime);
      const v = GRAVITY * clampedT;
      const height = Math.max(0, h0 - 0.5 * GRAVITY * clampedT * clampedT);
      const ballY = heightToY(height);
      const vectorStartY = ballY + BALL_RADIUS;
      const vEndY = clampedArrowEnd(vectorStartY, v * V_SCALE);
      const aEndY = clampedArrowEnd(vectorStartY, ACCEL_ARROW_LEN);
      // Once it lands there's no more motion to show a vector for, and there's
      // no room left to draw one before the ground anyway - hide rather than
      // render a degenerate zero-length arrow. Same for velocity at v≈0: a
      // zero-length line still paints its arrowhead marker, so hide it
      // outright instead of showing a stray triangle before the drop starts.
      const hasLanded = clampedT >= fallTime;

      ballRef.current?.setAttribute("cy", String(ballY));
      guideLineRef.current?.setAttribute("y1", String(ballY));
      guideLineRef.current?.setAttribute("y2", String(ballY));

      velocityGroupRef.current?.setAttribute("opacity", hasLanded || v < 0.05 ? "0" : "1");
      velocityLineRef.current?.setAttribute("y1", String(vectorStartY));
      velocityLineRef.current?.setAttribute("y2", String(vEndY));
      velocityLabelRef.current?.setAttribute("y", String(vEndY + 14));

      accelGroupRef.current?.setAttribute("opacity", hasLanded ? "0" : "1");
      accelLineRef.current?.setAttribute("y1", String(vectorStartY));
      accelLineRef.current?.setAttribute("y2", String(aEndY));
      accelLabelRef.current?.setAttribute("y", String((vectorStartY + aEndY) / 2));

      const now = performance.now();
      if (forceTextUpdate || now - lastTextUpdateRef.current >= TEXT_UPDATE_INTERVAL_MS) {
        lastTextUpdateRef.current = now;
        if (timeTextRef.current) timeTextRef.current.textContent = `${fmt(clampedT)} s`;
        if (velocityTextRef.current) velocityTextRef.current.textContent = `${fmt(v)} m/s`;
        if (heightTextRef.current) heightTextRef.current.textContent = `${fmt(height)} m`;
      }
      if (sliderRef.current) sliderRef.current.value = String(clampedT);
    },
    [h0, fallTime],
  );

  useEffect(() => {
    if (!isPlaying) applyState(elapsedRef.current, true);
  }, [h0, isPlaying, applyState]);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const dt = ((now - lastFrameRef.current) / 1000) * TIME_SCALE;
      lastFrameRef.current = now;
      elapsedRef.current = Math.min(elapsedRef.current + dt, fallTime);
      applyState(elapsedRef.current);

      if (elapsedRef.current >= fallTime) {
        setIsPlaying(false);
        setLanded(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [isPlaying, fallTime, applyState]);

  const handlePlayPause = () => {
    if (elapsedRef.current >= fallTime) {
      elapsedRef.current = 0;
      setLanded(false);
    }
    setCanSetInitialHeight(false);
    setIsPlaying((playing) => !playing);
  };

  const handleReset = () => {
    setIsPlaying(false);
    elapsedRef.current = 0;
    setLanded(false);
    setCanSetInitialHeight(true);
    applyState(0, true);
  };

  const handleScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    const t = event.currentTarget.valueAsNumber;
    elapsedRef.current = t;
    setLanded(t >= fallTime);
    setCanSetInitialHeight(false);
    applyState(t, true);
  };

  const canDrag = canSetInitialHeight && !isPlaying;

  const handleBallPointerDown = (event: React.PointerEvent<SVGCircleElement>) => {
    if (!canDrag) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragHeightRef.current = h0;
    setIsDragging(true);
  };

  const handleSvgPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const height = clientToHeight(svgRef.current, event.clientY);
    dragHeightRef.current = height;
    const y = heightToY(height);
    const vectorStartY = y + BALL_RADIUS;
    const aEndY = clampedArrowEnd(vectorStartY, ACCEL_ARROW_LEN);

    ballRef.current?.setAttribute("cy", String(y));
    guideLineRef.current?.setAttribute("y1", String(y));
    guideLineRef.current?.setAttribute("y2", String(y));
    velocityLineRef.current?.setAttribute("y1", String(vectorStartY));
    velocityLineRef.current?.setAttribute("y2", String(vectorStartY));
    velocityLabelRef.current?.setAttribute("y", String(vectorStartY + 14));
    accelLineRef.current?.setAttribute("y1", String(vectorStartY));
    accelLineRef.current?.setAttribute("y2", String(aEndY));
    accelLabelRef.current?.setAttribute("y", String((vectorStartY + aEndY) / 2));
    if (heightTextRef.current) heightTextRef.current.textContent = `${fmt(height)} m`;
  };

  const handleSvgPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setH0(Math.round(dragHeightRef.current * 10) / 10);
  };

  const majorTicks: number[] = [];
  for (let m = 0; m <= MAX_H; m += 5) majorTicks.push(m);
  const minorTicks: number[] = [];
  for (let m = 0; m <= MAX_H; m += 1) if (m % 5 !== 0) minorTicks.push(m);

  const initialBallY = heightToY(h0);
  const initialVectorStartY = initialBallY + BALL_RADIUS;
  const initialAccelEndY = clampedArrowEnd(initialVectorStartY, ACCEL_ARROW_LEN);

  return (
    <div className="card stack-sm free-fall-scene">
      <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
        Jism faqat tortishish tezlanishi <KatexFormula formula="g" /> ta&apos;sirida tushadi: tezlik{" "}
        <KatexFormula formula="v" /> vaqt bilan <strong>chiziqli</strong> ortadi, bosib o&apos;tilgan masofa esa{" "}
        <strong>kvadratik</strong> ortadi. Boshlang&apos;ich balandlikni belgilash uchun sharchani torting, so&apos;ng
        &ldquo;Boshlash&rdquo; tugmasini bosing.
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Erkin tushish animatsiyasi"
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
        style={{ width: "100%", height: "auto", touchAction: isDragging ? "none" : undefined }}
      >
        <ArrowDefs />

        <line
          x1={0}
          y1={GROUND_Y}
          x2={VIEW_W}
          y2={GROUND_Y}
          style={{ stroke: sceneTheme.color.ink, strokeWidth: sceneTheme.stroke.ground }}
        />

        <line
          x1={RULER_X}
          y1={heightToY(0)}
          x2={RULER_X}
          y2={heightToY(MAX_H)}
          style={{ stroke: sceneTheme.color.grid, strokeWidth: sceneTheme.stroke.ruler }}
        />
        {majorTicks.map((m) => (
          <g key={`major-${m}`}>
            <line
              x1={RULER_X - 6}
              x2={RULER_X}
              y1={heightToY(m)}
              y2={heightToY(m)}
              style={{ stroke: sceneTheme.color.muted, strokeWidth: sceneTheme.stroke.ruler }}
            />
            <text
              x={RULER_X - 10}
              y={heightToY(m) + 4}
              textAnchor="end"
              fontSize={sceneTheme.font.label}
              style={{ fill: sceneTheme.color.muted, fontFamily: sceneTheme.font.ui }}
            >
              {m}
            </text>
          </g>
        ))}
        {minorTicks.map((m) => (
          <line
            key={`minor-${m}`}
            x1={RULER_X - 3}
            x2={RULER_X}
            y1={heightToY(m)}
            y2={heightToY(m)}
            style={{ stroke: sceneTheme.color.grid, strokeWidth: 1 }}
          />
        ))}

        <line
          ref={guideLineRef}
          x1={RULER_X}
          x2={BALL_X}
          y1={heightToY(h0)}
          y2={heightToY(h0)}
          style={{ stroke: sceneTheme.color.muted, strokeWidth: 1, strokeDasharray: "4 4" }}
        />

        <circle
          ref={ballRef}
          cx={BALL_X}
          cy={heightToY(h0)}
          r={BALL_RADIUS}
          onPointerDown={handleBallPointerDown}
          style={{ fill: sceneTheme.color.ink, cursor: canDrag ? "grab" : "default" }}
        />
        {canDrag && (
          <text
            x={BALL_X + 16}
            y={heightToY(h0) - 14}
            fontSize={sceneTheme.font.label}
            style={{ fill: sceneTheme.color.muted, fontFamily: sceneTheme.font.ui }}
          >
            torting ↕
          </text>
        )}

        <g ref={velocityGroupRef} opacity={0}>
          <line
            ref={velocityLineRef}
            x1={BALL_X}
            x2={BALL_X}
            y1={initialVectorStartY}
            y2={initialVectorStartY}
            markerEnd="url(#arrow-velocity)"
            style={{ stroke: sceneTheme.color.velocity, strokeWidth: sceneTheme.stroke.vector }}
          />
          <text
            ref={velocityLabelRef}
            x={BALL_X + 8}
            y={initialVectorStartY + 14}
            fontSize={sceneTheme.font.label}
            style={{ fill: sceneTheme.color.velocity, fontFamily: sceneTheme.font.math }}
          >
            v
          </text>
        </g>

        <g ref={accelGroupRef}>
          <line
            ref={accelLineRef}
            x1={BALL_X + ACCEL_OFFSET_X}
            x2={BALL_X + ACCEL_OFFSET_X}
            y1={initialVectorStartY}
            y2={initialAccelEndY}
            markerEnd="url(#arrow-acceleration)"
            style={{ stroke: sceneTheme.color.acceleration, strokeWidth: sceneTheme.stroke.vector }}
          />
          <text
            ref={accelLabelRef}
            x={BALL_X + ACCEL_OFFSET_X + 8}
            y={(initialVectorStartY + initialAccelEndY) / 2}
            fontSize={sceneTheme.font.label}
            style={{ fill: sceneTheme.color.acceleration, fontFamily: sceneTheme.font.math }}
          >
            g
          </text>
        </g>
      </svg>

      <div style={{ display: "flex", gap: 20, fontSize: 15 }}>
        <span style={{ color: sceneTheme.color.velocity }}>
          <KatexFormula formula="v = g \cdot t" />
        </span>
        <span style={{ color: "var(--ink)" }}>
          <KatexFormula formula="h = h_0 - \tfrac{1}{2} g t^2" />
        </span>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <span style={{ fontSize: sceneTheme.font.label, color: "var(--quiet)" }}>t = </span>
          <span
            ref={timeTextRef}
            style={{ fontSize: sceneTheme.font.value, fontFamily: sceneTheme.font.math, color: "var(--ink)" }}
          >
            0 s
          </span>
        </div>
        <div>
          <span style={{ fontSize: sceneTheme.font.label, color: "var(--quiet)" }}>v = </span>
          <span
            ref={velocityTextRef}
            style={{ fontSize: sceneTheme.font.value, fontFamily: sceneTheme.font.math, color: sceneTheme.color.velocity }}
          >
            0 m/s
          </span>
        </div>
        <div>
          <span style={{ fontSize: sceneTheme.font.label, color: "var(--quiet)" }}>h = </span>
          <span
            ref={heightTextRef}
            style={{ fontSize: sceneTheme.font.value, fontFamily: sceneTheme.font.math, color: "var(--ink)" }}
          >
            {fmt(h0)} m
          </span>
        </div>
      </div>

      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={fallTime}
        step={0.01}
        defaultValue={0}
        onChange={handleScrub}
        aria-label="Vaqt bo'yicha surish"
        style={{ width: "100%" }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={handlePlayPause} className="btn btn-primary">
          {isPlaying ? "Pauza" : landed ? "Qaytadan ko'rish" : "Boshlash"}
        </button>
        <button type="button" onClick={handleReset} className="btn">
          Qayta tiklash
        </button>
      </div>
    </div>
  );
}
