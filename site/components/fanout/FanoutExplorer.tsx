'use client';

import { useState } from 'react';
import { FanoutWindow } from './FanoutUtilities';

type Tone = 'hit' | 'comp' | 'miss';

type FanoutRow = {
  q: string;
  tag: string;
  tone: Tone;
};

type FanoutKind = {
  count: number;
  blurb: string;
  rows: FanoutRow[];
};

const FANOUT_KINDS: Record<string, FanoutKind> = {
  'Prompt Variations': {
    count: 18,
    blurb: 'Turn one buyer query into related prompt variations that reflect how AI engines may interpret search intent.',
    rows: [
      { q: 'best ai visibility platforms for seo teams', tag: 'Variation', tone: 'hit' },
      { q: 'tools to track brand mentions in chatgpt', tag: 'Variation', tone: 'hit' },
      { q: 'software to monitor llm search results', tag: 'Variation', tone: 'hit' },
      { q: 'ai search visibility software for b2b saas', tag: 'Variation', tone: 'hit' },
    ],
  },
  'Intent Branches': {
    count: 6,
    blurb: 'Break broad prompts into specific angles such as features, pricing, alternatives, comparisons, industries, and use cases.',
    rows: [
      { q: 'features — per-engine prompt coverage', tag: 'Features', tone: 'hit' },
      { q: 'pricing — affordable ai visibility tools', tag: 'Pricing', tone: 'comp' },
      { q: 'alternatives — profound vs clovion', tag: 'Alternatives', tone: 'comp' },
      { q: 'use cases — geo for b2b saas teams', tag: 'Use case', tone: 'hit' },
    ],
  },
  'Citation Paths': {
    count: 9,
    blurb: 'See which fanout variations lead AI engines to cite your pages, competitor pages, or third-party sources.',
    rows: [
      { q: 'how to monitor citations in perplexity', tag: '3rd-party', tone: 'comp' },
      { q: 'what is generative engine optimization', tag: 'Owned cite', tone: 'hit' },
      { q: 'guide to llm search citations', tag: 'Competitor', tone: 'comp' },
      { q: 'geo vs seo explained', tag: 'Owned cite', tone: 'hit' },
    ],
  },
  'Content Opportunities': {
    count: 14,
    blurb: 'Identify the sub-questions your content does not answer clearly enough for AI engines to mention or cite you.',
    rows: [
      { q: 'how to monitor citations in perplexity', tag: 'No coverage', tone: 'miss' },
      { q: 'best geo tools for ai search visibility', tag: 'Thin page', tone: 'miss' },
      { q: 'track ai search prompts software', tag: 'No coverage', tone: 'miss' },
      { q: 'chatgpt rank tracking for brands', tag: 'Thin page', tone: 'miss' },
    ],
  },
};

const FANOUT_KIND_KEYS = Object.keys(FANOUT_KINDS);

type ToneStyle = {
  bg: string;
  fg: string;
  dot: string;
};

function toneFor(tone: Tone): ToneStyle {
  if (tone === 'hit') {
    return { bg: 'var(--positive-bg)', fg: 'var(--positive)', dot: 'var(--positive)' };
  }
  if (tone === 'comp') {
    return {
      bg: 'var(--ink-07, rgba(10,10,15,0.08))',
      fg: 'var(--ink-70)',
      dot: 'var(--ink-25, rgba(10,10,15,0.25))',
    };
  }
  return {
    bg: 'transparent',
    fg: 'var(--ink-50)',
    dot: 'var(--ink-20, rgba(10,10,15,0.20))',
  };
}

export default function FanoutExplorer() {
  const [tab, setTab] = useState<string>(FANOUT_KIND_KEYS[0]);
  const c = FANOUT_KINDS[tab];
  const tabLabel = tab.split(' ')[0];

  return (
    <FanoutWindow label={`Fanout / ${tabLabel} · ${c.count}`}>
      <div style={{ padding: 22 }}>
        <div
          role="tablist"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem',
            borderRadius: 999,
            border: '1px solid var(--line)',
            background: 'var(--ink-04, rgba(10,10,15,0.04))',
          }}
        >
          {FANOUT_KIND_KEYS.map((k) => {
            const active = k === tab;
            const label = k.split(' ')[0];
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(k)}
                style={{
                  flex: 1,
                  padding: '0.375rem 1rem',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: active ? 'var(--ink-surface)' : 'transparent',
                  color: active ? 'var(--on-ink)' : 'var(--ink-70)',
                  transition: 'background 200ms var(--ease-out-expo), color 200ms var(--ease-out-expo)',
                }}
              >
                {label}
              </button>
            );
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
            const tone = toneFor(r.tone);
            return (
              <div
                key={r.q}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      height: 8,
                      width: 8,
                      borderRadius: 999,
                      background: r.tone === 'miss' ? 'transparent' : tone.dot,
                      border:
                        r.tone === 'miss'
                          ? '1.5px solid var(--ink-20, rgba(10,10,15,0.20))'
                          : 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.88rem',
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
                    color: tone.fg,
                    background: tone.bg,
                    border: r.tone === 'miss' ? '1px solid var(--line)' : 'none',
                    borderRadius: 999,
                    padding: '0.2rem 0.6rem',
                  }}
                >
                  {r.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </FanoutWindow>
  );
}
