import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
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

const lightWrapper = {
  ['--bg']: '#FAF9F7',
  ['--positive']: '#C2410C',
  ['--positive-bg']: '#FBEEE7',
  ['--positive-border']: 'rgba(194,65,12,0.34)',
  background: '#FAF9F7',
  color: 'var(--ink)'
} as CSSProperties

export default function AICrawlerCheckerPage() {
  return (
    <div className="clv-ai-vis-page" style={lightWrapper}>
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
