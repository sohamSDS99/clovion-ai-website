import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import type { CSSProperties } from 'react'
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
    images: OG_IMAGES,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://clovion.ai/' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://clovion.ai/' },
    { '@type': 'ListItem', position: 3, name: 'Brand Perception', item: 'https://clovion.ai/features/brand-perception' },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Brand Perception',
  url: 'https://clovion.ai/features/brand-perception',
  description:
    'Clovion analyzes AI responses to help you understand the characteristics, strengths, and perceptions AI consistently associates with your brand — the attributes, audience fit, competitive positioning, and confidence behind how AI describes your business.',
  isPartOf: { '@type': 'WebSite', name: 'Clovion', url: 'https://clovion.ai' },
}

export default function BrandPerceptionPage() {
  // Ships LIGHT, matching the homepage palette (#FAF9F7 warm off-white) and the
  // sibling Brand Audit page. NOT wrapped in .clv-dark — the design tokens
  // default to their light values, and `--bg` is scoped to #FAF9F7 so the page
  // tone matches the homepage exactly. `clv-ai-vis-page` gives paragraph copy
  // the Hanken Grotesk body weight, consistent with the other feature pages.
  return (
    <div
      className="clv-ai-vis-page"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <FeatureContent />
    </div>
  )
}
