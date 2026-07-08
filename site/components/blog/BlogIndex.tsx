'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Section, Container, Eyebrow, Button, ArrowRight } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { CTABanner } from '@/components/sections'

// Brand accent — pulled from the homepage palette (single source of truth):
// warm off-white page, ink text, Clove orange accent, emerald for positive.
const ORANGE = '#C2410C'

type Category = 'all' | 'geo' | 'ai-search' | 'seo'

const CATEGORY_LABEL: Record<Exclude<Category, 'all'>, string> = {
  geo: 'GEO',
  'ai-search': 'AI Search',
  seo: 'SEO'
}

// Route-driven category nav. /blog shows everything; each category page
// pre-filters. These are plain links (navigation), not a client filter.
const CATEGORY_NAV: { key: Category; label: string; href: string }[] = [
  { key: 'all', label: 'All', href: '/blog' },
  { key: 'geo', label: 'GEO', href: '/blog/category/geo' },
  { key: 'ai-search', label: 'AI Search', href: '/blog/category/ai-search' },
  { key: 'seo', label: 'SEO', href: '/blog/category/seo' }
]

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
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

function categoryLabel(slug: string): string {
  if (slug === 'geo' || slug === 'ai-search' || slug === 'seo') return CATEGORY_LABEL[slug]
  return slug
}

// Card shape the index renders. CMS summaries are mapped into this shape in
// app/blog/page.tsx (toPost).
export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime?: string
  tag?: string
  role?: string
  coverImageUrl?: string | null
}

// Light placeholder for posts with no cover image. A warm subtle panel with the
// category set large in ink at low opacity — no dark blocks on the light page.
function CoverPlaceholder({ post, tall = false }: { post: Post; tall?: boolean }) {
  return (
    <div
      aria-hidden
      className={tall ? 'aspect-[4/3]' : 'aspect-[16/9]'}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--subtle)',
        borderBottom: tall ? '1px solid var(--line)' : undefined
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage: 'radial-gradient(rgba(10,10,15,0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            opacity: 0.1,
            userSelect: 'none'
          }}
        >
          {categoryLabel(post.category).split(' ')[0].toUpperCase()}
        </span>
        <span
          style={{
            marginTop: 14,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: ORANGE
          }}
        >
          {categoryLabel(post.category)}
        </span>
      </div>
    </div>
  )
}

function Byline({ post, size = 'md' }: { post: Post; size?: 'md' | 'sm' }) {
  const avatar = size === 'md' ? 34 : 30
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          width: avatar,
          height: avatar,
          borderRadius: 999,
          background: ORANGE,
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size === 'md' ? '0.76rem' : '0.68rem',
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
          {post.readTime ? ` · ${post.readTime}` : ''}
        </span>
      </div>
    </div>
  )
}

function FeaturedCard({ post }: { post: Post }) {
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
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.18em'
        }}
      >
        <span style={{ color: ORANGE }}>Featured</span>
        <span style={{ height: 1, width: 24, background: 'var(--line)' }} />
        <span style={{ color: 'var(--ink-60)' }}>{categoryLabel(post.category)}</span>
      </div>
      <h2
        className="display-sm"
        style={{ fontSize: 'clamp(1.5rem, 1.7vw + 0.5rem, 2.1rem)', lineHeight: 1.1, margin: 0 }}
      >
        {post.title}
      </h2>
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 'auto',
          paddingTop: 8
        }}
      >
        <Byline post={post} />
        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--ink)'
          }}
        >
          Read story <ArrowRight />
        </span>
      </div>
    </div>
  )

  return (
    <Section tight>
      <Container>
        <Link
          href={`/blog/${post.slug}`}
          className="group block"
          style={{
            position: 'relative',
            borderRadius: 28,
            border: '1px solid var(--line)',
            background: 'var(--white)',
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr]">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {post.coverImageUrl ? (
                <div className="aspect-[16/9]" style={{ position: 'relative', overflow: 'hidden', background: 'var(--subtle)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
              ) : (
                <CoverPlaceholder post={post} />
              )}
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

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
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
      {post.coverImageUrl ? (
        <div
          className="aspect-[4/3]"
          style={{ position: 'relative', flexShrink: 0, overflow: 'hidden', background: 'var(--subtle)', borderBottom: '1px solid var(--line)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt={post.title}
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      ) : (
        <CoverPlaceholder post={post} tall />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px', flex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em'
          }}
        >
          <span style={{ color: ORANGE }}>{categoryLabel(post.category)}</span>
          {post.tag && (
            <>
              <span style={{ color: 'var(--ink-50)', opacity: 0.6 }}>·</span>
              <span style={{ color: 'var(--ink-50)' }}>{post.tag}</span>
            </>
          )}
        </div>
        <h3 className="display-sm" style={{ fontSize: 'clamp(1.15rem, 1.5vw + 0.4rem, 1.45rem)', margin: 0 }}>
          {post.title}
        </h3>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 8 }}>
          <Byline post={post} size="sm" />
          <span style={{ marginLeft: 'auto', color: 'var(--ink-60)', display: 'inline-flex' }}>
            <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

function CategoryRail({ active }: { active: Category }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {CATEGORY_NAV.map((c) => {
        const isActive = c.key === active
        return (
          <Link
            key={c.key}
            href={c.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 38,
              padding: '0 18px',
              borderRadius: 999,
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: `1px solid ${isActive ? ORANGE : 'var(--line)'}`,
              background: isActive ? 'rgba(194, 65, 12, 0.07)' : 'var(--white)',
              color: isActive ? ORANGE : 'var(--ink-70)',
              transition: 'border-color .2s ease, color .2s ease'
            }}
          >
            {c.label}
          </Link>
        )
      })}
    </div>
  )
}

