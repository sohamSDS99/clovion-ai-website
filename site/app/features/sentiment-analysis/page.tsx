import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/sentiment/FeatureContent'

export const metadata: Metadata = {
  title: 'AI Brand Sentiment Analysis — Track What AI Says About You',
  description: 'Track brand sentiment across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews. Per-engine analysis, not blended. Connected to GEO fixes. Free score in 60 seconds.',
  alternates: { canonical: 'https://www.clovion.ai/features/sentiment-analysis' },
  openGraph: {
    title: 'AI Sentiment Analysis — Per-Engine Brand Sentiment Across 6 Engines',
    description: 'Track how ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews describe your brand. Per-engine sentiment, competitor framing, and negative brand mentions — connected to fixes.',
    url: 'https://www.clovion.ai/features/sentiment-analysis',
    type: 'website',
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion AI — AI Sentiment Analysis',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai/features/sentiment-analysis',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Track brand sentiment across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews. Per-engine analysis, not blended. Connected to GEO fixes.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is AI sentiment analysis?', acceptedAnswer: { '@type': 'Answer', text: 'AI sentiment analysis measures whether AI-generated answers describe your brand positively, neutrally, or negatively. In Clovion, sentiment is tied to brand mentions across AI engines, prompts, competitors, and citations.' } },
    { '@type': 'Question', name: 'What is brand sentiment in AI search?', acceptedAnswer: { '@type': 'Answer', text: 'Brand sentiment in AI search is the tone AI engines use when they describe your company, product, or category position. It shows whether your brand is being recommended, described neutrally, or framed with concerns.' } },
    { '@type': 'Question', name: 'How does Clovion track brand sentiment in ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'Clovion runs buyer-style prompts across ChatGPT, detects brand mentions, analyzes the surrounding context, and classifies the mention as positive, neutral, or negative.' } },
    { '@type': 'Question', name: 'Can Clovion track sentiment in Perplexity?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Clovion tracks how Perplexity describes your brand when it appears in AI-generated answers, including sentiment and citation context where sources are available.' } },
    { '@type': 'Question', name: 'Why does AI sentiment matter?', acceptedAnswer: { '@type': 'Answer', text: 'AI sentiment matters because buyers may form opinions based on how AI engines summarize your brand. A brand that appears often but is described with caveats, concerns, or weak positioning may still lose demand to competitors.' } },
    { '@type': 'Question', name: 'What is the difference between AI sentiment analysis and social listening?', acceptedAnswer: { '@type': 'Answer', text: 'Social listening tracks what people say about your brand on social platforms, forums, and review sites. AI sentiment analysis tracks what AI engines themselves say about your brand when answering buyer questions.' } },
    { '@type': 'Question', name: 'Does Clovion compare sentiment against competitors?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Clovion helps teams compare how AI engines describe their brand against competitors, so they can identify positioning gaps and topics that need improvement.' } },
    { '@type': 'Question', name: 'Can sentiment analysis improve GEO strategy?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Sentiment analysis helps identify which prompts, topics, and sources create weak or negative positioning. Those insights can guide GEO recommendations, content updates, comparison pages, and authority-building work.' } },
    { '@type': 'Question', name: 'What causes negative AI sentiment?', acceptedAnswer: { '@type': 'Answer', text: 'Negative AI sentiment can come from outdated content, missing feature information, weak third-party sources, poor reviews, competitor comparisons, pricing concerns, or AI-generated summaries that lack current context.' } },
    { '@type': 'Question', name: 'How often should AI brand sentiment be monitored?', acceptedAnswer: { '@type': 'Answer', text: 'AI brand sentiment should be monitored regularly because AI-generated answers can change as sources, prompts, competitors, and content updates change. Clovion refreshes visibility tracking daily.' } },
    { '@type': 'Question', name: 'What should I look for in an AI sentiment analysis tool?', acceptedAnswer: { '@type': 'Answer', text: 'A strong AI sentiment analysis tool should track positive, neutral, and negative mentions, compare sentiment across engines, connect sentiment to prompts and sources, benchmark competitors, and show what to improve next.' } },
  ],
}

export default function SentimentAnalysisPage() {
  return (
    <div
      className="clv-ai-vis-page"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}
