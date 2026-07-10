import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import ResearchIndex, { type Report } from '@/components/research/ResearchIndex'
import { listContent } from '@/lib/cms'
import type { CmsSummary } from '@/lib/cms-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  // Plain string → the root layout's "%s | Clovion AI" template appends the
  // brand suffix once. (Do NOT hard-code the suffix here or it doubles.)
  title: 'Clovion Research',
  description:
    'Original research from the Clovion Research team — studies, benchmarks, and first-party data on how ChatGPT, Claude, Gemini, Perplexity, and AI Overviews decide which brands to cite.',
  alternates: { canonical: '/research' }
}

function toReport(item: CmsSummary): Report {
  return {
    slug: item.slug,
    title: item.title.trim(),
    excerpt: item.excerpt ?? '',
    category: item.category?.name ?? null,
    categorySlug: item.category?.slug ?? null,
    author: item.author?.displayName ?? 'Clovion Research',
    avatar: item.author?.avatar ?? null,
    date: item.publishedAt ?? '',
    coverImageUrl: item.coverImageUrl ?? null,
    coverImage: item.coverImage ?? null,
    tags: (item.tags ?? []).map((t) => t.name)
  }
}

// FAQ structured data — mirrors the on-page FAQAccordion copy so the rich
// result and the visible answers never drift.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Clovion Research?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Clovion Research team publishes original studies, benchmarks, and reports on generative engine optimization — how ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews retrieve, rank, and cite brands. Every report is built on first-party data, not scraped guesses.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where does the data come from?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aggregate, anonymized data from the brands we run scans for, plus controlled prompt experiments we run in-house across every major AI engine. Each report documents its sample size, dates, and method so the work is reproducible.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I cite or republish a Clovion Research report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Short quotes with a link back are welcome. For full republication, charts, or methodology reuse, email research@clovion.ai with the outlet and intended use.'
      }
    },
    {
      '@type': 'Question',
      name: 'How often do you publish new research?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We publish when the data is ready, not on a fixed calendar. We would rather ship one report we can stand behind than a weekly recap — quiet stretches mean we are still measuring.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is this different from the Clovion blog?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The blog covers playbooks, commentary, and how-tos. Clovion Research is the data itself — longer, methodology-first reports with original benchmarks you can download and cite.'
      }
    }
  ]
}

export default async function ResearchPage() {
  // Only genuine RESEARCH-type content lists here — the research-flavoured
  // RESOURCE bridge was removed so demo/placeholder resources no longer surface
  // on /research. listContent degrades to [] on CMS failure.
  const { items } = await listContent('RESEARCH', { limit: 100 })
  const reports = items.map(toReport)

  return (
    <div
      className="clv-research"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Brand-orange eyebrow pulse dot, scoped to the light Research page. */
            .clv-research .eyebrow-dot::before {
              background: #C2410C;
              box-shadow: 0 0 0 4px rgba(194, 65, 12, 0.07);
            }
          `
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ResearchIndex reports={reports} />
    </div>
  )
}
