import { Container } from '@/components/ui'

const CARDS = [
  { role: 'Self-improving', title: 'Learning Network', body: 'Every measured improvement helps strengthen future recommendations for companies like yours, making Clovion smarter over time.', key: 'learn' },
  { role: 'Always on', title: 'Continuous Audit', body: 'Continuously scan your website and the sources AI relies on to identify conflicting messaging, missing sources, and new opportunities.', key: 'audit' },
  { role: 'Real-time', title: 'Analytics Monitor', body: 'Monitor Google Analytics for changes in traffic, engagement, funnels, and conversions, with AI-powered insights and recommendations.', key: 'analytics' }
]

export function AgentsAtWork() {
  return (
    <section className="py-16 md:py-28" data-track-location="home_agents" style={{ position: 'relative' }}>
      <Container>
        {/* header — centered */}
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-md)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-md)',
              lineHeight: 1.05,
              margin: 0,
              color: 'var(--ink)'
            }}
          >
            AI Agents always working behind the scenes.
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lead)',
              lineHeight: 1.55,
              color: 'var(--ink-70)',
              margin: '20px auto 0',
              maxWidth: 620,
              textWrap: 'balance'
            }}
          >
            Three intelligent systems continuously monitor your brand, uncover new opportunities, and strengthen your brand over time.
          </p>
        </div>

        {/* three columns divided by vertical hairlines */}
        <div className="clv-agents-grid" style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          {CARDS.map((c) => (
            <div key={c.key} className="clv-agents-col">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0 }}>{c.title}</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-70)', margin: '12px 0 28px' }}>{c.body}</p>

              {/* static visual panel, bottom-aligned across columns */}
              <div
                style={{
                  marginTop: 'auto',
                  position: 'relative',
                  height: 176,
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  overflow: 'hidden'
                }}
              >
                {c.key === 'learn' && <LearningVisual />}
                {c.key === 'audit' && <AuditVisual />}
                {c.key === 'analytics' && <AnalyticsVisual />}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        .clv-agents-grid { display: grid; grid-template-columns: 1fr; }
        .clv-agents-col { display: flex; flex-direction: column; padding: 32px 0 0; }
        .clv-agents-col + .clv-agents-col { border-top: 1px solid var(--line); }
        @media (min-width: 768px) {
          .clv-agents-grid { grid-template-columns: repeat(3, 1fr); }
          .clv-agents-col { padding: 0 clamp(24px, 2.6vw, 44px); border-top: none; }
          .clv-agents-col:first-child { padding-left: 0; }
          .clv-agents-col:last-child { padding-right: 0; }
          .clv-agents-col + .clv-agents-col { border-top: none; border-left: 1px solid var(--line); }
        }
      `}</style>
    </section>
  )
}

/* ── Card 1: Learning Network — a distilled "measured lift" insight.
   The full fix × AI-engine uplift table (reference) doesn't work as a tiny grid
   at 176px, so this SUMMARIZES it as an insight readout: the single biggest
   measured lift as the hero, two supporting wins, and "across 4 AI engines" —
   conveying that Clovion learns which fixes move which engines. B&W + one
   emerald accent (the lift figures). Static, matches the sibling cards. ── */
const M_SUPPORT = [
  { fix: 'Comparison pages', eng: 'ChatGPT', v: '+7%' },
  { fix: 'Page substance', eng: 'all engines', v: '+5%' }
]

function LearningVisual() {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '16px 18px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', fontVariantNumeric: 'tabular-nums' }} aria-hidden>
      <span style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>Biggest measured lift</span>

      {/* hero */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 9 }}>
        <span style={{ fontSize: 38, fontWeight: 600, lineHeight: 1, color: 'var(--positive)', letterSpacing: '-0.02em' }}>+9%</span>
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25, whiteSpace: 'nowrap' }}>Reddit presence</span>
          <span style={{ fontSize: 10.5, color: 'var(--ink-50)', lineHeight: 1.25 }}>on Perplexity</span>
        </span>
      </div>

      <div style={{ height: 1, background: 'var(--line)', margin: '13px 0 11px' }} />

      {/* supporting wins */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {M_SUPPORT.map((r) => (
          <div key={r.fix} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 11, fontWeight: 600, color: 'var(--ink-70)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fix}</span>
            <span style={{ fontSize: 9.5, color: 'var(--ink-40)', whiteSpace: 'nowrap' }}>{r.eng}</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--positive)', minWidth: 30, textAlign: 'right' }}>{r.v}</span>
          </div>
        ))}
      </div>

      <span style={{ marginTop: 'auto', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>Measured across 4 AI engines</span>
    </div>
  )
}

/* ── Card 2: Continuous Audit — static source rows (B&W) ── */
function AuditVisual() {
  const ROWS = [
    { label: 'Your website', status: 'ok' },
    { label: 'Wikipedia', status: 'ok' },
    { label: 'Review platforms', status: 'new' },
    { label: 'News & PR', status: 'flag' }
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 11 }}>
      {ROWS.map((r) => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span aria-hidden style={{ width: 15, height: 15, borderRadius: 4, background: 'var(--white)', border: '1px solid var(--ink-20)', flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, fontSize: '0.78rem', color: 'var(--ink-80)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
          <StatusTag status={r.status} />
        </div>
      ))}
    </div>
  )
}

function StatusTag({ status }: { status: string }) {
  if (status === 'new') {
    return (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-60)', border: '1px solid var(--ink-20)', borderRadius: 999, padding: '2px 7px', flexShrink: 0 }}>New</span>
    )
  }
  if (status === 'flag') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-40)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
        <path d="M12 9v4M12 17h.01M10.3 4l-7 12a2 2 0 0 0 1.7 3h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0z" />
      </svg>
    )
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-70)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  )
}

/* ── Card 3: Analytics Monitor — static bars trending up (B&W) ── */
function AnalyticsVisual() {
  const BARS = [30, 38, 34, 46, 52, 60, 68, 84]
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>Conversions</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>Live</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 12, borderBottom: '1px solid var(--line)', paddingBottom: 1 }}>
        {BARS.map((h, i) => {
          const last = i === BARS.length - 1
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: '4px 4px 1px 1px',
                background: last ? 'var(--ink)' : 'var(--ink-15)'
              }}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
        <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 10 L10 3" />
          <path d="M5 3 H10 V8" />
        </svg>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>+9%</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-50)' }}>vs last week</span>
      </div>
    </div>
  )
}
