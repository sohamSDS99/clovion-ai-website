import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/brand-audit/FeatureContent'

export const metadata: Metadata = {
  title: 'Brand Audit for AI Search | Audit Your AI Footprint | Clovion',
  description:
    'Understand how AI engines see your brand before you optimize. Clovion audits your website, third-party sources, and the facts AI relies on — every finding is traceable and flows into recommendations.',
  alternates: { canonical: 'https://clovion.ai/features/brand-audit' },
  openGraph: {
    title: 'Brand Audit — Understand How AI Engines See Your Brand',
    description:
      'A comprehensive audit of your AI footprint: source coverage, website substance, consistency, and factual accuracy. Traceable findings that become the foundation for every recommendation.',
    url: 'https://clovion.ai/features/brand-audit',
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
    { '@type': 'ListItem', position: 3, name: 'Brand Audit', item: 'https://clovion.ai/features/brand-audit' },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Brand Audit',
  url: 'https://clovion.ai/features/brand-audit',
  description:
    'Clovion performs a comprehensive audit of your AI footprint — reviewing your website, the third-party sources AI engines rely on, and the information available about your business — to identify what is helping or limiting your AI visibility.',
  isPartOf: { '@type': 'WebSite', name: 'Clovion', url: 'https://clovion.ai' },
}

export default function BrandAuditPage() {
  // Ships LIGHT, matching the homepage palette (#FAF9F7 warm off-white). NOT
  // wrapped in .clv-dark — the design tokens default to their light values, and
  // `--bg` is scoped to #FAF9F7 so the page tone matches the homepage exactly.
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
