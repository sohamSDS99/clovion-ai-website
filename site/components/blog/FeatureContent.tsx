'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { TypingHeadline } from '@/components/home/TypingHeadline'
import {
  CONTAINER,
  DISPLAY_LG,
  DISPLAY_MD,
  DISPLAY_SM,
  LEAD,
  Eyebrow,
  ArrowRight,
  PlusIcon,
  useReveal,
  CTAButtons,
  trackCta
} from './utils'

type Category = 'all' | 'geo' | 'ai-search' | 'seo'

const CATEGORY_LABEL: Record<Exclude<Category, 'all'>, string> = {
  geo: 'GEO',
  'ai-search': 'AI Search',
  seo: 'SEO'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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

function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.5,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)'
        }}
      />
      <div style={{ ...CONTAINER, padding: '7rem 2rem 3.5rem' }}>
        <div style={{ maxWidth: 820 }}>
          <Eyebrow>Field notes</Eyebrow>
          <TypingHeadline
            as="h1"
            text="Research, playbooks, engineering notes."
            style={{
              ...DISPLAY_LG,
              fontSize: 'clamp(2rem, 4.2vw + 0.4rem, 3.4rem)',
              margin: '16px 0 0'
            }}
          />
          <p style={{ ...LEAD, maxWidth: 640, margin: '1.75rem 0 0' }}>
            How AI engines decide who to cite — and how to win citations back. The patterns we see across customer data, written up before they become folklore.
          </p>
        </div>
      </div>
    </section>
  )
}

