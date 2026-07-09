import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/ai-visibility/FeatureContent'

export const metadata: Metadata = {
  title: 'AI Visibility Tracking Tool | LLM Rank Tracker for AI Engines',
  description: 'Track brand mentions across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews. Use Clovion as your LLM rank tracker for AI search visibility.',
  alternates: { canonical: 'https://www.clovion.ai/features/ai-visibility-tracking' },
  openGraph: {
    title: 'AI Visibility Tracking — See Every AI Mention Across 6 Engines',
    description: 'LLM rank tracking across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews. Daily refresh. Brand-neutral prompts. One dashboard.',
    url: 'https://www.clovion.ai/features/ai-visibility-tracking',
    type: 'website',
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion AI — AI Visibility Tracking',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai/features/ai-visibility-tracking',
  offers: { '@type': 'Offer', price: '79', priceCurrency: 'USD' },
  description:
    'Track brand mentions, citations, share of voice, and LLM rank across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews. Daily refresh, one dashboard.'
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is AI visibility tracking?', acceptedAnswer: { '@type': 'Answer', text: 'AI visibility tracking measures whether AI answer engines mention your brand, cite your pages, and recommend you in response to category-level prompts. Clovion tracks these signals across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.' } },
    { '@type': 'Question', name: 'Is Clovion an LLM rank tracker?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Clovion works as an LLM rank tracker by monitoring how your brand appears across AI-generated answers. It tracks brand mentions, LLM rank, share of voice, citations, sentiment, and visibility score over time.' } },
    { '@type': 'Question', name: 'How can you track brand mentions in ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'Clovion tracks brand mentions in ChatGPT by running neutral buyer-style prompts and analyzing whether your brand appears in the answer. It also tracks where the mention appears, how prominent it is, and how the answer describes your brand.' } },
    { '@type': 'Question', name: 'Can Clovion track Perplexity rankings?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Clovion can track Perplexity rank performance, brand mentions, source citations, and competitor visibility, helping teams understand how their brand appears in Perplexity answers.' } },
    { '@type': 'Question', name: 'What makes Clovion different from a traditional SEO tool?', acceptedAnswer: { '@type': 'Answer', text: 'Traditional SEO tools track rankings in search engine results pages. Clovion tracks AI search visibility inside generated answers, where users may receive one synthesized recommendation instead of a list of links.' } },
  ],
}

export default function AIVisibilityTrackingPage() {
  return (
    <div
      className="clv-ai-vis-page"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FeatureContent />
    </div>
  )
}
