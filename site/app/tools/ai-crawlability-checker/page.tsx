import type { Metadata } from 'next'
import FeatureContent from '@/components/tools/ai-crawlability-checker/FeatureContent'
import { FAQS } from '@/components/tools/ai-crawlability-checker/faqs'

export const metadata: Metadata = {
  title: 'AI Crawlability Checker | See Which AI Bots Your Site Allows',
  description:
    'Free AI crawler checker. See which AI bots — GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, and more — your robots.txt allows or blocks.',
  alternates: { canonical: 'https://www.clovion.ai/tools/ai-crawlability-checker' },
  openGraph: {
    title: 'AI Crawlability Checker — Clovion AI',
    description:
      'Find out which AI crawlers can access your site. A free, instant readout for ten of the most relevant AI bots.',
    url: 'https://www.clovion.ai/tools/ai-crawlability-checker',
    type: 'website'
  }
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a
    }
  }))
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Crawlability Checker',
  applicationCategory: 'WebApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai/tools/ai-crawlability-checker',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
}

export default function AICrawlerCheckerPage() {
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
