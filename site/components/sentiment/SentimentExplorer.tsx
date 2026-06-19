'use client'

import { useState } from 'react'
import { SentWindow, TONE } from './SentUtilities'

/* ── FOUR DIMENSIONS — EXPLORER ────────────────────────────────── */
const SENT_DIMENSIONS: Record<
  string,
  {
    count: number
    blurb: string
    rows: { q: string; tag: string; tone: 'pos' | 'neu' | 'neg'; ex: string }[]
  }
> = {
  Positive: {
    count: 21,
    blurb:
      'See where AI engines describe your brand with favorable language, strong recommendations, or category-leadership signals.',
    rows: [
      {
        q: 'best ai visibility tools for saas',
        tag: 'Recommended',
        tone: 'pos',
        ex: '“Clovion AI is a strong choice for teams that want per-engine visibility.”',
      },
      {
        q: 'top tools to track brand in chatgpt',
        tag: 'Leader',
        tone: 'pos',
        ex: '“…leading platforms such as Clovion AI make this measurable.”',
      },
      {
        q: 'how to monitor ai search mentions',
        tag: 'Favorable',
        tone: 'pos',
        ex: '“Clovion AI is praised for connecting findings to fixes.”',
      },
    ],
  },
  Neutral: {
    count: 16,
    blurb:
      'Find factual mentions that include your brand but do not strongly recommend, differentiate, or position you.',
    rows: [
      {
        q: 'list of llm visibility platforms',
        tag: 'Listed',
        tone: 'neu',
        ex: '“Options include several tools, among them Clovion AI.”',
      },
      {
        q: 'what software tracks ai answers',
        tag: 'Factual',
        tone: 'neu',
        ex: '“Clovion AI is one of the available platforms in this space.”',
      },
      {
        q: 'ai seo tooling overview',
        tag: 'Mentioned',
        tone: 'neu',
        ex: '“Clovion AI offers tracking across multiple engines.”',
      },
    ],
  },
  Negative: {
    count: 6,
    blurb:
      'Identify prompts where engines mention limitations, concerns, outdated info, missing features, pricing, or weak positioning.',
    rows: [
      {
        q: 'enterprise ai visibility platforms',
        tag: 'Caveated',
        tone: 'neg',
        ex: '“Clovion AI is emerging; larger teams may prefer established vendors.”',
      },
      {
        q: 'most complete ai monitoring suite',
        tag: 'Weak',
        tone: 'neg',
        ex: '“…fewer enterprise integrations than incumbent platforms.”',
      },
      {
        q: 'cheapest brand sentiment tracker',
        tag: 'Pricing',
        tone: 'neg',
        ex: '“Pricing for Clovion AI may be higher for small teams.”',
      },
    ],
  },
  Competitor: {
    count: 11,
    blurb:
      'Compare how AI engines describe your brand against competitors in the same answers, topics, and regions.',
    rows: [
      {
        q: 'clovion vs profound',
        tag: 'Tied',
        tone: 'neu',
        ex: '“Both are positioned as AI visibility platforms.”',
      },
      {
        q: 'best alternative to peec ai',
        tag: 'Ahead',
        tone: 'pos',
        ex: '“Clovion AI stands out for per-engine sentiment.”',
      },
      {
        q: 'otterly vs clovion for agencies',
        tag: 'Behind',
        tone: 'neg',
        ex: '“Competitor framed as more established for agencies.”',
      },
    ],
  },
}

const SENT_DIM_KEYS = Object.keys(SENT_DIMENSIONS)

export default function SentimentExplorer() {
  const [tab, setTab] = useState<string>('Positive')
  const c = SENT_DIMENSIONS[tab]

  return (
    <SentWindow label={`Sentiment / ${tab} · ${c.count}`}>
      <div style={{ padding: 22 }}>
        <div
          role="tablist"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            padding: 4,
            borderRadius: 999,
            background: 'rgba(10,10,15,0.04)',
            border: '1px solid var(--line)',
            gap: 4,
          }}
        >
          {SENT_DIM_KEYS.map((k) => {
            const isActive = tab === k
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(k)}
                style={{
                  flex: 1,
                  appearance: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: isActive ? 'var(--ink-surface)' : 'transparent',
                  color: isActive ? 'var(--on-ink)' : 'var(--ink-70)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  transition: 'background 200ms var(--ease-out-expo), color 200ms var(--ease-out-expo)',
                  whiteSpace: 'nowrap',
                }}
              >
                {`${k} ${SENT_DIMENSIONS[k].count}`}
              </button>
            )
          })}
        </div>
        <p
          style={{
            margin: '18px 2px 0',
            fontSize: '0.9rem',
            lineHeight: 1.55,
            color: 'var(--ink-70)',
          }}
        >
          {c.blurb}
        </p>
        <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          {c.rows.map((r) => {
            const t = TONE[r.tone]
            return (
              <div
                key={r.q}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        height: 8,
                        width: 8,
                        borderRadius: 999,
                        background: t.dot,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.q}
                    </span>
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: t.fg,
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      borderRadius: 999,
                      padding: '0.2rem 0.6rem',
                    }}
                  >
                    {r.tag}
                  </span>
                </div>
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: 'var(--ink-60)',
                    fontStyle: 'italic',
                  }}
                >
                  {r.ex}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </SentWindow>
  )
}
