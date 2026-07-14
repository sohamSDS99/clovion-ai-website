import type { CSSProperties } from 'react'
import { AboutContent } from '@/components/about/AboutContent'

export const metadata = {
  title: 'About | Clovion AI',
  description:
    'Clovion AI helps brands understand how AI engines describe them, what to fix, and whether those changes improve visibility over time.',
  alternates: { canonical: '/about' }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Clovion AI',
  url: 'https://www.clovion.ai/about',
  description:
    'Clovion AI helps brands understand how AI engines describe them, what to fix, and whether those changes improve visibility over time.',
  publisher: {
    '@type': 'Organization',
    name: 'Clovion AI',
    url: 'https://www.clovion.ai'
  }
}

export default function AboutPage() {
  return (
    <div
      className="clv-about"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutContent />
    </div>
  )
}
