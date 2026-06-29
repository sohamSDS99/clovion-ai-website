import type { Metadata } from 'next'
import FeatureContent from '@/components/tools/fanout/FeatureContent'
import { FAQS } from '@/components/tools/fanout/faqs'

export const metadata: Metadata = {
  title: 'Query Fan-Out Generator | Free AI Search Tool',
  description:
    'See how ChatGPT, Perplexity, and Google AI fan a single query into 8+ sub-queries behind the scenes. Use it to plan content briefs, SEO clusters, and GEO strategies. Free, no signup.',
  alternates: { canonical: 'https://www.clovion.ai/tools/fanout' },
  openGraph: {
    title: 'Query Fan-Out Generator — Clovion AI',
    description:
      'Expand any buyer query into the sub-queries AI engines run behind the scenes. Free tool from Clovion AI.',
    url: 'https://www.clovion.ai/tools/fanout',
    type: 'website'
  }
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion Query Fan-Out Generator',
  applicationCategory: 'SEOApplication',
  operatingSystem: 'Web',
  description:
    'Free tool that expands a single buyer query into the sub-queries AI search engines run behind the scenes, grouped by intent.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
}

export default function FanoutToolPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <FeatureContent />
    </div>
  )
}
