'use client'

import { useMemo } from 'react'
import { Section, Container, Eyebrow } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { CTABanner } from '@/components/sections'
import { FeaturedCard, PostCard, NewsletterBand, type CardPost } from '@/components/cms/PostCards'
import type { CmsCoverImage } from '@/lib/cms-types'

// Research index — same pattern as the blog index (hero → featured → grid →
// newsletter → FAQ → CTA) using the shared card primitives, so /research and
// /blog read as one system. Reports open on the ungated /research/[slug] route.
const ORANGE = '#C2410C'

// Reports come from the CMS RESEARCH type (plus research-flavoured RESOURCE
// items), mapped into this shape in app/research/page.tsx.
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

// A short kind label — the CMS category when set, otherwise inferred from the
// title so untagged reports still read as what they are.
function kindLabel(report: Report): string {
  if (report.category) return report.category
  const t = report.title.toLowerCase()
  if (/benchmark/.test(t)) return 'Benchmark'
  if (/study/.test(t)) return 'Study'
  if (/index/.test(t)) return 'Index'
  if (/analysis/.test(t)) return 'Analysis'
  return 'Report'
}

function toCard(report: Report): CardPost {
  return {
    slug: report.slug,
    title: report.title,
    excerpt: report.excerpt,
    categoryLabel: kindLabel(report),
    author: report.author,
    authorAvatar: report.avatar,
    date: report.date,
    coverImageUrl: report.coverImageUrl
  }
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
  // De-dupe by slug, newest first.
  const items = useMemo<Report[]>(() => {
    const seen = new Set<string>()
    const merged: Report[] = []
    for (const r of reports) {
      if (seen.has(r.slug)) continue
      seen.add(r.slug)
      merged.push(r)
    }
    return merged.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [reports])

  const featured = items[0]
  const rest = items.slice(1)

  return (
    <>
      {/* HERO — tight top, no bottom padding so it hugs the content below (the
          next section supplies the gap). The signature XL padding left too much
          dead space above the title and below the intro. */}
      <Section tight className="relative overflow-hidden !pb-0">
        <Container>
          <div style={{ maxWidth: 820 }}>
            <h1 className="display-lg text-balance">
              Clovion <span style={{ color: ORANGE }}>Research</span>.
            </h1>
            <p className="lead mt-7" style={{ maxWidth: 640, color: 'var(--ink-70)' }}>
              Original studies, benchmarks, and first-party data on how ChatGPT, Claude, Gemini,
              Perplexity, and AI Overviews decide which brands to cite.
            </p>
          </div>
        </Container>
      </Section>

      {featured ? (
        <>
          <FeaturedCard post={toCard(featured)} hrefBase="/research" cta="Read report" />

          {/* REPORT GRID ------------------------------------------------ */}
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
                    {items.length} {items.length === 1 ? 'report' : 'reports'}
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
                  That is the only report so far. More on the way.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((report) => (
                    <PostCard key={report.slug} post={toCard(report)} hrefBase="/research" cta="Read" />
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
