import type { Metadata } from 'next'
import FeatureContent from '@/components/pricing/FeatureContent'
import { P_FAQS } from '@/components/pricing/faqs'

export const metadata: Metadata = {
  title: 'Pricing — AI Visibility, Sentiment & GEO Tracking Plans',
  description: 'Clovion AI pricing. Starter from $119/mo, Growth at $319/mo, and custom Enterprise. Track brand visibility, sentiment, competitors, and GEO across ChatGPT, Claude, Gemini, Perplexity, Grok & AI Overviews. Get 20% off at launch.',
  alternates: { canonical: 'https://www.clovion.ai/pricing' },
  openGraph: {
    title: 'Clovion AI Pricing — Plans for Every AI Search Strategy',
    description: 'Starter, Growth, and Enterprise plans for AI visibility tracking, sentiment analysis, prompt tracking, competitor analysis, and GEO recommendations. Start tracking how AI describes your brand.',
    url: 'https://www.clovion.ai/pricing',
    type: 'website',
  },
}

// Prices mirror the live tiers in components/pricing/PricingTiers.tsx
// (Starter $119/mo, Growth $319/mo, Enterprise custom). Update both together.
const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai/pricing',
  description:
    'AI visibility, sentiment, and GEO tracking across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews. Starter, Growth, and Enterprise plans.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '119',
    highPrice: '319',
    offerCount: '3'
  }
}

// FAQ schema is derived from the SAME P_FAQS the page renders, so the visible
// FAQ and the structured data can never drift (a mismatch gets flagged by Google).
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: P_FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function PricingPage() {
  return (
    <div className="clv-ai-vis-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}
