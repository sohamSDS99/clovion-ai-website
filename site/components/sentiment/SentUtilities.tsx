'use client'

import { ReactNode } from 'react'

/* Sentiment tone palette — three classes, restrained. */
export const TONE = {
  pos: {
    fg: 'var(--positive)',
    bg: 'var(--positive-bg)',
    border: 'var(--positive-border)',
    dot: 'var(--positive)',
    label: 'Positive',
  },
  neu: {
    fg: 'var(--ink-60)',
    bg: 'rgba(10,10,15,0.05)',
    border: 'var(--line)',
    dot: 'var(--ink-40)',
    label: 'Neutral',
  },
  neg: {
    fg: '#be123c',
    bg: '#fff1f2',
    border: '#fecdd3',
    dot: '#f43f5e',
    label: 'Negative',
  },
} as const

type SentWindowProps = {
  label: string
  children: ReactNode
  dark?: boolean
}

export function SentWindow({ label, children, dark }: SentWindowProps) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: '1px solid var(--line)',
        background: dark ? 'var(--ink-surface, var(--ink))' : 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${dark ? 'var(--on-ink-15)' : 'var(--line)'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fecdd3' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fde68a' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#a7f3d0' }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: dark ? 'var(--on-ink-50)' : 'var(--ink-50)',
          }}
        >
          {label}
        </div>
        <div style={{ width: 24 }} />
      </div>
      {children}
    </div>
  )
}

type SentimentBarProps = {
  pos: number
  neu: number
  neg: number
  height?: number
  dark?: boolean
}

/* Stacked positive/neutral/negative bar. */
export function SentimentBar({ pos, neu, neg, height = 12, dark }: SentimentBarProps) {
  const segs = [
    { w: pos, c: 'var(--positive)' },
    {
      w: neu,
      c: dark
        ? 'var(--on-ink-25, rgba(255,255,255,0.28))'
        : 'var(--ink-25, rgba(10,10,15,0.22))',
    },
    { w: neg, c: '#f43f5e' },
  ]
  return (
    <div
      style={{
        display: 'flex',
        height,
        borderRadius: 999,
        overflow: 'hidden',
        background: dark ? 'var(--on-ink-05)' : 'var(--subtle)',
      }}
    >
      {segs.map((s, i) => (
        <div
          key={i}
          style={{
            width: `${s.w}%`,
            background: s.c,
            transition: 'width .6s var(--ease-out-expo, ease)',
          }}
        />
      ))}
    </div>
  )
}

type SparklineProps = {
  data: number[]
  w?: number
  h?: number
  dark?: boolean
}

export function Sparkline({ data, w = 280, h = 56, dark }: SparklineProps) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pad = 4
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2)
    return [x, y] as [number, number]
  })
  const line = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`
  const stroke = 'var(--positive)'
  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sentfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--positive)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--positive)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sentfade)" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="3.2"
        fill={stroke}
      />
    </svg>
  )
}
