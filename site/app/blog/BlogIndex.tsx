'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Section, Container, Button, Eyebrow, ArrowRight, HeroShade } from '@/components/ui'
import { blogPosts } from '@/lib/content'

// ---------------------------------------------------------------------------
// Tag bar — three primary GEO categories from `blogCategories` plus three
// editorial tag-only buckets (Research / Engineering / Product) that filter
// client-side without their own route.
// ---------------------------------------------------------------------------

const tagBar = [
  { key: 'all', label: 'All', href: null },
  { key: 'geo', label: 'GEO', href: '/blog/category/geo' },
  { key: 'ai-search', label: 'AI Search', href: '/blog/category/ai-search' },
  { key: 'seo', label: 'SEO', href: '/blog/category/seo' },
  { key: 'research', label: 'Research', href: null },
  { key: 'engineering', label: 'Engineering', href: null },
  { key: 'product', label: 'Product', href: null }
] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function categoryLabel(slug: string) {
  if (slug === 'geo') return 'GEO'
  if (slug === 'ai-search') return 'AI Search'
  if (slug === 'seo') return 'SEO'
  return slug
}

function isResearch(tag: string) {
  return tag === 'Research' || tag === 'Foundational'
}
function isEngineering(tag: string) {
  return tag === 'Engineering'
}
function isProduct(tag: string) {
  return tag === 'Playbook' || tag === 'Opinion'
}

// Hero glyph: a single short word pulled from the featured title, rendered
// as italic-serif at display scale. The blueprint specifically asks for
// `ZERO` on "The Zero-Click Economy"; this generalizes that pattern.
function heroGlyph(title: string) {
  const upper = title.toUpperCase()
  if (upper.includes('ZERO')) return 'ZERO'
  if (upper.includes('GEO')) return 'GEO'
  if (upper.includes('SEO')) return 'SEO'
  if (upper.includes('META')) return 'META'
  if (upper.includes('AI MODE')) return 'MODE'
  if (upper.includes('AI')) return 'AI'
  return title.split(' ')[0].toUpperCase().slice(0, 5)
}

const PAGE_SIZE = 10

