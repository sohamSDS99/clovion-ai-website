import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/free-score/FeatureContent'

export const metadata: Metadata = {
  title: 'Free AI Visibility Score | See How AI Engines Describe Your Brand',
  description:
    'Check your AI visibility across ChatGPT, Claude, Perplexity, and Google AI Overviews. Free score in 60 seconds. No signup, no card.',
  alternates: { canonical: 'https://www.clovion.ai/free-ai-visibility-score' },
  openGraph: {
    title: 'Free AI Visibility Score — Clovion AI',
    description:
      'Find out how AI engines describe your brand. Mentions, sentiment, citations, and competitive position in one free snapshot.',
    url: 'https://www.clovion.ai/free-ai-visibility-score',
    type: 'website',
    images: OG_IMAGES,
  }
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does the free AI visibility score actually measure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Four signals: how often your brand appears in AI answers, how positively those answers describe you, how often your domain is cited as a source, and your share of voice against the top three competitors. Each is scored 0–100 and combined into a single overall score.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which AI engines do you check?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChatGPT, Claude, Perplexity, and Google AI Overviews. The free score uses a fixed buyer-prompt set; the full Clovion product expands coverage to Gemini and Grok and runs the prompts daily.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is this different from a paid plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free score is one snapshot from one prompt batch. Paid plans run the same prompts daily across more engines, track changes over time, send alerts when your visibility shifts, and connect every finding to a recommended fix.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is the score accurate enough to make decisions on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free score is directional. It is enough to see where you stand and which fixes likely matter most. Teams making roadmap or budget decisions usually move to the paid plan for daily refresh, longer prompt sets, and competitor benchmarks.'
      }
    },
    {
      '@type': 'Question',
      name: 'What counts as a citation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A citation is a source link AI engines like Perplexity and AI Overviews attach to their answers. Citation strength tracks how often your domain appears as a cited source for category prompts, not just how often your brand name appears in the text.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do I need to enter a credit card or sign up?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The free score requires only a domain. We do ask for an email if you want the full report sent over, but the on-screen result is free and immediate.'
      }
    }
  ]
}

const lightWrapper = {
  ['--bg']: '#FAF9F7',
  ['--positive']: '#C2410C',
  ['--positive-bg']: '#FBEEE7',
  ['--positive-border']: 'rgba(194,65,12,0.34)',
  background: '#FAF9F7',
  color: 'var(--ink)'
} as CSSProperties

export default function FreeAIVisibilityScorePage() {
  return (
    <div className="clv-ai-vis-page" style={lightWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FeatureContent />
    </div>
  )
}
