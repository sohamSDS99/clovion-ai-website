'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Palette — homepage single source of truth (see memory: homepage-palette).
// Light page: warm off-white bg, white surfaces, ink text. Two brand accents:
// orange = brand energy (Playbooks), emerald = positive/affordance (Studies).
// ---------------------------------------------------------------------------
const ORANGE = '#C2410C'
const ORANGE_BG = 'rgba(194, 65, 12, 0.08)'
const ORANGE_BORDER = 'rgba(194, 65, 12, 0.24)'
const EMERALD = 'var(--positive)' // #047857
const EMERALD_BG = 'rgba(4, 120, 87, 0.08)'
const EMERALD_BORDER = 'rgba(4, 120, 87, 0.22)'

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem'
}

const DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap']
}

const DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.06,
  textWrap: 'balance' as CSSProperties['textWrap']
}

const DISPLAY_SM: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-sm)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-sm)',
  lineHeight: 1.14,
  textWrap: 'balance' as CSSProperties['textWrap']
}

const LEAD: CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  color: 'var(--ink-70)',
  textWrap: 'balance' as CSSProperties['textWrap']
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: ORANGE
      }}
    >
      {children}
    </span>
  )
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Data shape + filtering
// ---------------------------------------------------------------------------
export type ResourcePost = {
  slug: string
  title: string
  excerpt: string
  category: string | null // display name from CMS
  categorySlug: string | null
  author: string
  date: string
  coverImageUrl?: string | null
}

type Filter = 'all' | 'playbook' | 'study-reports'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All posts' },
  { id: 'playbook', label: 'Playbook' },
  { id: 'study-reports', label: 'Study & Reports' }
]

// Classify a resource into a filter bucket. Prefers the CMS category slug/name,
// then falls back to keywords in the title so untagged items still land somewhere
// sensible (e.g. "…A Study" → Study & Reports). Anything unmatched shows only
// under "All posts".
function classifyKind(post: ResourcePost): Exclude<Filter, 'all'> | 'other' {
  const hay = `${post.categorySlug ?? ''} ${post.category ?? ''} ${post.title}`.toLowerCase()
  if (/playbook|guide/.test(hay)) return 'playbook'
  if (/study|report|research|benchmark/.test(hay)) return 'study-reports'
  return 'other'
}

function kindLabel(kind: ReturnType<typeof classifyKind>): string {
  if (kind === 'playbook') return 'Playbook'
  if (kind === 'study-reports') return 'Study & Report'
  return 'Resource'
}

function formatDate(iso: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// A small color-coded pill marking the resource kind. Orange for Playbooks,
// emerald for Studies — the two homepage brand accents.
function KindChip({ post }: { post: ResourcePost }) {
  const kind = classifyKind(post)
  const isPlaybook = kind === 'playbook'
  const isStudy = kind === 'study-reports'
  const color = isPlaybook ? ORANGE : isStudy ? EMERALD : 'var(--ink-60)'
  const bg = isPlaybook ? ORANGE_BG : isStudy ? EMERALD_BG : 'var(--subtle)'
  const border = isPlaybook ? ORANGE_BORDER : isStudy ? EMERALD_BORDER : 'var(--line)'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 11px',
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: bg,
        color,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontWeight: 600
      }}
    >
      {post.category ?? kindLabel(kind)}
    </span>
  )
}

function CoverFrame({ post, aspect }: { post: ResourcePost; aspect: string }) {
  if (post.coverImageUrl) {
    return (
      <div style={{ position: 'relative', aspectRatio: aspect, overflow: 'hidden', background: 'var(--subtle)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImageUrl}
          alt={post.title}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <span
          aria-hidden
          style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(10,10,15,0.08)', pointerEvents: 'none' }}
        />
      </div>
    )
  }
  // No cover → warm branded placeholder with the resource kind letterform.
  const kind = classifyKind(post)
  const accent = kind === 'playbook' ? ORANGE : kind === 'study-reports' ? EMERALD : 'var(--ink)'
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: aspect,
        overflow: 'hidden',
        background: 'var(--subtle)',
        borderBottom: '1px solid var(--line)'
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage: 'radial-gradient(rgba(10,10,15,0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px'
        }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: accent,
            opacity: 0.85,
            userSelect: 'none'
          }}
        >
          {kindLabel(kind).split(' ')[0]}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------
function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.6,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(194,65,12,0.06) 0%, rgba(10,10,15,0.02) 32%, transparent 70%)'
        }}
      />
      <div style={{ ...CONTAINER, padding: '7rem 2rem 3rem' }}>
        <div style={{ maxWidth: 820 }}>
          <Eyebrow>Guides &amp; Downloads</Eyebrow>
          <h1 style={{ ...DISPLAY_LG, fontSize: 'clamp(2rem, 4.2vw + 0.4rem, 3.4rem)', margin: '16px 0 0' }}>
            Playbook, Study &amp; Report.
          </h1>
          <p style={{ ...LEAD, maxWidth: 640, margin: '1.75rem 0 0' }}>
            Practical material on AI visibility, GEO, and answer-engine optimization. Pick what fits
            your team and download it in a couple of clicks.
          </p>
        </div>
      </div>
    </section>
  )
}

