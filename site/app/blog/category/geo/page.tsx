import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'
import { listContent } from '@/lib/cms'
import { toPost } from '@/app/blog/page'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'GEO — Generative Engine Optimization | Clovion AI',
  description:
    'Methodologies, benchmarks, and case studies on generative engine optimization. How AI engines retrieve, rank, and cite brand content — and how to move the needle.'
}

export default async function BlogCategoryGeoPage() {
  const { items } = await listContent('BLOG', { limit: 100 })
  return (
    <div className="clv-dark clv-ai-vis-page">
      <FeatureContent initialCategory="geo" cmsPosts={items.map(toPost)} />
    </div>
  )
}
