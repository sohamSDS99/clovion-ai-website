import Link from 'next/link'
import type { ReactNode } from 'react'
import { Section, Container, Eyebrow, ArrowRight } from '@/components/ui'

// Canonical header for any CMS post template (blog, news, … ). The cover image
// ALWAYS renders directly below the title — never below the excerpt/meta. Every
// `[slug]` template must use this so the layout can't drift per content type
// (that drift is exactly what put the blog cover in the wrong place before).
export function PostHeader({
  eyebrow,
  title,
  coverImageUrl,
  excerpt,
  meta,
  backHref,
  backLabel = 'Back',
  accentColor,
  coverFit = 'cover'
}: {
  eyebrow: string
  title: string
  coverImageUrl?: string | null
  excerpt?: string | null
  meta?: ReactNode
  backHref?: string
  backLabel?: string
  // When set, the eyebrow renders in this color (e.g. brand orange on light
  // blog articles). Omitted → default token color, so news stays unaffected.
  accentColor?: string
  // How the cover fills the 16:9 frame. 'cover' (default) crops to fill —
  // right for photographic blog/news covers. 'contain' fits the whole image
  // (letterboxed on the dark frame) — right for wide branded graphics (e.g.
  // research report covers) that must not crop.
  coverFit?: 'cover' | 'contain'
}) {
  return (
    <Section className="relative overflow-hidden">
      <Container>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-60)] transition-colors hover:text-[var(--ink)]"
          >
            <ArrowRight className="rotate-180" /> {backLabel}
          </Link>
        )}

        {/* Title, cover, and excerpt share ONE column width (max-w-4xl) so their
            left/right edges line up — a misaligned full-bleed cover over a
            narrow title/excerpt is exactly what read as unprofessional. */}

        {/* 1 — eyebrow + title + byline (date · author). Standard editorial
            order: the byline sits directly under the title — never below the
            body/excerpt. */}
        <div className={`mx-auto max-w-4xl text-center ${backHref ? 'mt-8' : ''}`}>
          {accentColor ? (
            <span
              className="eyebrow"
              style={{ color: accentColor, display: 'inline-block' }}
            >
              {eyebrow}
            </span>
          ) : (
            <Eyebrow>{eyebrow}</Eyebrow>
          )}
          <h1
            className="display-md mt-5 text-balance"
            style={{ fontSize: 'clamp(2.25rem, 3vw + 1rem, 3.5rem)' }}
          >
            {title}
          </h1>
          {meta && <div className="mt-6 flex justify-center">{meta}</div>}
        </div>

        {/* 2 — cover/hero image, below the title + byline. Fixed 16:9 frame
            (aspect-ratio reserves the box → no layout shift; bounds height) +
            object-cover (fills the frame, no letterbox bars). Same contract as
            the index featured banner and grid cards so the three can't drift.
            Constrained to the shared column so it sits a touch smaller and
            aligned with the title/excerpt. */}
        {coverImageUrl && (
          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--ink-surface,#0a0a0f)]">
            {/* CMS-hosted on an external host → plain <img>, not next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={title}
              className={`block h-full w-full object-center ${coverFit === 'contain' ? 'object-contain' : 'object-cover'}`}
            />
            {/* Hairline on top of the image so a dark/broken cover still frames. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[24px]"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)' }}
            />
          </div>
        )}

        {/* 3 — excerpt / lead, after the hero image. Same width as the cover so
            the lead spans the full image edge; justified so both edges align
            with the cover frame. */}
        {excerpt && (
          <div className="mx-auto mt-8 max-w-4xl">
            <p className="lead text-justify text-[var(--ink-70)]">{excerpt}</p>
          </div>
        )}
      </Container>
    </Section>
  )
}