export default function BlogIndex() {
  const [activeTag, setActiveTag] = useState<string>('all')
  const [visible, setVisible] = useState<number>(PAGE_SIZE)

  // Reverse-chronological once
  const sorted = useMemo(() => {
    return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [])

  const featured = sorted[0]
  const rest = sorted.slice(1)

  const filtered = useMemo(() => {
    if (activeTag === 'all') return rest
    if (activeTag === 'geo' || activeTag === 'ai-search' || activeTag === 'seo') {
      return rest.filter((p) => p.category === activeTag)
    }
    if (activeTag === 'research') return rest.filter((p) => isResearch(p.tag))
    if (activeTag === 'engineering') return rest.filter((p) => isEngineering(p.tag))
    if (activeTag === 'product') return rest.filter((p) => isProduct(p.tag))
    return rest
  }, [activeTag, rest])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const onTagClick = (key: string) => {
    setActiveTag(key)
    setVisible(PAGE_SIZE)
  }

  return (
    <>
      {/* -----------------------------------------------------------------
          Section 1 — Hero (matches customers / features pattern)
          ----------------------------------------------------------------- */}
      <Section className="relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>FIELD NOTES</Eyebrow>
            <h1 className="display-md mt-5">Notes from the frontier.</h1>
            <p className="lead mt-6 text-ink/70">
              Research, playbooks, and engineering notes from inside the GEO category.
              We publish what we learn from the dashboards our customers run on.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/pricing" trackLocation="blog_hero" variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button href="/free-ai-visibility-score" trackLocation="blog_hero" variant="secondary" size="lg">
                Get Free Score
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          Section 1.5 — Featured post (moved out of the hero)
          ----------------------------------------------------------------- */}
      <Section bg="subtle" className="border-b border-line">
        <Container>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block overflow-hidden rounded-3xl border border-line bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left — copy block (55%) */}
              <div className="flex flex-col justify-between gap-10 p-8 md:col-span-7 md:p-12 lg:p-16">
                <div>
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                    <span>Featured</span>
                    <span className="h-px w-6 bg-ink/30" />
                    <span>/{categoryLabel(featured.category)}</span>
                  </div>
                  <h2 className="display-lg mt-6 text-ink transition-colors group-hover:text-black">
                    {featured.title}
                  </h2>
                  <p className="lead mt-6 max-w-xl text-ink/70">{featured.excerpt}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[11px] font-semibold tracking-wide text-white">
                      {initials(featured.author)}
                    </span>
                    <div className="font-mono text-xs uppercase tracking-widest text-ink/60">
                      <span className="text-ink">{featured.author}</span>
                      <span className="mx-2 text-ink/30">·</span>
                      <span>{formatDate(featured.date)}</span>
                      <span className="mx-2 text-ink/30">·</span>
                      <span>{featured.readTime}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-all group-hover:gap-3">
                    Read story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Right — hero glyph artwork (45%) */}
              <div className="relative flex items-center justify-center overflow-hidden border-t border-line bg-ink p-10 md:col-span-5 md:border-l md:border-t-0">
                {/* dot grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
                    backgroundSize: '18px 18px'
                  }}
                />
                {/* monochrome wash */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-neutral-800 to-neutral-600 opacity-90" />
                <div className="relative flex flex-col items-center justify-center text-center">
                  <span
                    className="select-none font-serif italic text-white"
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(7rem, 16vw, 18rem)',
                      lineHeight: 0.85,
                      letterSpacing: '-0.04em'
                    }}
                  >
                    {heroGlyph(featured.title)}
                  </span>
                  <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                    Volume 01 · {formatDate(featured.date)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          Section 2 — Horizontal tag bar (sticky)
          ----------------------------------------------------------------- */}
      <div className="sticky top-16 z-20 border-b border-line bg-bg/95 backdrop-blur">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="mr-2 hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40 md:inline">
              Filter
            </span>
            {tagBar.map((t) => {
              const active = activeTag === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => onTagClick(t.key)}
                  className={[
                    'shrink-0 rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-all',
                    active
                      ? 'bg-black text-white'
                      : 'border border-line bg-white text-ink/70 hover:border-ink/40 hover:text-ink'
                  ].join(' ')}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </Container>
      </div>

      {/* -----------------------------------------------------------------
          Section 3 — Post list
          ----------------------------------------------------------------- */}
      <Section className="section-y">
        <Container>
          <div className="flex items-end justify-between pb-10">
            <div className="font-mono text-xs uppercase tracking-widest text-ink/50">
              {filtered.length} post{filtered.length === 1 ? '' : 's'}
              {activeTag !== 'all' && (
                <>
                  <span className="mx-2 text-ink/30">·</span>
                  <span className="text-ink/70">
                    {tagBar.find((t) => t.key === activeTag)?.label}
                  </span>
                </>
              )}
            </div>
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40 md:block">
              Newest first
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-16 text-center">
              <h3 className="display-sm text-ink">Nothing here yet</h3>
              <p className="lead mt-3 text-ink/60">
                No posts under this filter. Try another tag, or read everything.
              </p>
              <Button
                onClick={() => onTagClick('all')}
                variant="secondary"
                className="mt-6"
              >
                Show all posts
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {shown.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid grid-cols-1 gap-6 py-10 transition-colors md:grid-cols-12 md:gap-10"
                  >
                    {/* Left meta column — author + date + category */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-semibold tracking-wide text-white">
                          {initials(post.author)}
                        </span>
                        <div className="text-sm">
                          <div className="font-semibold text-ink">{post.author}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
                            {post.role.split(',')[0]}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                        <span>{formatDate(post.date)}</span>
                        <span className="h-px w-4 bg-ink/20" />
                        <span className="text-ink/70">/{categoryLabel(post.category)}</span>
                      </div>
                    </div>

                    {/* Right content column */}
                    <div className="md:col-span-9">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                        <span className="rounded-full border border-line bg-white px-2.5 py-1 text-ink/70">
                          {post.tag}
                        </span>
                        <span>{post.readTime} read</span>
                      </div>
                      <h3 className="display-sm mt-4 text-ink transition-colors group-hover:text-black">
                        {post.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-ink/70">{post.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-all group-hover:gap-3">
                        Read story <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* ---------------------------------------------------------------
              Section 4 — Load more
              --------------------------------------------------------------- */}
          {hasMore && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <Button variant="ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more posts
              </Button>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">
                Showing {shown.length} of {filtered.length}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          Section 5 — Newsletter band
          ----------------------------------------------------------------- */}
      <Section bg="subtle" className="section-y border-t border-line">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="eyebrow text-ink/60">Newsletter</div>
              <h2 className="display-md mt-3 text-ink">The GEO Briefing, weekly.</h2>
              <p className="lead mt-3 max-w-xl text-ink/70">
                Research, benchmarks, fixes. One email Friday morning. About three minutes to read.
              </p>
            </div>
            <form
              className="md:col-span-5"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                Work email
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-12 flex-1 rounded-full border border-line bg-white px-5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
                />
                <Button variant="primary" type="submit">
                  Subscribe
                </Button>
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
                No spam. Unsubscribe in one click.
              </p>
            </form>
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          Section 6 — Subtle CTA band (dark)
          ----------------------------------------------------------------- */}
      <Section bg="ink" className="section-y-sm">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="display-sm text-white">
                Reading is fine. Seeing your score is better.
              </h3>
              <p className="mt-2 max-w-xl text-white/60">
                A two-minute scan returns your visibility across the major AI engines,
                scored against your competitors.
              </p>
            </div>
            <Button href="/free-ai-visibility-score" trackLocation="blog_footer_cta" variant="invert">
              Get Free Score
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
