'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Section, Container, Eyebrow, Button, ArrowRight } from '@/components/ui'

// Shared card primitives for the CMS index pages (blog + research). Extracted
// from BlogIndex so both indexes render the SAME featured banner, grid card,
// byline, placeholder, and newsletter band — the look can't drift between them.
// Each card links under `hrefBase` (/blog or /research); the display category
// string is resolved by the caller into `categoryLabel`.

const ORANGE = '#C2410C'

export type CardPost = {
  slug: string
  title: string
  excerpt: string
  categoryLabel: string
  author: string
  date: string
  readTime?: string
  tag?: string
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

// Cover renderer shared by both cards. Default fit='cover' fills the frame edge
// to edge (the blog's landscape heroes — clean, no bars). fit='contain' shows
// the WHOLE graphic over a blurred same-image fill, so nothing is ever cropped
// whatever the upload's aspect ratio or the card's size — used by /research,
// whose report art is text-heavy and off-ratio. This is deterministic: it does
// not depend on CMS-reported dimensions, so every future upload fits its card
// automatically. The aspect box reserves space before load → CLS-free.
function CoverImage({
  src,
  alt,
  aspectClass,
  fit = 'cover',
  bordered = false
}: {
  src: string
  alt: string
  aspectClass: string
  fit?: 'cover' | 'contain'
  bordered?: boolean
}) {
  const contain = fit === 'contain'
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
      {contain && (
        // Blurred backdrop fills the letterbox with the image's own colours.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'blur(28px)',
            transform: 'scale(1.15)'
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: contain ? 'contain' : 'cover',
          objectPosition: 'center'
        }}
      />
    </div>
  )
}

// Light placeholder for posts with no cover image. A warm subtle panel with the
// category set large in ink at low opacity — no dark blocks on the light page.
function CoverPlaceholder({ post, tall = false }: { post: CardPost; tall?: boolean }) {
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

export function FeaturedCard({
  post,
  hrefBase,
  fit = 'cover'
}: {
  post: CardPost
  hrefBase: string
  fit?: 'cover' | 'contain'
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
        <span style={{ color: 'var(--ink-60)' }}>{post.categoryLabel}</span>
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
            color: 'inherit'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr]">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {post.coverImageUrl ? (
                <CoverImage src={post.coverImageUrl} alt={post.title} aspectClass="aspect-[16/9]" fit={fit} />
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
  fit = 'cover'
}: {
  post: CardPost
  hrefBase: string
  fit?: 'cover' | 'contain'
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
        <CoverImage src={post.coverImageUrl} alt={post.title} aspectClass="aspect-[4/3]" fit={fit} bordered />
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
          <span style={{ color: ORANGE }}>{post.categoryLabel}</span>
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
