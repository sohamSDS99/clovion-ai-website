'use client'

import { useMemo, useState } from 'react'
import { Section, Container, Eyebrow, ArrowRight } from '@/components/ui'
import { FeaturedCard, PostCard, type CardPost } from '@/components/cms/PostCards'

// ---------------------------------------------------------------------------
// Palette — homepage single source of truth (see memory: homepage-palette).
// Light page: warm off-white bg, white surfaces, ink text. Cards come from the
// shared CMS card system (components/cms/PostCards) so blog / research /
// resources render identically; only the filter bar + CTA are local.
// ---------------------------------------------------------------------------
const ORANGE = '#C2410C'
const ORANGE_BG = 'rgba(194, 65, 12, 0.08)'

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
  authorAvatar?: string | null
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

// Map a resource onto the shared CMS card shape. The category label prefers the
// CMS category name, then the classified kind, so untagged items still read.
function toCard(post: ResourcePost): CardPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categoryLabel: post.category ?? kindLabel(classifyKind(post)),
    author: post.author,
    authorAvatar: post.authorAvatar,
    date: post.date,
    coverImageUrl: post.coverImageUrl
  }
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
          <FeaturedCard post={toCard(featured)} hrefBase="/resources" />

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
                    <PostCard key={post.slug} post={toCard(post)} hrefBase="/resources" />
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
