import type { Metadata } from 'next'
import FeatureContent from '@/components/tools/llms-txt-generator/FeatureContent'
import { FAQS } from '@/components/tools/llms-txt-generator/faqs'

export const metadata: Metadata = {
  title: 'Free llms.txt Generator | Clovion AI',
  description:
    'Generate the llms.txt file AI crawlers expect — so ChatGPT, Perplexity, Claude, and Google AI Overviews can read what you want them to read. Free. No signup.',
  alternates: { canonical: 'https://www.clovion.ai/tools/llms-txt-generator' },
  openGraph: {
    title: 'Free llms.txt Generator — Clovion AI',
    description:
      'Generate a clean llms.txt for your site so AI engines can find and cite your most important pages.',
    url: 'https://www.clovion.ai/tools/llms-txt-generator',
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
  name: 'llms.txt Generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: 'https://www.clovion.ai/tools/llms-txt-generator'
}

export default function LlmsTxtGeneratorPage() {
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