function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <Section tight>
      <Container>
        <div
          className="md:grid-cols-[1.1fr_1fr]"
          style={{
            padding: 'clamp(2rem, 4vw, 3.25rem)',
            borderRadius: 26,
            border: '1px solid var(--line)',
            background: 'var(--white)',
            display: 'grid',
            gap: 28,
            gridTemplateColumns: '1fr'
          }}
        >
          <div>
            <Eyebrow>Subscribe to research notes</Eyebrow>
            <h2 className="display-sm" style={{ margin: '16px 0 0', fontSize: 'clamp(1.6rem, 2.6vw + 0.4rem, 2.2rem)' }}>
              One short email a week.
            </h2>
            <p className="lead" style={{ fontSize: '0.98rem', margin: '14px 0 0', maxWidth: 460, color: 'var(--ink-70)' }}>
              New patterns from engine logs, the schema fixes that shipped lift, and a short take on what changed in AI search.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!email) return
              setSubmitted(true)
            }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}
          >
            <label
              htmlFor="blog-newsletter-email"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--ink-50)'
              }}
            >
              Work email
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                id="blog-newsletter-email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitted}
                style={{
                  flex: '1 1 220px',
                  minWidth: 0,
                  height: 48,
                  padding: '0 18px',
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Button type="submit" disabled={submitted} style={{ minWidth: 130 }}>
                {submitted ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--ink-50)',
                marginTop: 4
              }}
            >
              <span>No spam. Unsubscribe in one click.</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <a href="/rss.xml" style={{ color: 'var(--ink-70)', textDecoration: 'none' }}>
                RSS feed
              </a>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  )
}

const FAQS = [
  {
    q: 'How often does Clovion publish?',
    a: 'A new piece ships most weeks. We prioritize research with real data over news recaps, so cadence flexes — quiet weeks mean we are still measuring, not that nothing happened.'
  },
  {
    q: 'Can I republish or cite Clovion research?',
    a: 'Short quotes with a link back are welcome. For full republication, charts, or methodology reuse, email research@clovion.ai with the outlet and intended use.'
  },
  {
    q: 'Where do the data and benchmarks come from?',
    a: 'Aggregate, anonymized data from the customer base we run scans for, plus controlled prompt experiments we run in-house across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.'
  },
  {
    q: 'How do I pitch a guest post?',
    a: 'Send a one-paragraph outline and a writing sample to research@clovion.ai. We publish a handful of guest pieces a year, mostly from practitioners with first-party data to share.'
  },
  {
    q: 'Is there an RSS feed?',
    a: 'Yes. /rss.xml carries every post, oldest to newest, with full excerpts. The weekly email covers the same posts plus short commentary you will not find on the site.'
  }
]

export default function BlogIndex({
  initialCategory = 'all',
  cmsPosts = []
}: {
  initialCategory?: Category
  cmsPosts?: Post[]
}) {
  // De-dupe by slug, newest first, then filter to the route's category.
  const posts = useMemo<Post[]>(() => {
    const seen = new Set<string>()
    const merged: Post[] = []
    for (const p of cmsPosts) {
      if (seen.has(p.slug)) continue
      seen.add(p.slug)
      merged.push(p)
    }
    const sorted = merged.sort((a, b) => (a.date < b.date ? 1 : -1))
    if (initialCategory === 'all') return sorted
    return sorted.filter((p) => p.category === initialCategory)
  }, [cmsPosts, initialCategory])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      {/* HERO ------------------------------------------------------------- */}
      <Section className="section-y-xl relative overflow-hidden">
        <Container>
          <div style={{ maxWidth: 820 }}>
            <h1 className="display-lg text-balance">
              Blogs, Articles &amp; Industry <span style={{ color: ORANGE }}>Insights</span>.
            </h1>
            <p className="lead mt-7" style={{ maxWidth: 640, color: 'var(--ink-70)' }}>
              How AI engines decide who to cite — and how to win citations back. The patterns we see
              across customer data, written up before they become folklore.
            </p>
            <div className="mt-9">
              <CategoryRail active={initialCategory} />
            </div>
          </div>
        </Container>
      </Section>

      {featured ? (
        <>
          <FeaturedCard post={featured} />

          {/* POST GRID -------------------------------------------------- */}
          <Section tight>
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
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
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
                  That is the only post in this category so far. More on the way.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </Container>
          </Section>
        </>
      ) : (
        <Section tight>
          <Container>
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                border: '1px dashed var(--line)',
                borderRadius: 22,
                color: 'var(--ink-60)'
              }}
            >
              Nothing published yet. Check back soon.
            </div>
          </Container>
        </Section>
      )}

      <NewsletterBand />

      <FAQAccordion headline="Frequently Asked Questions" items={FAQS} />

      <CTABanner
        sub="Reading is fine"
        heading="See your AI visibility score."
        body="Free score in 60 seconds. Enter your domain and see how the major AI engines mention you, which competitors appear, and where to improve."
        primary="Get free score"
        primaryHref="/free-ai-visibility-score"
        secondary="Book a demo"
        secondaryHref="/contact"
      />
    </>
  )
}
