'use client'

import { useEffect, useMemo, useState } from 'react'

// Faux Index data — 8 brands × 7 days of drift. Hand-tuned so the rises and
// falls make sense at a glance. The component re-highlights a new day every
// few seconds so the dashboard feels alive.
const INDEX_BRANDS = [
  { ticker: 'LNR', name: 'Linear', base: 84, drift: [0.4, 0.2, -0.1, 0.6, 0.3, 0.5, 0.8] },
  { ticker: 'RMP', name: 'Ramp', base: 71, drift: [-0.2, 0.5, 0.7, 0.4, 0.6, 0.3, 0.4] },
  { ticker: 'NTN', name: 'Notion', base: 88, drift: [0.1, -0.3, 0.2, 0.1, -0.4, 0.2, 0.3] },
  { ticker: 'VRC', name: 'Vercel', base: 79, drift: [0.5, 0.6, 0.3, 0.8, 0.4, 0.7, 0.9] },
  { ticker: 'LOM', name: 'Loom', base: 62, drift: [-0.6, -0.3, -0.5, 0.1, -0.2, 0.3, 0.1] },
  { ticker: 'FIG', name: 'Figma', base: 91, drift: [0.2, 0.1, 0.3, -0.1, 0.2, 0.1, 0.4] },
  { ticker: 'BRX', name: 'Brex', base: 68, drift: [0.3, 0.5, 0.2, 0.6, 0.4, 0.5, 0.7] },
  { ticker: 'WFL', name: 'Webflow', base: 74, drift: [0.7, 0.4, 0.5, 0.8, 0.6, 0.9, 1.1] }
] as const

export function LiveIndexWidget() {
  const [step, setStep] = useState(6)
  const [secondsAgo, setSecondsAgo] = useState(0)

  // Slow timer — moves the "active" highlight to a new day every 4 seconds.
  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 7)
      setSecondsAgo(0)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // Secondary timer — increments the "last update Ns ago" counter every second.
  useEffect(() => {
    const id = setInterval(() => setSecondsAgo((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const rows = useMemo(() => {
    return INDEX_BRANDS.map((b) => {
      const series = b.drift.map((_, i) => {
        const cum = b.drift.slice(0, i + 1).reduce((a, c) => a + c, 0)
        return +(b.base + cum).toFixed(1)
      })
      const last = series[series.length - 1]
      const first = series[0]
      const delta = +(last - first).toFixed(1)
      return { ticker: b.ticker, name: b.name, series, delta }
    })
  }, [])

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <span className="font-mono text-xs text-white/60 ml-3">clovion-index / live</span>
        </div>
        <div className="font-mono text-xs text-white/50 flex items-center gap-3">
          <span className="hidden md:inline">last update {secondsAgo}s ago</span>
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[56px_1fr_repeat(7,minmax(0,1fr))_64px_56px] gap-2 md:gap-3 px-5 md:px-6 py-3 border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        <div>Ticker</div>
        <div>Brand</div>
        <div className="text-right">D-6</div>
        <div className="text-right">D-5</div>
        <div className="text-right">D-4</div>
        <div className="text-right">D-3</div>
        <div className="text-right">D-2</div>
        <div className="text-right">D-1</div>
        <div className="text-right">Today</div>
        <div className="text-right">Δ 7d</div>
        <div className="text-right">Trend</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {rows.map((row) => {
          const isUp = row.delta >= 0
          const max = Math.max(...row.series)
          const min = Math.min(...row.series)
          const range = max - min || 1
          return (
            <div
              key={row.ticker}
              className="grid grid-cols-[56px_1fr_repeat(7,minmax(0,1fr))_64px_56px] gap-2 md:gap-3 px-5 md:px-6 py-4 md:py-5 items-center hover:bg-white/[0.04] transition-colors"
            >
              <div className="font-mono text-xs text-white/60">{row.ticker}</div>
              <div className="text-sm text-white font-semibold truncate">{row.name}</div>
              {row.series.map((v, i) => {
                const isLast = i === row.series.length - 1
                const isHighlight = i === step
                return (
                  <div
                    key={i}
                    className={
                      'text-right font-mono text-[11px] md:text-xs tabular-nums transition-colors duration-500 ' +
                      (isHighlight ? 'text-white' : isLast ? 'text-white/90' : 'text-white/50')
                    }
                  >
                    {v.toFixed(1)}
                  </div>
                )
              })}
              <div
                className={
                  'text-right font-mono text-xs tabular-nums font-semibold ' +
                  (isUp ? 'text-white' : 'text-white/40')
                }
              >
                {isUp ? '+' : ''}
                {row.delta.toFixed(1)}
              </div>
              {/* Sparkline */}
              <div className="h-7 w-full flex items-end justify-end gap-[2px]">
                {row.series.map((v, i) => {
                  const norm = (v - min) / range
                  const h = 5 + norm * 22
                  return (
                    <span
                      key={i}
                      className={
                        'w-[3px] rounded-sm transition-all duration-700 ' +
                        (i === step ? 'bg-white' : 'bg-white/30')
                      }
                      style={{ height: `${h}px` }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 md:px-6 py-4 border-t border-white/10 font-mono text-[11px] text-white/40">
        <span>8 brands · 5 engines · daily refresh</span>
        <span>clovion.ai/index</span>
      </div>
    </div>
  )
}