// Two latest resources, rendered as a prominent side-by-side highlight above
// the filter bar. Always the two newest (unfiltered) — a fixed spotlight.
function LatestTwo({ posts }: { posts: ResourcePost[] }) {
  if (posts.length === 0) return null
  return (
    <section data-track-location="resources_latest" style={{ padding: '0.5rem 0 0' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/${post.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 24,
                border: '1px solid var(--line)',
                background: 'var(--white)',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: 'var(--shadow-card)',
                transition: 'border-color .25s ease, transform .25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ORANGE_BORDER
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <CoverFrame post={post} aspect="16 / 9" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 'clamp(1.4rem, 2.2vw, 1.9rem)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <KindChip post={post} />
                  {formatDate(post.date) && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--ink-50)' }}>{formatDate(post.date)}</span>
                  )}
                </div>
                <h2 style={{ ...DISPLAY_SM, fontSize: 'clamp(1.35rem, 1.6vw + 0.5rem, 1.85rem)', margin: 0 }}>
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p
                    style={{
                      ...LEAD,
                      fontSize: '1rem',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 4 }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      background: 'var(--ink)',
                      color: 'var(--white)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}
                  >
                    {initials(post.author)}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)' }}>{post.author}</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: ORANGE
                    }}
                  >
                    View resource <ArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Filter pills — the interactive segmented control (image reference).
function FilterBar({
  active,
  onChange,
  counts
}: {
  active: Filter
  onChange: (f: Filter) => void
  counts: Record<Filter, number>
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter resources"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}
    >
      {FILTERS.map((f) => {
        const isActive = active === f.id
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 999,
              border: `1px solid ${isActive ? ORANGE_BORDER : 'transparent'}`,
              background: isActive ? ORANGE_BG : 'transparent',
              color: isActive ? ORANGE : 'var(--ink-60)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background .2s ease, color .2s ease, border-color .2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = ORANGE
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = 'var(--ink-60)'
            }}
          >
            {f.label}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: isActive ? ORANGE : 'var(--ink-40)'
              }}
            >
              {counts[f.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ResourceCard({ post }: { post: ResourcePost }) {
  return (
    <Link
      href={`/resources/${post.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        height: '100%',
        transition: 'border-color .25s ease, transform .25s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = ORANGE_BORDER
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--line)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <CoverFrame post={post} aspect="16 / 9" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <KindChip post={post} />
          {formatDate(post.date) && (
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-50)' }}>{formatDate(post.date)}</span>
          )}
        </div>
        <h3 style={{ ...DISPLAY_SM, fontSize: 'clamp(1.1rem, 1.4vw + 0.4rem, 1.35rem)', margin: 0 }}>{post.title}</h3>
        {post.excerpt && (
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'var(--ink-70)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.excerpt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 6 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{post.author}</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.86rem', fontWeight: 600, color: ORANGE }}>
            View <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function FinalCTA() {
  return (
    <section data-track-location="resources_final_cta" style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink)',
            color: 'var(--white)',
            padding: 'clamp(3rem, 6vw, 5.5rem) clamp(2rem, 5vw, 3.5rem)'
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.5,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 60% at 85% 15%, rgba(194,65,12,0.28) 0%, transparent 60%)'
            }}
          />
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#F0A88A' }}>
              Skip the reading
            </span>
            <h2 style={{ ...DISPLAY_LG, margin: '20px 0 0', color: 'var(--white)' }}>See your AI visibility score.</h2>
            <p style={{ ...LEAD, color: 'rgba(255,255,255,0.72)', marginTop: 24, maxWidth: 520 }}>
              Free score in 60 seconds. Enter your domain and see how the major AI engines mention
              you, which competitors appear, and where to improve.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://app.clovion.ai/signup" className="btn btn-invert btn-lg">
                Start Free Trial <ArrowRight />
              </a>
              <a
                href="/free-ai-visibility-score"
                className="btn btn-lg"
                style={{ background: 'transparent', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                Get Free Score
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Composer
// ---------------------------------------------------------------------------
export default function ResourcesContent({ posts = [] }: { posts?: ResourcePost[] }) {
  const [active, setActive] = useState<Filter>('all')

  // Newest first.
  const sorted = useMemo(
    () => [...posts].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [posts]
  )

  // Two newest → spotlight band above the filters. The full collection fills
  // the filterable grid below (the two latest reappear there as part of the
  // browsable set) so the grid and counts stay meaningful even with few posts.
  const latest = sorted.slice(0, 2)

  const counts = useMemo<Record<Filter, number>>(() => {
    const c: Record<Filter, number> = { all: sorted.length, playbook: 0, 'study-reports': 0 }
    for (const p of sorted) {
      const k = classifyKind(p)
      if (k === 'playbook') c.playbook += 1
      else if (k === 'study-reports') c['study-reports'] += 1
    }
    return c
  }, [sorted])

  const filtered = useMemo(() => {
    if (active === 'all') return sorted
    return sorted.filter((p) => classifyKind(p) === active)
  }, [active, sorted])

  const empty = sorted.length === 0

  return (
    <>
      <Hero />

      {empty ? (
        <section style={{ padding: '1rem 0 var(--section)' }}>
          <div style={CONTAINER}>
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                border: '1px dashed var(--line)',
                borderRadius: 22,
                color: 'var(--ink-60)',
                background: 'var(--white)'
              }}
            >
              Nothing published yet. New resources are on the way — check back soon.
            </div>
          </div>
        </section>
      ) : (
        <>
          <LatestTwo posts={latest} />

          <section data-track-location="resources_grid" style={{ padding: '2.75rem 0 var(--section)' }}>
            <div style={CONTAINER}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                  paddingBottom: 28,
                  borderBottom: '1px solid var(--line)',
                  marginBottom: 32
                }}
              >
                <FilterBar active={active} onChange={setActive} counts={counts} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: 'var(--ink-50)'
                  }}
                >
                  Newest first
                </span>
              </div>

              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    border: '1px dashed var(--line)',
                    borderRadius: 22,
                    color: 'var(--ink-60)',
                    background: 'var(--white)'
                  }}
                >
                  Nothing here yet. Try another filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filtered.map((post) => (
                    <ResourceCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <FinalCTA />
    </>
  )
}
