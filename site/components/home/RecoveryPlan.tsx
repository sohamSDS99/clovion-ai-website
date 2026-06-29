"use client";

import { useEffect, useState } from "react";

/* ----------------------------------------------------------------------------
 * RecoveryPlan — Clovion "Visibility Recovery Plan" dashboard card (inner only).
 * Editorial-minimal direction. Emerald is the sole accent; one restrained red
 * for the decline indicator. Renders inside an existing white card on a dark
 * page, so no outer border/background here — a thin top divider + spacing only.
 * -------------------------------------------------------------------------- */

/* ── Chart geometry — viewBox 0 0 560 160, uniform scale, default PAR ──────── */
const VB_W = 560;
const VB_H = 134;
const PAD_L = 8;
const PAD_R = 12;
const PLOT_TOP = 14;
const PLOT_BOT = 108; // baseline (room for x labels below)

// y domain 20% .. 30%
const Y_MIN = 20;
const Y_MAX = 30;

const ACTUAL = [28.0, 27.6, 26.8, 25.9, 25.1, 24.6]; // this month's decline (~-12%)
const PROJ = [24.6, 25.9, 26.8, 27.6, 28.2]; // projected recovery (shares 24.6)

const TOTAL_POINTS = ACTUAL.length + PROJ.length - 1; // 10 distinct x positions (0..9)

function xAt(i: number) {
  const usable = VB_W - PAD_L - PAD_R;
  return PAD_L + (usable * i) / (TOTAL_POINTS - 1);
}
function yAt(v: number) {
  const t = (v - Y_MIN) / (Y_MAX - Y_MIN);
  return PLOT_BOT - t * (PLOT_BOT - PLOT_TOP);
}

const actualPts = ACTUAL.map((v, i) => [xAt(i), yAt(v)] as const);
const projPts = PROJ.map((v, i) => [xAt(i + ACTUAL.length - 1), yAt(v)] as const);

function toPath(pts: ReadonlyArray<readonly [number, number]>) {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(" ");
}

const actualPath = toPath(actualPts);
const projPath = toPath(projPts);

// area fill under the projection, down to baseline and back
const projFirst = projPts[0];
const projLast = projPts[projPts.length - 1];
const areaPath = `${projPath} L${projLast[0].toFixed(2)} ${PLOT_BOT} L${projFirst[0].toFixed(2)} ${PLOT_BOT} Z`;

const todayX = xAt(ACTUAL.length - 1);
const endDot = projPts[projPts.length - 1];

// the three actions land as emerald dots on the recovery curve (steps 1,2,3)
const actionDots = [
  { x: projPts[1][0], y: projPts[1][1], tag: "+5.1%" },
  { x: projPts[2][0], y: projPts[2][1], tag: "+3.8%" },
  { x: projPts[3][0], y: projPts[3][1], tag: "+2.6%" },
];

const GRID = [20, 25, 30];

const ACTIONS = [
  { n: 1, label: "Create comparison content vs. top competitors", lift: 5.1 },
  { n: 2, label: "Strengthen enterprise use-case pages", lift: 3.8 },
  { n: 3, label: "Build authority on pricing topics", lift: 2.6 },
];
const MAX_LIFT = 5.1; // for relative bar scaling

const EASE = "cubic-bezier(0.16,1,0.3,1)";

