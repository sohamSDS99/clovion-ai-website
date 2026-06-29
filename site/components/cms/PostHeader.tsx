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
  backLabel = 'Back'
}: {
  eyebrow: string
  title: string
  coverImageUrl?: string | null
  excerpt?: string | null
  meta?: ReactNode
  backHref?: string
  backLabel?: string
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

        {/* 1 — eyebrow + title + byline (date · author). Standard editorial
            order: the byline sits directly under the title — never below the
            body/excerpt. */}
        <div className={`max-w-3xl ${backHref ? 'mt-8' : ''}`}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display-md mt-5 text-balance">{title}</h1>
          {meta && <div className="mt-6">{meta}</div>}
        </div>

        {/* 2 — cover/hero image, below the title + byline */}
        {coverImageUrl && (
          <div className="mt-8 overflow-hidden rounded-[24px] border border-[var(--line)]">
            {/* CMS-hosted on an external host → plain <img>, not next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImageUrl} alt={title} className="block h-auto w-full object-cover" />
          </div>
        )}

        {/* 3 — excerpt / lead, after the hero image */}
        {excerpt && (
          <div className="mt-8 max-w-3xl">
            <p className="lead text-[var(--ink-70)]">{excerpt}</p>
          </div>
        )}
      </Container>
    </Section>
  )
}
