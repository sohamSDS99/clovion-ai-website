import type { Metadata } from 'next'
import FeatureContent from '@/components/brand-perception/FeatureContent'

export const metadata: Metadata = {
  title: 'Brand Perception in AI Search | Track How AI Describes Your Brand',
  description:
    'See what AI believes about your brand. Track perception attributes like ease of use, audience fit, pricing, maturity, strengths, limitations, and competitor positioning.',
  alternates: { canonical: 'https://clovion.ai/features/brand-perception' },
  openGraph: {
    title: 'AI Brand Perception — The Substance Behind the Sentiment Score',
    description:
      'Is AI calling you enterprise or budget? Easy or complex? Brand Perception extracts the actual characterizations. Per engine. Connected to fixes.',
    url: 'https://clovion.ai/features/brand-perception',
    type: 'website',
    images: [
      {
        url: 'https://clovion.ai/og/brand-perception.png',
        alt: 'Clovion AI brand perception dashboard showing extracted brand attributes per AI engine — ChatGPT, Claude, Perplexity, Gemini — with attribute categories for usability, market fit, pricing, and capability, plus a perception gap indicator highlighting mismatches between intended and actual positioning.',
      },
    ],
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Brand Perception in Clovion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brand Perception is a Clovion feature that shows how AI engines describe and position your brand. It surfaces the attributes AI associates with your product, such as audience fit, ease of use, pricing perception, product maturity, strengths, limitations, and competitor framing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Brand Perception different from Sentiment Analysis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sentiment Analysis shows whether an AI mention is positive, neutral, or negative. Brand Perception shows what AI believes about your brand, such as whether it is seen as enterprise-ready, easy to use, affordable, technical, niche, mature, or best for a specific audience.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are brand perception attributes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brand perception attributes are recurring labels or themes AI engines attach to your brand. These may include ease of use, pricing, target audience, maturity, category fit, strengths, limitations, setup complexity, and competitor comparisons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does AI brand perception matter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI brand perception matters because buyers may rely on AI-generated answers before visiting your website. If AI engines describe your product inaccurately or incompletely, buyers may form the wrong impression before they reach your content.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Clovion show if AI thinks my product is for SMBs or enterprise teams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clovion can surface audience-fit signals, including whether AI engines describe your product as best for SMBs, startups, agencies, enterprise teams, technical users, marketers, or another audience.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Clovion show if AI thinks my product is easy to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clovion can identify ease-of-use attributes, including whether AI describes your platform as simple, intuitive, technical, complex, beginner-friendly, or difficult to adopt.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Clovion compare my brand perception against competitors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clovion can compare how AI engines describe your brand and competitors in the same answers, prompts, topics, and engines.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Brand Perception connect to GEO Recommendations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. When Clovion identifies a perception gap, the insight can support GEO recommendations that help your team improve content structure, messaging, schema, authority signals, and AI-readable explanations.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do if AI describes my brand incorrectly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start by identifying which prompts, engines, and sources contribute to the incorrect description. Then update owned content, strengthen relevant feature pages, improve schema and FAQs, and create clearer explanations around the perception gap.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which teams should use Brand Perception?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brand Perception is useful for marketing, SEO, product marketing, communications, founders, and leadership teams that want to understand how AI engines are shaping buyer perception.',
      },
    },
  ],
}

export default function BrandPerceptionPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}
