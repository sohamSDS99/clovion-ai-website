import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'

export const metadata: Metadata = {
  title: 'GEO — Generative Engine Optimization | Clovion AI',
  description:
    'Methodologies, benchmarks, and case studies on generative engine optimization. How AI engines retrieve, rank, and cite brand content — and how to move the needle.'
}

export default function BlogCategoryGeoPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <FeatureContent initialCategory="geo" />
    </div>
  )
}
