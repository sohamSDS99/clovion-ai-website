'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Section, Container, Button, ArrowRight } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { CTABanner } from '@/components/sections'
import type { CmsCoverImage } from '@/lib/cms-types'

// Brand accents — homepage palette (single source of truth): warm off-white
// page, ink text, Clove orange as the primary accent, emerald reserved for the
// "method / verified data" signals that give a research page its authority.
const ORANGE = '#C2410C'
const EMERALD = '#047857'
const EMERALD_BG = 'rgba(4, 120, 87, 0.08)'
const EMERALD_BORDER = 'rgba(4, 120, 87, 0.22)'

// Reports come from the CMS RESOURCE type, filtered to research-type items in
// app/research/page.tsx and mapped into this card shape.
export type Report = {
  slug: string
  title: string
  excerpt: string
  category: string | null
  categorySlug: string | null
  author: string
  avatar?: string | null
  date: string
  coverImageUrl?: string | null
  coverImage?: CmsCoverImage | null
  tags: string[]
}

// Reports open on the dedicated, UNGATED research detail route (/research/[slug])
// — the report reads in full and downloads directly, with no email gate.
const reportHref = (slug: string) => `/research/${slug}`

function formatDate(iso: string) {
  if (!iso) return ''
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

// A short kind label for the report — the CMS category when set, otherwise
// inferred from the title so untagged reports still read as what they are.
function kindLabel(report: Report): string {
  if (report.category) return report.category
  const t = report.title.toLowerCase()
  if (/benchmark/.test(t)) return 'Benchmark'
  if (/\bindex\b/.test(t)) return 'Index'
  if (/study/.test(t)) return 'Study'
  if (/analysis/.test(t)) return 'Analysis'
  if (/report/.test(t)) return 'Report'
  return 'Report'
}

// Zero-padded issue number, journal-style (No. 01, No. 02 …).
function issueNo(rank: number) {
  return String(rank).padStart(2, '0')
}

// ── Cover ─────────────────────────────────────────────────────────────────
// Real cover when present; otherwise a warm, branded placeholder that reads as
// a research plate — a large italic kind letterform over a dotted-grid field.
//
// Cover images are report art at arbitrary aspect ratios, so the WHOLE graphic
// is ALWAYS shown with object-fit: CONTAIN — nothing is ever cropped, whatever
// the upload's ratio and whatever the card's size. The letterbox is filled by a
// blurred cover-fit copy of the same image, so there's no empty band either.
// This is deterministic: it does NOT depend on CMS-reported dimensions (which
// are often missing), so every future upload fits its card automatically.
// The aspect box reserves space before load, so this is CLS-free.
// Build a srcset from the CMS cover variants (320/768/1280) + the original so
// the browser fetches the smallest source that fills the card — the "dynamic
// optimization" that happens automatically for whatever the author uploads.
function coverSrcSet(cover: CmsCoverImage): string {
  const w = cover.width && cover.width > 0 ? cover.width : 1600
  return [
    cover.thumb ? `${cover.thumb} 320w` : null,
    cover.md ? `${cover.md} 768w` : null,
    cover.lg ? `${cover.lg} 1280w` : null,
    `${cover.url} ${w}w`
  ]
    .filter(Boolean)
    .join(', ')
}

function Cover({
  report,
  aspect,
  sizes
}: {
  report: Report
  aspect: string
  sizes: string
}) {
  const cover = report.coverImage ?? null
  const src = cover?.url ?? report.coverImageUrl ?? null
  if (src) {
    const srcSet = cover ? coverSrcSet(cover) : undefined
    // Always CONTAIN the whole graphic over a blurred fill — never crop. The
    // blurred backdrop always renders so the letterbox reads as intentional
    // regardless of the upload's aspect ratio.
    const fill = false
    return (
      <div className={aspect} style={{ position: 'relative', overflow: 'hidden', background: 'var(--subtle)' }}>
        {!fill && (
          // Blurred backdrop fills the letterbox with the image's own colors.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
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
        {/* Sharp image on top — fully visible (contain) or edge-to-edge (cover). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={report.title}
          loading="lazy"
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: fill ? 'cover' : 'contain',
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
  return (
    <div
      aria-hidden
      className={aspect}
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--subtle)', borderBottom: '1px solid var(--line)' }}
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
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
          {kindLabel(report)}
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
          Clovion Research
        </span>
      </div>
    </div>
  )
}

function KindChip({ report }: { report: Report }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 11px',
        borderRadius: 999,
        border: `1px solid ${EMERALD_BORDER}`,
        background: EMERALD_BG,
        color: EMERALD,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontWeight: 600
      }}
    >
      {kindLabel(report)}
    </span>
  )
}

function Byline({
  report,
  size = 'md',
  showDate = true
}: {
  report: Report
  size?: 'md' | 'sm'
  showDate?: boolean
}) {
  const avatar = size === 'md' ? 34 : 30
  const date = formatDate(report.date)
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
          fontSize: size === 'md' ? '0.76rem' : '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          flexShrink: 0,
          overflow: 'hidden'
        }}
      >
        {report.avatar ? (
          // The author's real photo when set; initials monogram otherwise.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.avatar}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          initials(report.author)
        )}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: size === 'md' ? '0.9rem' : '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
          {report.author}
        </span>
        {showDate && date && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-50)'
            }}
          >
            {date}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Featured (latest) report ────────────────────────────────────────────────
function FeaturedReport({ report, rank }: { report: Report; rank: number }) {
  return (
    <Section tight>
      <Container>
        <Link
          href={reportHref(report.slug)}
          className="research-featured group block"
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
              <Cover
                report={report}
                aspect="aspect-[16/9]"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
            </div>
            <div className="relative" style={{ overflow: 'hidden' }}>
              <div
                className="md:absolute md:inset-0"
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
                  <span style={{ color: ORANGE }}>Latest report</span>
                  <span aria-hidden style={{ height: 1, width: 24, background: 'var(--line)' }} />
                  <span style={{ color: 'var(--ink-50)' }}>No. {issueNo(rank)}</span>
                </div>
                <h2 className="display-sm" style={{ fontSize: 'clamp(1.5rem, 1.7vw + 0.5rem, 2.1rem)', lineHeight: 1.1, margin: 0 }}>
                  {report.title}
                </h2>
                {report.excerpt && (
                  <p
                    className="lead"
                    style={{
                      fontSize: '1.02rem',
                      margin: 0,
                      maxWidth: 640,
                      color: 'var(--ink-70)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {report.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 8 }}>
                  <Byline report={report} />
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
                    Read the report <ArrowRight className="research-arrow" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Container>
    </Section>
  )
}

// ── Report card (grid) ───────────────────────────────────────────────────────
function ReportCard({ report }: { report: Report }) {
  const date = formatDate(report.date)
  const catLower = (report.category ?? '').toLowerCase()
  const tags = (report.tags ?? []).filter((t) => t && t.toLowerCase() !== catLower).slice(0, 2)
  return (
    <Link
      href={reportHref(report.slug)}
      className="research-card group flex flex-col h-full"
      style={{
        borderRadius: 22,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Cover
          report={report}
          aspect="aspect-[16/10]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px', flex: 1 }}>
        <h3
          className="display-sm"
          style={{
            fontSize: 'clamp(1.15rem, 1.5vw + 0.4rem, 1.45rem)',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {report.title}
        </h3>
        {report.excerpt && (
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
            {report.excerpt}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto', paddingTop: 8 }}>
          <Byline report={report} size="sm" showDate={false} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {date && <span style={{ fontSize: '0.8rem', color: 'var(--ink-50)' }}>{date}</span>}
            {date && <span aria-hidden style={{ width: 1, height: 12, background: 'var(--line)' }} />}
            <KindChip report={report} />
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  color: 'var(--ink-60)',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Topic filter rail ─────────────────────────────────────────────────────────
// Route-free client filter over the distinct CMS categories present. Rendered
// only when there are at least two topics to switch between — otherwise a lone
// "All" chip is noise.
function TopicRail({
  topics,
  active,
  onChange
}: {
  topics: string[]
  active: string
  onChange: (t: string) => void
}) {
  const all = ['All', ...topics]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {all.map((t) => {
        const isActive = t === active
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            aria-pressed={isActive}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 38,
              padding: '0 18px',
              borderRadius: 999,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${isActive ? ORANGE : 'var(--line)'}`,
              background: isActive ? 'rgba(194, 65, 12, 0.07)' : 'var(--white)',
              color: isActive ? ORANGE : 'var(--ink-70)',
              transition: 'border-color .2s ease, color .2s ease, background .2s ease'
            }}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

// ── Research briefing signup ──────────────────────────────────────────────────
function BriefingBand() {
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
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: ORANGE
              }}
            >
              The research briefing
            </span>
            <h2 className="display-sm" style={{ margin: '16px 0 0', fontSize: 'clamp(1.6rem, 2.6vw + 0.4rem, 2.2rem)' }}>
              New research, straight to your inbox.
            </h2>
            <p className="lead" style={{ fontSize: '0.98rem', margin: '14px 0 0', maxWidth: 460, color: 'var(--ink-70)' }}>
              A short note whenever a new report ships — the headline finding, the method, and what it changes. No filler.
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
              htmlFor="research-briefing-email"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ink-50)' }}
            >
              Work email
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                id="research-briefing-email"
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
                {submitted ? 'Subscribed' : 'Get briefings'}
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
              <span aria-hidden style={{ opacity: 0.4 }}>·</span>
              <a href="mailto:research@clovion.ai" style={{ color: 'var(--ink-70)', textDecoration: 'none' }}>
                research@clovion.ai
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
    q: 'What is Clovion Research?',
    a: 'The Clovion Research team publishes original studies, benchmarks, and reports on generative engine optimization — how ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews retrieve, rank, and cite brands. Every report is built on first-party data, not scraped guesses.'
  },
  {
    q: 'Where does the data come from?',
    a: 'Aggregate, anonymized data from the brands we run scans for, plus controlled prompt experiments we run in-house across every major AI engine. Each report documents its sample size, dates, and method so the work is reproducible.'
  },
  {
    q: 'Can I cite or republish a Clovion Research report?',
    a: 'Short quotes with a link back are welcome. For full republication, charts, or methodology reuse, email research@clovion.ai with the outlet and intended use.'
  },
  {
    q: 'How often do you publish new research?',
    a: 'We publish when the data is ready, not on a fixed calendar. We would rather ship one report we can stand behind than a weekly recap — quiet stretches mean we are still measuring.'
  },
  {
    q: 'How is this different from the Clovion blog?',
    a: 'The blog covers playbooks, commentary, and how-tos. Clovion Research is the data itself — longer, methodology-first reports with original benchmarks you can download and cite.'
  }
]

export default function ResearchIndex({ reports = [] }: { reports?: Report[] }) {
  // De-dupe by slug, newest first — the canonical library order.
  const ordered = useMemo<Report[]>(() => {
    const seen = new Set<string>()
    const merged: Report[] = []
    for (const r of reports) {
      if (seen.has(r.slug)) continue
      seen.add(r.slug)
      merged.push(r)
    }
    return merged.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [reports])

  // Distinct topics for the filter rail (only worth showing with 2+).
  const topics = useMemo(() => {
    const set = new Set<string>()
    for (const r of ordered) if (r.category) set.add(r.category)
    return Array.from(set).sort()
  }, [ordered])

  const [topic, setTopic] = useState('All')
  const showRail = topics.length >= 2

  const visible = useMemo(() => {
    if (!showRail || topic === 'All') return ordered
    return ordered.filter((r) => r.category === topic)
  }, [ordered, topic, showRail])

  // Stable issue numbers keyed off the full library (newest = highest number),
  // so a report keeps its "No." regardless of the active filter.
  const rankOf = useMemo(() => {
    const total = ordered.length
    const map = new Map<string, number>()
    ordered.forEach((r, i) => map.set(r.slug, total - i))
    return map
  }, [ordered])

  const featured = visible[0]
  const rest = visible.slice(1)

  return (
    <>
      {/* HERO — masthead ------------------------------------------------------ */}
      <Section className="relative overflow-hidden !pt-[clamp(3.5rem,6vw,5rem)] !pb-[clamp(1.75rem,3vw,2.75rem)]">
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            opacity: 0.7,
            background:
              'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(194,65,12,0.06) 0%, rgba(10,10,15,0.02) 34%, transparent 70%)'
          }}
        />
        <Container>
          <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
            {/* Sized to land on two lines at desktop widths; text-balance evens
                the wrap. All-ink (no accent). */}
            <h1 className="display-lg text-balance" style={{ fontSize: 'clamp(1.9rem, 3.4vw + 0.4rem, 3.25rem)' }}>
              Insights into how AI engines discover, describe, and recommend brands.
            </h1>
            <p className="lead" style={{ maxWidth: 660, margin: '1.75rem auto 0', color: 'var(--ink-70)' }}>
              Studies, benchmarks, and first-party data from the Clovion Research team — how the major
              AI engines decide which brands to cite, and what actually moves the needle. Read the
              method, then download the report.
            </p>
            {showRail && (
              <div className="mt-9" style={{ display: 'flex', justifyContent: 'center' }}>
                <TopicRail topics={topics} active={topic} onChange={setTopic} />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {featured ? (
        <>
          <FeaturedReport report={featured} rank={rankOf.get(featured.slug) ?? ordered.length} />

          {rest.length > 0 && (
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
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        color: ORANGE
                      }}
                    >
                      The library
                    </span>
                    <h2 className="display-sm" style={{ margin: '12px 0 0' }}>
                      {visible.length} {visible.length === 1 ? 'report' : 'reports'}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((report) => (
                    <ReportCard key={report.slug} report={report} />
                  ))}
                </div>
              </Container>
            </Section>
          )}
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
                color: 'var(--ink-60)',
                background: 'var(--white)'
              }}
            >
              The first reports are in the works. Subscribe below and we will send them the day they ship.
            </div>
          </Container>
        </Section>
      )}

      <BriefingBand />

      <FAQAccordion headline="Frequently Asked Questions" items={FAQS} />

      <CTABanner
        sub="Reading is fine"
        heading="See your own AI visibility score."
        body="Free score in 60 seconds. Enter your domain and see how the major AI engines mention you, which competitors appear, and where to improve."
        primary="Get free score"
        primaryHref="/free-ai-visibility-score"
        secondary="Book a demo"
        secondaryHref="/contact"
      />
    </>
  )
}