function ChipRail({
  active,
  onChange,
  counts
}: {
  active: Category
  onChange: (next: Category) => void
  counts: Record<Category, number>
}) {
  const chips: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'geo', label: 'GEO' },
    { key: 'ai-search', label: 'AI Search' },
    { key: 'seo', label: 'SEO' }
  ]
  return (
    <section style={{ padding: '2rem 0 1rem' }}>
      {/* Top padding separates the filter rail from the featured card above it
          (the featured section has 0 bottom padding, so they'd otherwise touch). */}
      <div style={CONTAINER}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            paddingBottom: 8
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--ink-50)',
              marginRight: 4
            }}
          >
            Filter
          </span>
          {chips.map((c) => {
            const isActive = active === c.key
            return (
              <button
                key={c.key}
                onClick={() => onChange(c.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: isActive ? '1px solid var(--white)' : '1px solid var(--line)',
                  background: isActive ? 'var(--white)' : 'transparent',
                  color: isActive ? 'var(--ink-surface, #0a0a0f)' : 'var(--ink-70)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  transition: 'all .2s ease'
                }}
              >
                <span>{c.label}</span>
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    color: isActive ? 'var(--ink-50)' : 'var(--ink-50)',
                    opacity: 0.75
                  }}
                >
                  {counts[c.key]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Card shape the composer renders. CMS posts are mapped into this shape and
// merged with the curated blogPosts; tag/readTime/role are optional because
// CMS summaries may not carry them.
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

function FeaturedCard({ post }: { post: Post }) {
  const { ref, seen } = useReveal<HTMLDivElement>()

  // Text block is shared by both layouts (banner-on-top when a cover exists,
  // side-by-side placeholder otherwise) so the two paths can't drift.
  const textBlock = (
    <div style={{ padding: 'clamp(2rem, 4vw, 3.25rem)', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--ink-60)'
        }}
      >
        <span>Featured</span>
        <span style={{ height: 1, width: 24, background: 'var(--ink-25, rgba(255,255,255,0.24))' }} />
        <span>{categoryLabel(post.category)}</span>
      </div>
      <h2 style={{ ...DISPLAY_MD, margin: 0 }}>{post.title}</h2>
      <p
        style={{
          ...LEAD,
          fontSize: '1.02rem',
          margin: 0,
          maxWidth: 640,
          // Clamp so the text column never exceeds the image's 16:9 height in the
          // side-by-side layout (which would stretch & crop the cover).
          display: '-webkit-box',
          WebkitLineClamp: 3,
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
          marginTop: 'auto'
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: 'var(--ink-surface, #0a0a0f)',
            color: 'var(--on-ink, #fff)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.76rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}
        >
          {initials(post.author)}
        </span>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-60)'
          }}
        >
          <span style={{ color: 'var(--ink)' }}>{post.author}</span>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
          <span>{formatDate(post.date)}</span>
          {post.readTime && (
            <>
              <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
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
    <section style={{ padding: '1.5rem 0 0' }}>
      <div style={CONTAINER}>
        <div
          ref={ref}
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? 'translateY(0)' : 'translateY(12px)',
            // Literal easing — a var(--*) inside a transition shorthand is
            // dropped by React's style serialization, killing the animation.
            transition: 'opacity .55s ease, transform .55s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <Link
            href={`/blog/${post.slug}`}
            onClick={() => trackCta('Featured post', 'blog_featured')}
            style={{
              position: 'relative',
              display: 'block',
              borderRadius: 28,
              border: '1px solid var(--line)',
              background: 'var(--white)',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            {post.coverImageUrl ? (
              // Side-by-side, picture-dominant: image LEFT (~60%, the 1.5fr
              // track), text RIGHT (~40%, the 1fr track). The image sits in a
              // fixed 16:9 frame — object-fit:cover fills it with no bars and the
              // aspect-ratio reserves the box before load (no CLS). The image's
              // 16:9 height drives the card; the excerpt is line-clamped so the
              // text column stays within that height — the cover is neither
              // stretched/cropped nor leaves an empty gap. inset hairline keeps a
              // dark/near-black cover framed and gives a clean seam to the text.
              // On mobile the grid collapses to one column: image on top.
              <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr]">
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    background: 'var(--ink-surface, #0a0a0f)'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <span
                    aria-hidden
                    style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)', pointerEvents: 'none' }}
                  />
                </div>
                {textBlock}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr]" style={{ position: 'relative' }}>
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.35,
                    backgroundImage: 'radial-gradient(circle at 88% 8%, rgba(255,255,255,0.04) 0%, transparent 55%)'
                  }}
                />
                {textBlock}
                <div
                  aria-hidden
                  style={{
                    position: 'relative',
                    minHeight: 240,
                    background: 'var(--ink-surface, #0a0a0f)',
                    borderLeft: '1px solid var(--on-ink-15, rgba(255,255,255,0.08))',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.5,
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
                      backgroundSize: '18px 18px'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontWeight: 600,
                        fontSize: 'clamp(5rem, 12vw, 11rem)',
                        lineHeight: 0.85,
                        letterSpacing: '-0.04em',
                        color: 'var(--on-ink, #fff)',
                        opacity: 0.92,
                        userSelect: 'none'
                      }}
                    >
                      {categoryLabel(post.category).split(' ')[0].toUpperCase()}
                    </span>
                    <span
                      style={{
                        marginTop: 18,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.32em',
                        color: 'var(--on-ink-50, rgba(255,255,255,0.55))'
                      }}
                    >
                      Volume 01 · {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Link>
        </div>
      </div>
    </section>
  )
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const { ref, seen } = useReveal<HTMLDivElement>()
  const delay = (index % 3) * 70
  return (
    <div
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(10px)',
        // Literal easing — var(--*) in a transition shorthand is dropped by React.
        transition: `opacity .5s ease ${delay}ms, transform .5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        height: '100%'
      }}
    >
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 22,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        transition: 'border-color .25s ease',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ink-25, rgba(255,255,255,0.24))'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--line)'
      }}
    >
      {post.coverImageUrl && (
        <div
          style={{
            position: 'relative',
            // 4:3 (taller than 16:9) so the picture DOMINATES the card vertically
            // — the larger share goes to the image, the text block below is kept
            // compact. flexShrink:0 holds that share when the grid stretches a
            // card to match a taller sibling.
            aspectRatio: '4 / 3',
            flexShrink: 0,
            overflow: 'hidden',
            background: 'var(--ink-surface, #0a0a0f)',
            borderBottom: '1px solid var(--line)'
          }}
        >
          {/* Reserves space → no CLS, bounds height → no portrait blowup;
              object-fit:cover fills the frame (no bars). Same cover contract as
              the featured card and detail hero. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt={post.title}
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Hairline on top of the image so a dark/broken cover still frames. */}
          <span
            aria-hidden
            style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)', pointerEvents: 'none' }}
          />
        </div>
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
          letterSpacing: '0.16em',
          color: 'var(--ink-50)'
        }}
      >
        <span style={{ color: 'var(--ink-70)' }}>{categoryLabel(post.category)}</span>
        {post.tag && (
          <>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{post.tag}</span>
          </>
        )}
      </div>
      <h3 style={{ ...DISPLAY_SM, fontSize: 'clamp(1.15rem, 1.5vw + 0.4rem, 1.45rem)', margin: 0 }}>{post.title}</h3>
      <p
        style={{
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: 'var(--ink-70)',
          margin: 0,
          // Compact text block: clamp the excerpt to 2 lines so the picture keeps
          // the larger share of the card.
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
          gap: 12,
          marginTop: 'auto',
          paddingTop: 8
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: 'var(--ink-surface, #0a0a0f)',
            color: 'var(--on-ink, #fff)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}
        >
          {initials(post.author)}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{post.author}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-50)'
            }}
          >
            {formatDate(post.date)}{post.readTime ? ` · ${post.readTime}` : ''}
          </span>
        </div>
        <span style={{ marginLeft: 'auto', color: 'var(--ink-60)', display: 'inline-flex' }}>
          <ArrowRight size={15} />
        </span>
      </div>
      </div>
    </Link>
    </div>
  )
}

function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <section style={{ padding: '2.5rem 0 var(--section)' }}>
      <div style={CONTAINER}>
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
            <h2 style={{ ...DISPLAY_SM, margin: '10px 0 0' }}>
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
        {posts.length === 0 ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              border: '1px dashed var(--line)',
              borderRadius: 22,
              color: 'var(--ink-60)'
            }}
          >
            Nothing here yet. Try another filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <section style={{ padding: 'var(--section-sm) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            padding: 'clamp(2rem, 4vw, 3.25rem)',
            borderRadius: 26,
            border: '1px solid var(--line)',
            background: 'var(--white)',
            display: 'grid',
            gap: 28,
            gridTemplateColumns: '1fr'
          }}
          className="md:grid-cols-[1.1fr_1fr]"
        >
          <div>
            <Eyebrow>Subscribe to research notes</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0', fontSize: 'clamp(1.6rem, 2.6vw + 0.4rem, 2.2rem)' }}>
              One short email a week.
            </h2>
            <p style={{ ...LEAD, fontSize: '0.98rem', margin: '14px 0 0', maxWidth: 460 }}>
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
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={submitted}
                className="btn btn-primary"
                style={{ minWidth: 130 }}
              >
                {submitted ? 'Subscribed' : 'Subscribe'}
              </button>
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
              <a
                href="/rss.xml"
                style={{ color: 'var(--ink-70)', textDecoration: 'none' }}
              >
                RSS feed
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
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
      <div style={{ overflow: 'hidden', maxHeight: open ? 240 : 0, transition: 'max-height .35s var(--ease-out-expo)' }}>
        <p style={{ margin: 0, padding: '0 48px 26px 0', fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>{a}</p>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>FAQ</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>Blog, answered.</h2>
            <p style={{ ...LEAD, fontSize: '0.96rem', margin: '18px 0 0', maxWidth: 360 }}>
              Cadence, sourcing, reuse, and how to send us something to publish.
            </p>
            <a
              href="mailto:research@clovion.ai"
              style={{
                marginTop: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none'
              }}
            >
              Email the research team <ArrowRight />
            </a>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const radialStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.6,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  }
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 3.5rem)'
          }}
        >
          <div aria-hidden style={radialStyle} />
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span style={{ color: 'var(--on-ink-70)' }}>
              <Eyebrow>Reading is fine</Eyebrow>
            </span>
            <h2 style={{ ...DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
              See your AI visibility score.
            </h2>
            <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 520 }}>
              Free score in 60 seconds. Enter your domain and see how the major AI engines mention you, which competitors appear, and where to improve.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <CTAButtons location="blog_final_cta" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FeatureContent({
  initialCategory = 'all',
  cmsPosts = []
}: {
  initialCategory?: Category
  cmsPosts?: Post[]
}) {
  const [active, setActive] = useState<Category>(initialCategory)

  // Only CMS-published posts are shown — each one maps to a real
  // /blog/[slug] detail page. (The old curated/demo posts were dropped: they
  // had no detail page and 404'd on click.) De-duped by slug, newest first.
  const sorted = useMemo<Post[]>(() => {
    const seen = new Set<string>()
    const merged: Post[] = []
    for (const p of cmsPosts) {
      if (seen.has(p.slug)) continue
      seen.add(p.slug)
      merged.push(p)
    }
    return merged.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [cmsPosts])

  const featured = sorted[0]
  const rest = sorted.slice(1)

  const counts = useMemo<Record<Category, number>>(() => {
    const c: Record<Category, number> = { all: rest.length, geo: 0, 'ai-search': 0, seo: 0 }
    rest.forEach((p) => {
      if (p.category === 'geo' || p.category === 'ai-search' || p.category === 'seo') {
        c[p.category]++
      }
    })
    return c
  }, [rest])

  const filtered = useMemo<Post[]>(() => {
    if (active === 'all') return rest
    return rest.filter((p) => p.category === active)
  }, [active, rest])

  if (!featured) {
    return (
      <>
        <Hero />
        <section style={{ padding: '1rem 0 var(--section)' }}>
          <div style={CONTAINER}>
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
          </div>
        </section>
        <NewsletterBand />
        <FAQ />
        <FinalCTA />
      </>
    )
  }

  return (
    <>
      <Hero />
      <FeaturedCard post={featured} />
      <ChipRail active={active} onChange={setActive} counts={counts} />
      <PostGrid posts={filtered} />
      <NewsletterBand />
      <FAQ />
      <FinalCTA />
    </>
  )
}
