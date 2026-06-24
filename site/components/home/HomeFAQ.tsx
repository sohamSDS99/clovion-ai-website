'use client'

import { useState, type CSSProperties } from 'react'
import { Eyebrow, ArrowRight } from '@/components/ui'
import { HOME_FAQS } from './homeFaqs'

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem'
}

const DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as CSSProperties['textWrap']
}

function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display)'
        }}
      >
        <span style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{q}</span>
        <span
          style={{
            flexShrink: 0,
            color: 'var(--ink-60)',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform .25s ease'
          }}
        >
          <PlusIcon size={18} />
        </span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? 480 : 0, transition: 'max-height .35s var(--ease-out-expo)' }}>
        <p style={{ margin: 0, padding: '0 48px 26px 0', fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>{a}</p>
      </div>
    </div>
  )
}

export function HomeFAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>FAQ</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>Questions, answered.</h2>
            <a
              href="/pricing"
              style={{
                marginTop: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Talk to us <ArrowRight />
            </a>
          </div>
          <div>
            {HOME_FAQS.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
