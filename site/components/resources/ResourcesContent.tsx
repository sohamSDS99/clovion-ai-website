'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Section, Container, Eyebrow, ArrowRight } from '@/components/ui'

// ---------------------------------------------------------------------------
// Palette — homepage single source of truth (see memory: homepage-palette).
// Light page: warm off-white bg, white surfaces, ink text. Two brand accents:
// orange = brand energy (Playbooks), emerald = positive/affordance (Studies).
// Mirrors the blog index's visual system (components/blog/BlogIndex.tsx).
// ---------------------------------------------------------------------------
const ORANGE = '#C2410C'
const ORANGE_BG = 'rgba(194, 65, 12, 0.08)'
const ORANGE_BORDER = 'rgba(194, 65, 12, 0.24)'
const EMERALD = 'var(--positive)' // #047857
const EMERALD_BG = 'rgba(4, 120, 87, 0.08)'
const EMERALD_BORDER = 'rgba(4, 120, 87, 0.22)'

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

function Byline({ post, size = 'md' }: { post: ResourcePost; size?: 'md' | 'sm' }) {
  const avatar = size === 'md' ? 34 : 30
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          width: avatar,
          height: avatar,
          borderRadius: 999,
          background: 'var(--ink)',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size === 'md' ? '0.74rem' : '0.66rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          flexShrink: 0
        }}
      >
        {initials(post.author)}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: size === 'md' ? '0.9rem' : '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
          {post.author}
        </span>
        {formatDate(post.date) && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-50)'
            }}
          >
            {formatDate(post.date)}
          </span>
        )}
      </div>
    </div>
  )
}

// Cover frame. object-fit: COVER fills the whole frame edge-to-edge (matches the
// blog cards + the reference design) — covers are authored 16:9 card art, so a
// 16:9 frame fits with no crop, and the grid's 4:3 frame trims only the sides.
// CLS-free: the aspect box reserves space before load. On-top hairline frames
// dark/near-black covers so they still read as a bounded region.
function Cover({ post, aspect }: { post: ResourcePost; aspect: string }) {
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
    <div style={{ position: 'relative', aspectRatio: aspect, overflow: 'hidden', background: 'var(--subtle)' }}>
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
            opacity: 0.14,
            userSelect: 'none'
          }}
        >
          {kindLabel(kind).split(' ')[0]}
        </span>
      </div>
    </div>
  )
}

// Interactive segmented filter — Playbook / Study & Reports / All.
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
    <div role="tablist" aria-label="Filter resources" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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
              height: 38,
              padding: '0 18px',
              borderRadius: 999,
              border: `1px solid ${isActive ? ORANGE : 'var(--line)'}`,
              background: isActive ? ORANGE_BG : 'var(--white)',
              color: isActive ? ORANGE : 'var(--ink-70)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background .2s ease, color .2s ease, border-color .2s ease'
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

// Featured resource — the blog's horizontal split: cover left, text right.
function FeaturedCard({ post }: { post: ResourcePost }) {
  const textBlock = (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: 'clamp(1.75rem, 2.5vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: ORANGE
          }}
        >
          Featured
        </span>
        <KindChip post={post} />
      </div>
      <h2 className="display-sm" style={{ fontSize: 'clamp(1.5rem, 1.7vw + 0.5rem, 2.1rem)', lineHeight: 1.1, margin: 0 }}>
        {post.title}
      </h2>
      {post.excerpt && (
        <p
          className="lead"
          style={{
            fontSize: '1.02rem',
            margin: 0,
            maxWidth: 640,
            color: 'var(--ink-70)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.excerpt}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 8 }}>
        <Byline post={post} />
        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.92rem',
            fontWeight: 600,
            color: ORANGE
          }}
        >
          View resource <ArrowRight />
        </span>
      </div>
    </div>
  )

  return (
    <Section tight className="!pb-0">
      <Container>
        <Link
          href={`/resources/${post.slug}`}
          className="group block"
          style={{
            position: 'relative',
            borderRadius: 28,
            border: '1px solid var(--line)',
            background: 'var(--white)',
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr]">
            <div style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--line)' }}>
              <Cover post={post} aspect="16 / 9" />
            </div>
            <div className="relative" style={{ overflow: 'hidden' }}>
              <div className="md:absolute md:inset-0">{textBlock}</div>
            </div>
          </div>
        </Link>
      </Container>
    </Section>
  )
}

