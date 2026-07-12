'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Section, Container, Eyebrow, Button, ArrowRight } from '@/components/ui'

// Shared card primitives for the CMS index pages (blog + research + resources),
// so every index renders the SAME featured banner, grid card, byline,
// placeholder, and newsletter band — the look can't drift between them. Each
// card links under `hrefBase` (/blog, /research, /resources); the display
// category string is resolved by the caller into `categoryLabel`.

const ORANGE = '#C2410C'
const EMERALD = 'var(--positive)' // #047857

// Chip tones — the two homepage brand accents (orange = brand energy,
// emerald = positive/affordance). Callers pick per category; orange default.
const CHIP_TONES = {
  orange: { color: ORANGE, bg: 'rgba(194, 65, 12, 0.08)', border: 'rgba(194, 65, 12, 0.24)' },
  emerald: { color: EMERALD, bg: 'rgba(4, 120, 87, 0.08)', border: 'rgba(4, 120, 87, 0.22)' }
} as const

export type ChipTone = keyof typeof CHIP_TONES

export type CardPost = {
  slug: string
  title: string
  excerpt: string
  categoryLabel: string
  chipTone?: ChipTone
  author: string
  authorAvatar?: string | null
  date: string
  readTime?: string
  coverImageUrl?: string | null
}

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

// Cover renderer shared by ALL index cards (blog / research / resources) — the
// resources design: a 16:9 frame filled edge-to-edge (object-fit: cover, no
// letterboxing, no blur). Covers are authored as 16:9 card art, so a 16:9 frame
// shows the whole graphic with no crop. CLS-free: the aspect box reserves space
// before load. The on-top hairline frames dark/near-black covers so they still
// read as a bounded region.
function CoverImage({
  src,
  alt,
  aspectClass,
  bordered = false
}: {
  src: string
  alt: string
  aspectClass: string
  bordered?: boolean
}) {
  return (
    <div
      className={aspectClass}
      style={{
        position: 'relative',
        flexShrink: 0,
        overflow: 'hidden',
        background: 'var(--subtle)',
        borderBottom: bordered ? '1px solid var(--line)' : undefined
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      <span
        aria-hidden
        style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(10,10,15,0.08)', pointerEvents: 'none' }}
      />
    </div>
  )
}

// A small color-coded pill marking the post's category (the resources design,
// now global). Orange by default; emerald for "positive" categories (studies).
function Chip({ label, tone = 'orange' }: { label: string; tone?: ChipTone }) {
  const t = CHIP_TONES[tone]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 11px',
        borderRadius: 999,
        border: `1px solid ${t.border}`,
        background: t.bg,
        color: t.color,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontWeight: 600
      }}
    >
      {label}
    </span>
  )
}

// Light placeholder for posts with no cover image. A warm subtle panel with the
// category set large in ink at low opacity — no dark blocks on the light page.
function CoverPlaceholder({ post, bordered = false }: { post: CardPost; bordered?: boolean }) {
  return (
    <div
      aria-hidden
      className="aspect-[16/9]"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--subtle)',
        borderBottom: bordered ? '1px solid var(--line)' : undefined
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
          {post.categoryLabel.split(' ')[0].toUpperCase()}
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
          {post.categoryLabel}
        </span>
      </div>
    </div>
  )
}

function Byline({ post, size = 'md' }: { post: CardPost; size?: 'md' | 'sm' }) {
  const dim = size === 'md' ? 34 : 30
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {post.authorAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.authorAvatar}
          alt={post.author}
          style={{ width: dim, height: dim, borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <span
          style={{
            width: dim,
            height: dim,
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
      )}
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

export function FeaturedCard({
  post,
  hrefBase,
  cta = 'View resource'
}: {
  post: CardPost
  hrefBase: string
  cta?: string
}) {
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
        <Chip label={post.categoryLabel} tone={post.chipTone} />
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
            color: ORANGE
          }}
        >
          {cta} <ArrowRight />
        </span>
      </div>
    </div>
  )

  return (
    <Section tight className="!pb-0">
      <Container>
        <Link
          href={`${hrefBase}/${post.slug}`}
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
              {post.coverImageUrl ? (
                <CoverImage src={post.coverImageUrl} alt={post.title} aspectClass="aspect-[16/9]" />
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

export function PostCard({
  post,
  hrefBase,
  cta = 'View'
}: {
  post: CardPost
  hrefBase: string
  cta?: string
}) {
  return (
    <Link
      href={`${hrefBase}/${post.slug}`}
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
        <CoverImage src={post.coverImageUrl} alt={post.title} aspectClass="aspect-[16/9]" bordered />
      ) : (
        <CoverPlaceholder post={post} bordered />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Chip label={post.categoryLabel} tone={post.chipTone} />
          {formatDate(post.date) && (
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-50)' }}>{formatDate(post.date)}</span>
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
            {cta} <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

// Newsletter capture band — identical on blog + research; self-contained
// client form (no backend wired, matches the prior blog behaviour).
export function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <Section tight className="!pb-0">
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
              htmlFor="cms-newsletter-email"
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
                id="cms-newsletter-email"
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
