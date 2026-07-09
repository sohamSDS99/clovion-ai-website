import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import FeatureContent from '@/components/tools/robots-checker/FeatureContent'
import { FAQS } from '@/components/tools/robots-checker/faqs'

export const metadata: Metadata = {
  title: 'Robots.txt AI Bot Checker — Free Tool | Clovion AI',
  description:
    'Free Robots.txt AI Bot Checker. Paste your robots.txt or enter a URL and see exactly which of 15 AI bots — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and more — are allowed, blocked, or fall through your rules.',
  alternates: { canonical: 'https://www.clovion.ai/tools/robots-checker' },
  openGraph: {
    title: 'Robots.txt AI Bot Checker — Free Tool',
    description:
      'See exactly which AI crawlers your robots.txt allows or blocks. Free, no signup. Covers 15 AI bots including GPTBot, ClaudeBot, PerplexityBot, and Google-Extended.',
    url: 'https://www.clovion.ai/tools/robots-checker',
    type: 'website',
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion AI — Robots.txt AI Bot Checker',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai/tools/robots-checker',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Free Robots.txt AI Bot Checker. Audit your robots.txt against 15 AI crawlers and see which are allowed, blocked, or indeterminate.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const lightWrapper = {
  ['--bg']: '#FAF9F7',
  ['--positive']: '#C2410C',
  ['--positive-bg']: '#FBEEE7',
  ['--positive-border']: 'rgba(194,65,12,0.34)',
  background: '#FAF9F7',
  color: 'var(--ink)',
} as CSSProperties

export default function RobotsCheckerToolPage() {
  return (
    <div className="clv-ai-vis-page" style={lightWrapper}>
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
