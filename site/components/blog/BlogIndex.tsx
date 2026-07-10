'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Section, Container, Eyebrow } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { CTABanner } from '@/components/sections'
import { FeaturedCard, PostCard, NewsletterBand, type CardPost } from '@/components/cms/PostCards'

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

function categoryLabel(slug: string): string {
  if (slug === 'geo' || slug === 'ai-search' || slug === 'seo') return CATEGORY_LABEL[slug]
  return slug
}

// Card shape the index renders. CMS summaries are mapped into this shape in
// app/blog/page.tsx (toPost). Category is the CMS slug (used for filtering);
// it's resolved to a display label when mapped into the shared card.
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

function toCard(post: Post): CardPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categoryLabel: categoryLabel(post.category),
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    tag: post.tag,
    coverImageUrl: post.coverImageUrl
  }
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
          <FeaturedCard post={toCard(featured)} hrefBase="/blog" />

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
                    <PostCard key={post.slug} post={toCard(post)} hrefBase="/blog" />
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