// Grid card — the blog's vertical PostCard.
function ResourceCard({ post }: { post: ResourcePost }) {
  return (
    <Link
      href={`/resources/${post.slug}`}
      className="group flex flex-col h-full"
      style={{
        borderRadius: 22,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden'
      }}
    >
      <div style={{ flexShrink: 0, borderBottom: '1px solid var(--line)' }}>
        <Cover post={post} aspect="16 / 9" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <KindChip post={post} />
          {formatDate(post.date) && (
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-50)' }}>{formatDate(post.date)}</span>
          )}
        </div>
        <h3 className="display-sm" style={{ fontSize: 'clamp(1.15rem, 1.5vw + 0.4rem, 1.45rem)', margin: 0 }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'var(--ink-70)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.excerpt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 8 }}>
          <Byline post={post} size="sm" />
          <span
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.86rem',
              fontWeight: 600,
              color: ORANGE
            }}
          >
            View <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

function FinalCTA() {
  return (
    <section data-track-location="resources_final_cta" style={{ padding: 'var(--section) 0' }}>
      <Container>
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
            <h2 className="display-lg" style={{ margin: '20px 0 0', color: 'var(--white)' }}>
              See your AI visibility score.
            </h2>
            <p className="lead" style={{ color: 'rgba(255,255,255,0.72)', marginTop: 24, maxWidth: 520 }}>
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
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Composer
// ---------------------------------------------------------------------------
export default function ResourcesContent({ posts = [] }: { posts?: ResourcePost[] }) {
  const [active, setActive] = useState<Filter>('all')

  // Newest first.
  const sorted = useMemo(() => [...posts].sort((a, b) => (a.date < b.date ? 1 : -1)), [posts])

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

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const empty = sorted.length === 0

  return (
    <>
      {/* HERO — tight top, no bottom padding so it hugs the content below (the
          next section supplies the gap); the XL padding left dead whitespace. */}
      <Section tight className="relative overflow-hidden !pb-0">
        <Container>
          <div style={{ maxWidth: 820 }}>
            <Eyebrow>Guides &amp; Downloads</Eyebrow>
            <h1 className="display-lg text-balance" style={{ marginTop: 16 }}>
              Playbook, Study &amp; Report.
            </h1>
            <p className="lead mt-7" style={{ maxWidth: 640, color: 'var(--ink-70)' }}>
              Practical material on AI visibility, GEO, and answer-engine optimization. Pick what fits
              your team and download it in a couple of clicks.
            </p>
            {!empty && (
              <div className="mt-9">
                <FilterBar active={active} onChange={setActive} counts={counts} />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {empty ? (
        <Section tight className="!pb-0">
          <Container>
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
          </Container>
        </Section>
      ) : featured ? (
        <>
          <FeaturedCard post={featured} />

          {/* GRID -------------------------------------------------------- */}
          <Section tight className="!pb-0">
            <Container>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  paddingBottom: 28,
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div>
                  <Eyebrow>Latest</Eyebrow>
                  <h2 className="display-sm" style={{ margin: '12px 0 0' }}>
                    {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}
                  </h2>
                </div>
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
              {rest.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    border: '1px dashed var(--line)',
                    borderRadius: 22,
                    color: 'var(--ink-60)'
                  }}
                >
                  That is the only resource in this filter so far. More on the way.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((post) => (
                    <ResourceCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </Container>
          </Section>
        </>
      ) : (
        <Section tight className="!pb-0">
          <Container>
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
          </Container>
        </Section>
      )}

      <FinalCTA />
    </>
  )
}
