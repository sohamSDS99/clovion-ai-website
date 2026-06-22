'use client'

import { useState } from 'react'
import { CrawlWindow, AccessPill, useCrawlReveal, C_BOT_LOGO, C_MONO_LABEL } from './CrawlUtilities'

const HERO_PRESETS = ['Maximum visibility', 'Training opt-out', 'Block all AI']

type AccessState = 'allow' | 'block' | 'warn'

type HeroBot = {
  ua: string
  org: keyof typeof C_BOT_LOGO
  type: 'Training' | 'Search'
  s: AccessState[]
}

const HERO_BOTS: HeroBot[] = [
  { ua: 'GPTBot', org: 'OpenAI', type: 'Training', s: ['allow', 'block', 'block'] },
  { ua: 'ChatGPT-User', org: 'OpenAI', type: 'Search', s: ['allow', 'allow', 'block'] },
  { ua: 'OAI-SearchBot', org: 'OpenAI', type: 'Search', s: ['allow', 'allow', 'block'] },
  { ua: 'ClaudeBot', org: 'Anthropic', type: 'Training', s: ['allow', 'block', 'block'] },
  { ua: 'PerplexityBot', org: 'Perplexity', type: 'Search', s: ['allow', 'allow', 'block'] },
  { ua: 'Google-Extended', org: 'Google', type: 'Training', s: ['allow', 'block', 'block'] }
]

export default function CrawlDashboard() {
  const [ref, on] = useCrawlReveal()
  const [preset, setPreset] = useState(1)
  const allowed = HERO_BOTS.filter((b) => b.s[preset] === 'allow').length

  return (
    <div ref={ref}>
      <CrawlWindow label="Clovion AI / Crawlability / robots.txt">
        <div style={{ padding: 22 }}>
          {/* preset selector */}
          <div style={C_MONO_LABEL}>Access preset</div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8" style={{ marginTop: 10 }}>
            {HERO_PRESETS.map((p, i) => (
              <button
                key={p}
                onClick={() => setPreset(i)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '11px 12px',
                  borderRadius: 11,
                  border: `1px solid ${preset === i ? 'var(--ink)' : 'var(--line)'}`,
                  background: preset === i ? 'var(--ink-surface, var(--ink))' : 'var(--subtle)',
                  color: preset === i ? 'var(--on-ink)' : 'var(--ink-70)',
                  transition: 'all .2s ease'
                }}
              >
                <span
                  style={{
                    display: 'block',
                    height: 7,
                    width: 7,
                    borderRadius: 999,
                    background: preset === i ? 'var(--positive)' : 'var(--ink-25, rgba(10,10,15,0.22))',
                    marginBottom: 9
                  }}
                />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.25, display: 'block' }}>{p}</span>
              </button>
            ))}
          </div>
          {/* bot list */}
          <div style={{ margin: '18px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={C_MONO_LABEL}>AI crawler access</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-50)', fontVariantNumeric: 'tabular-nums' }}>
              {allowed}/{HERO_BOTS.length} allowed
            </span>
          </div>
          <div className="overflow-x-auto md:overflow-visible">
          <div className="min-w-[420px] md:min-w-0" style={{ display: 'grid', gap: 7 }}>
            {HERO_BOTS.map((b, i) => (
              <div
                key={b.ua}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto',
                  alignItems: 'center',
                  gap: 11,
                  padding: '9px 13px',
                  borderRadius: 11,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateY(6px)',
                  transition: `all .4s ease ${i * 55}ms`
                }}
              >
                <span
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 7,
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={C_BOT_LOGO[b.org]}
                    alt={b.org}
                    style={{ height: 12, width: 'auto', filter: 'var(--logo-filter, brightness(0))' }}
                  />
                </span>
                <span
                  style={{
                    minWidth: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {b.ua}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: b.type === 'Training' ? 'var(--ink-50)' : 'var(--ink-70)'
                  }}
                >
                  {b.type}
                </span>
                <AccessPill kind={b.s[preset]} />
              </div>
            ))}
          </div>
          </div>
          {/* diff footer */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-50)' }}>3 pending changes</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem'
              }}
            >
              <span style={{ color: 'var(--positive)' }}>+2 allow</span>
              <span style={{ color: 'var(--ink-50)' }}>−1 block</span>
            </span>
          </div>
        </div>
      </CrawlWindow>
    </div>
  )
}
