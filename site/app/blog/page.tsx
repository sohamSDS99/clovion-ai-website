import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'

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

export default function BlogPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FeatureContent />
    </div>
  )
}
