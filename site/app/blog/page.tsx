import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import BlogIndex, { type Post } from '@/components/blog/BlogIndex'
import { listContent } from '@/lib/cms'
import type { CmsSummary } from '@/lib/cms-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | Clovion AI',
  description:
    'Research, playbooks, and engineering notes on generative engine optimization, AI search citations, and how the major AI engines decide who to cite.'
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How often does Clovion publish?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A new piece ships most weeks. We prioritize research with real data over news recaps, so cadence flexes — quiet weeks mean we are still measuring, not that nothing happened.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I republish or cite Clovion research?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Short quotes with a link back are welcome. For full republication, charts, or methodology reuse, email research@clovion.ai with the outlet and intended use.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where do the data and benchmarks come from?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aggregate, anonymized data from the customer base we run scans for, plus controlled prompt experiments we run in-house across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I pitch a guest post?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send a one-paragraph outline and a writing sample to research@clovion.ai. We publish a handful of guest pieces a year, mostly from practitioners with first-party data to share.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there an RSS feed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. /rss.xml carries every post, oldest to newest, with full excerpts. The weekly email covers the same posts plus short commentary you will not find on the site.'
      }
    }
  ]
}

// Map a CMS blog summary into the composer's card shape. publishedAt is
// guarded (falls back to "" so sorting puts undated items last); category
// passes through as the CMS slug — the composer's categoryLabel handles any
// value gracefully and the ChipRail filter matches geo/ai-search/seo.
export function toPost(item: CmsSummary): Post {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? '',
    category: item.category?.slug ?? 'geo',
    author: item.author?.displayName ?? 'Clovion AI',
    date: item.publishedAt ?? '',
    tag: item.tags?.[0]?.name,
    coverImageUrl: item.coverImageUrl ?? null
  }
}

export default async function BlogPage() {
  const { items } = await listContent('BLOG', { limit: 100 })
  const cmsPosts = items.map(toPost)

  return (
    <div
      className="clv-blog"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Brand-orange eyebrow pulse dot, scoped to the light blog. */
            .clv-blog .eyebrow-dot::before {
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
      <BlogIndex cmsPosts={cmsPosts} />
    </div>
  )
}
