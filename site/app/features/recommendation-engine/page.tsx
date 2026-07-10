import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/recommendation/FeatureContent'

export const metadata: Metadata = {
  title: 'Recommendation Engine — Fixes, Not Dashboards | Clovion',
  description:
    'Most AI visibility platforms give you dashboards. Clovion gives you fixes. It finds the source, substance, and framing gaps holding back your AI visibility, recommends the right fix, and tracks whether it changed how AI represents your brand.',
  alternates: { canonical: 'https://clovion.ai/features/recommendation-engine' },
  openGraph: {
    title: 'Recommendation Engine — Clovion gives you fixes.',
    description:
      'Prioritized recommendations your team can act on: find the gap, fix the cause, and track the outcome from Baselined to Resolved.',
    url: 'https://clovion.ai/features/recommendation-engine',
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
    { '@type': 'ListItem', position: 3, name: 'Recommendation Engine', item: 'https://clovion.ai/features/recommendation-engine' },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Recommendation Engine',
  url: 'https://clovion.ai/features/recommendation-engine',
  description:
    'Clovion analyzes how AI models cite, describe, and compare your brand, then turns those patterns into prioritized recommendations your team can act on — identifying source-presence, substance, and framing gaps, recommending the right fix, and tracking the outcome.',
  isPartOf: { '@type': 'WebSite', name: 'Clovion', url: 'https://clovion.ai' },
}

export default function RecommendationEnginePage() {
  // Ships LIGHT, matching the homepage palette (#FAF9F7 warm off-white). NOT
  // wrapped in .clv-dark — the design tokens default to their light values, and
  // `--bg` is scoped to #FAF9F7 so the page tone matches the homepage exactly.
  // (Same treatment as the Brand Audit and Brand Perception feature pages.)
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