export function RecoveryPlan({ show }: { show: boolean }) {
  // SSR-safe: starts false, resolved in an effect.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Single reveal gate. Under reduced motion we snap straight to final.
  const on = reduced ? true : show;

  const drawDur = reduced ? 0 : 900;
  const projDelay = reduced ? 0 : 540;

  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        color: "var(--ink)",
        width: "100%",
        maxWidth: 590,
        margin: "0 auto",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── Title row ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          rowGap: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-50)",
            }}
          >
            Visibility Recovery Plan
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.01em",
              color: "var(--ink-70)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span
              style={{
                color: "#e5484d",
                fontVariantNumeric: "tabular-nums",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M5 9 L1 3 L9 3 Z" fill="#e5484d" />
              </svg>
              −12.0%
            </span>
            <span style={{ color: "var(--ink-40)" }}>this month</span>
          </span>
        </div>

        {/* +11.5% projected — the lone emerald focal chip */}
        <span
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: "var(--positive)",
            background: "var(--positive-bg)",
            border: "1px solid var(--positive-border)",
            borderRadius: 999,
            padding: "5px 11px",
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
            opacity: on ? 1 : 0,
            transform: on ? "translateY(0)" : "translateY(4px)",
            transition: reduced
              ? "none"
              : `opacity 600ms ${EASE} 120ms, transform 600ms ${EASE} 120ms`,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M5 1 L9 7 L1 7 Z" fill="var(--positive)" />
          </svg>
          +11.5% projected
        </span>
      </div>

      {/* ── Hairline divider ──────────────────────────────────────────── */}
      <div
        style={{
          height: 1,
          background: "var(--line)",
          marginTop: 10,
          marginBottom: 6,
        }}
      />

      {/* ── Chart ─────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%" }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
          role="img"
          aria-label="AI visibility fell about 12% this month, then recovers roughly 11.5% once three actions land."
        >
          <defs>
            <linearGradient id="rp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.16" />
              <stop offset="55%" stopColor="#047857" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="rp-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* gridlines + y labels */}
          {GRID.map((g, i) => {
            const y = yAt(g);
            return (
              <g key={g}>
                <line
                  x1={PAD_L}
                  x2={VB_W - PAD_R}
                  y1={y}
                  y2={y}
                  stroke="var(--ink-06)"
                  strokeWidth={1}
                  style={{
                    opacity: on ? 1 : 0,
                    transition: reduced ? "none" : `opacity 500ms linear ${i * 60}ms`,
                  }}
                />
                <text
                  x={PAD_L}
                  y={y - 5}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--ink-40)"
                  style={{
                    opacity: on ? 1 : 0,
                    transition: reduced ? "none" : `opacity 500ms linear ${i * 60}ms`,
                  }}
                >
                  {g}%
                </text>
              </g>
            );
          })}

          {/* TODAY divider */}
          <line
            x1={todayX}
            x2={todayX}
            y1={PLOT_TOP - 2}
            y2={PLOT_BOT + 2}
            stroke="var(--ink-40)"
            strokeWidth={1}
            strokeDasharray="2 3"
            style={{
              opacity: on ? 0.55 : 0,
              transition: reduced ? "none" : `opacity 500ms ${EASE} 220ms`,
            }}
          />
          <text
            x={todayX}
            y={PLOT_TOP - 5}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8.5}
            letterSpacing="0.12em"
            fill="var(--ink-50)"
            style={{
              opacity: on ? 1 : 0,
              transition: reduced ? "none" : `opacity 500ms ${EASE} 280ms`,
            }}
          >
            TODAY
          </text>

          {/* projection area fill */}
          <path
            d={areaPath}
            fill="url(#rp-area)"
            style={{
              opacity: on ? 1 : 0,
              transition: reduced ? "none" : `opacity 700ms ${EASE} ${projDelay + 250}ms`,
            }}
          />

          {/* ACTUAL — solid ink decline line (normalized pathLength draw-in) */}
          <path
            d={actualPath}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: on ? 0 : 1,
              transition: reduced ? "none" : `stroke-dashoffset ${drawDur}ms ${EASE} 120ms`,
            }}
          />

          {/* ink dots on actual points; the join/today point is a ringed marker */}
          {actualPts.map((p, i) => {
            const isLast = i === actualPts.length - 1;
            return (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r={isLast ? 2.8 : 1.6}
                fill={isLast ? "var(--white)" : "var(--ink)"}
                stroke={isLast ? "var(--ink)" : "none"}
                strokeWidth={isLast ? 1.6 : 0}
                style={{
                  opacity: on ? 1 : 0,
                  transition: reduced ? "none" : `opacity 400ms ${EASE} ${200 + i * 90}ms`,
                }}
              />
            );
          })}

          {/* PROJECTION — dashed emerald line, rendered statically (clean dashes).
              A separate white cover path animates its OWN dashoffset 1->0 to
              progressively UNVEIL the dashed line. This avoids the dash-pattern
              + dashoffset draw-in conflict entirely. */}
          <path
            d={projPath}
            fill="none"
            stroke="var(--positive)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3.5"
            style={{
              opacity: on ? 1 : 0,
              transition: reduced ? "none" : `opacity 360ms ${EASE} ${projDelay}ms`,
            }}
          />
          {!reduced && (
            <path
              d={projPath}
              fill="none"
              stroke="var(--white)"
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                // starts fully covering (offset 0), retracts to reveal (offset 1)
                strokeDashoffset: on ? 1 : 0,
                transition: `stroke-dashoffset ${drawDur}ms ${EASE} ${projDelay}ms`,
              }}
            />
          )}

          {/* action dots on the recovery curve (white halo + emerald core) */}
          {actionDots.map((d, i) => (
            <g key={i}>
              <circle
                cx={d.x}
                cy={d.y}
                r={4}
                fill="var(--white)"
                stroke="var(--positive)"
                strokeWidth={1.75}
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "scale(1)" : "scale(0.4)",
                  transformOrigin: `${d.x}px ${d.y}px`,
                  transition: reduced
                    ? "none"
                    : `opacity 360ms ${EASE} ${projDelay + 460 + i * 150}ms, transform 480ms ${EASE} ${projDelay + 460 + i * 150}ms`,
                }}
              />
              <circle
                cx={d.x}
                cy={d.y}
                r={1.7}
                fill="var(--positive)"
                style={{
                  opacity: on ? 1 : 0,
                  transition: reduced
                    ? "none"
                    : `opacity 360ms ${EASE} ${projDelay + 460 + i * 150}ms`,
                }}
              />
              <text
                x={d.x}
                y={d.y - 10}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={8.5}
                fontWeight={600}
                fill="var(--positive)"
                style={{
                  opacity: on ? 0.92 : 0,
                  transition: reduced
                    ? "none"
                    : `opacity 360ms ${EASE} ${projDelay + 560 + i * 150}ms`,
                }}
              >
                {d.tag}
              </text>
            </g>
          ))}

          {/* glowing, pulsing endpoint dot (SMIL — robust, no CSS-`r` bug) */}
          <g
            style={{
              opacity: on ? 1 : 0,
              transition: reduced ? "none" : `opacity 420ms ${EASE} ${projDelay + 820}ms`,
            }}
          >
            <circle cx={endDot[0]} cy={endDot[1]} r={11} fill="url(#rp-glow)">
              {!reduced && (
                <animate
                  attributeName="r"
                  values="7;13;7"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              )}
              {!reduced && (
                <animate
                  attributeName="opacity"
                  values="0.9;0.35;0.9"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle
              cx={endDot[0]}
              cy={endDot[1]}
              r={3.6}
              fill="var(--positive)"
              stroke="var(--white)"
              strokeWidth={1.6}
            />
          </g>

          {/* x labels */}
          {[
            { i: 0, t: "W1", anchor: "start" as const },
            { i: 9, t: "+4W", anchor: "end" as const },
          ].map((m) => (
            <text
              key={m.t}
              x={xAt(m.i)}
              y={PLOT_BOT + 16}
              textAnchor={m.anchor}
              fontFamily="var(--font-mono)"
              fontSize={8.5}
              letterSpacing="0.08em"
              fill="var(--ink-40)"
              style={{
                opacity: on ? 1 : 0,
                transition: reduced ? "none" : `opacity 500ms ${EASE} 320ms`,
              }}
            >
              {m.t}
            </text>
          ))}
        </svg>
      </div>

      {/* ── Divider before actions ────────────────────────────────────── */}
      <div
        style={{
          height: 1,
          background: "var(--line)",
          marginTop: 10,
          marginBottom: 2,
        }}
      />

      {/* ── Action rows ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ACTIONS.map((a, i) => {
          const delay = reduced ? 0 : 720 + i * 110;
          const frac = (a.lift / MAX_LIFT).toFixed(3);
          return (
            <div
              key={a.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "8px 2px",
                borderTop: i === 0 ? "none" : "1px solid var(--ink-06)",
                opacity: on ? 1 : 0,
                transform: on ? "translateY(0)" : "translateY(6px)",
                transition: reduced
                  ? "none"
                  : `opacity 520ms ${EASE} ${delay}ms, transform 520ms ${EASE} ${delay}ms`,
              }}
            >
              {/* numbered emerald badge */}
              <span
                style={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "var(--positive-bg)",
                  border: "1px solid var(--positive-border)",
                  color: "var(--positive)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {a.n}
              </span>

              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 13.5,
                  lineHeight: 1.35,
                  color: "var(--ink-80)",
                  letterSpacing: "-0.005em",
                }}
              >
                {a.label}
              </span>

              {/* mini lift bar + emerald chip */}
              <span
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 44,
                    height: 3,
                    borderRadius: 2,
                    background: "var(--ink-06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      transformOrigin: "left center",
                      transform: on ? `scaleX(${frac})` : "scaleX(0)",
                      background: "var(--positive)",
                      borderRadius: 2,
                      transition: reduced ? "none" : `transform 640ms ${EASE} ${delay + 140}ms`,
                    }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--positive)",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 42,
                    textAlign: "right",
                  }}
                >
                  +{a.lift.toFixed(1)}%
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecoveryPlan;