import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/geo/FeatureContent'

export const metadata: Metadata = {
  title: 'GEO Improvement Suggestions — Generative Engine Optimization for AI Search',
  description: 'Turn AI visibility gaps into prioritized GEO recommendations across content structure, schema, authority, technical readiness, and AI crawlability.',
  alternates: { canonical: 'https://www.clovion.ai/features/geo-improvement-suggestions' },
  openGraph: {
    title: 'GEO Improvement Suggestions — Fixes that get cited.',
    description: 'A prioritized queue of generative engine optimization fixes: structure, schema, authority, crawlability — with one-click patches and AI-written suggestions.',
    url: 'https://www.clovion.ai/features/geo-improvement-suggestions',
    type: 'website',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is generative engine optimization?', acceptedAnswer: { '@type': 'Answer', text: 'Generative engine optimization, or GEO, is the process of improving your content so AI systems can understand, cite, and recommend it in generated answers. It focuses on content clarity, structured data, authority signals, technical accessibility, and AI crawlability.' } },
    { '@type': 'Question', name: 'What is GEO optimization?', acceptedAnswer: { '@type': 'Answer', text: 'GEO optimization means improving your website for AI-generated search experiences across engines like ChatGPT, Gemini, Perplexity, Claude, Grok, and Google AI Overviews. It helps your content become easier for AI engines to read, summarize, and cite.' } },
    { '@type': 'Question', name: 'Is generative engine optimization the same as SEO?', acceptedAnswer: { '@type': 'Answer', text: 'No. Traditional SEO focuses on ranking in search engine results pages. Generative engine optimization focuses on whether AI engines mention your brand, cite your pages, and use your content inside generated answers. The two strategies should work together.' } },
    { '@type': 'Question', name: 'How do I optimize content for AI search engines?', acceptedAnswer: { '@type': 'Answer', text: 'Start by making your content clear, structured, crawlable, and authoritative. Use answer-first sections, strong headings, schema markup, FAQ content, internal links, expert authorship, citations, and machine-readable signals like JSON-LD and llms.txt.' } },
    { '@type': 'Question', name: 'How does Clovion create GEO recommendations?', acceptedAnswer: { '@type': 'Answer', text: 'Clovion analyzes your pages against AI-readiness rules covering content structure, schema, authority, technical accessibility, and AI readability. It then turns those findings into prioritized recommendations your team can act on.' } },
    { '@type': 'Question', name: 'How do you measure GEO success?', acceptedAnswer: { '@type': 'Answer', text: 'GEO success can be measured through AI visibility score, brand mentions, citation rate, share of voice, sentiment, prompt coverage, competitor movement, and improvements in how often AI engines reference your pages.' } },
  ],
}

export default function GeoImprovementSuggestionsPage() {
  return (
    <div
      className="clv-ai-vis-page"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FeatureContent />
    </div>
  )
}
