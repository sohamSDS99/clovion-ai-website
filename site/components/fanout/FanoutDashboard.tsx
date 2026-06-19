'use client';

import { FanoutWindow, FanoutEngineDots, Branch, F_ENGINES, F_ENGINE_LOGO, F_MONO_LABEL, useFanoutReveal } from './FanoutUtilities';

const HERO_SEED = 'best tools for tracking brand visibility across AI search engines';

type FanoutTone = 'hit' | 'comp' | 'miss';

type FanoutRow = {
  q: string;
  cov: string;
  tag: string;
  tone: FanoutTone;
  st: FanoutTone[];
};

const HERO_FANOUT: FanoutRow[] = [
  { q: 'best ai visibility platforms for seo teams', cov: '5/6', tag: 'You', tone: 'hit', st: ['hit', 'hit', 'hit', 'hit', 'comp', 'hit'] },
  { q: 'tools to track brand mentions in chatgpt', cov: '2/6', tag: 'Competitor', tone: 'comp', st: ['comp', 'hit', 'comp', 'hit', 'miss', 'miss'] },
  { q: 'how to monitor citations in perplexity', cov: '1/6', tag: 'Gap', tone: 'miss', st: ['miss', 'miss', 'comp', 'hit', 'miss', 'miss'] },
  { q: 'ai search visibility software for b2b saas', cov: '4/6', tag: 'You', tone: 'hit', st: ['hit', 'hit', 'comp', 'hit', 'miss', 'hit'] },
  { q: 'best geo tools for improving ai search visibility', cov: '2/6', tag: 'Competitor', tone: 'comp', st: ['comp', 'comp', 'hit', 'hit', 'miss', 'miss'] }
];

function FanoutToneChip({ tag, tone }: { tag: string; tone: FanoutTone }) {
  const t = tone === 'hit' ? { bg: 'var(--positive-bg)', fg: 'var(--positive)' }
    : tone === 'comp' ? { bg: 'var(--ink-07, rgba(10,10,15,0.08))', fg: 'var(--ink-70)' }
    : { bg: 'transparent', fg: 'var(--ink-50)' };
  return (
    <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: t.fg, background: t.bg, border: tone === 'miss' ? '1px solid var(--line)' : 'none', borderRadius: 999, padding: '0.2rem 0.6rem', whiteSpace: 'nowrap' }}>{tag}</span>
  );
}

export default function FanoutDashboard() {
  const [ref, on] = useFanoutReveal();
  return (
    <div ref={ref}>
      <FanoutWindow label="Clovion AI / Fanout / AI Visibility">
        <div style={{ padding: 22 }}>
          {/* seed prompt */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 12, background: 'var(--ink-surface, var(--ink))', color: 'var(--on-ink)' }}>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-ink)', background: 'var(--on-ink-15)', borderRadius: 999, padding: '0.22rem 0.55rem' }}>Seed</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--on-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{HERO_SEED}</span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--on-ink-50)', whiteSpace: 'nowrap' }}>5 variations</span>
          </div>
          {/* fanout variations */}
          <div style={{ marginTop: 6 }}>
            {HERO_FANOUT.map((p, i) => (
              <div key={p.q} style={{ display: 'flex', alignItems: 'stretch', opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: `all .5s ease ${i * 80}ms` }}>
                <Branch last={i === HERO_FANOUT.length - 1} />
                <div style={{ flex: 1, minWidth: 0, margin: '6px 0', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.q}</div>
                    <div style={{ marginTop: 8 }}><FanoutEngineDots statuses={p.st} /></div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', fontWeight: 600, color: 'var(--ink-70)', fontVariantNumeric: 'tabular-nums' }}>{p.cov}</span>
                  <FanoutToneChip tag={p.tag} tone={p.tone} />
                </div>
              </div>
            ))}
          </div>
          {/* footer legend */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 14, fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--ink-50)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: 'var(--positive)' }} />You</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: 'var(--ink-25, rgba(10,10,15,0.25))' }} />Competitor</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ height: 8, width: 8, borderRadius: 999, border: '1.5px solid var(--ink-20, rgba(10,10,15,0.20))', boxSizing: 'border-box' }} />Gap</span>
            </div>
            <span style={{ display: 'flex', gap: 5 }}>
              {F_ENGINES.map((e) => (
                <span key={e} title={e} style={{ height: 22, width: 22, borderRadius: 7, background: 'var(--white)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={F_ENGINE_LOGO[e]} alt={e} style={{ height: e === 'Grok' ? 13 : 11, width: 'auto', filter: 'var(--logo-filter, brightness(0))' }} />
                </span>
              ))}
            </span>
          </div>
        </div>
      </FanoutWindow>
    </div>
  );
}
