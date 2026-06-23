import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'

export const metadata: Metadata = {
  title: 'SEO — what carries into the AI era | Clovion AI',
  description:
    'Posts for SEO teams moving into generative engines. Where SEO still ships traffic, where it diverges from GEO, and the patterns that survive the transition.'
}

export default function BlogCategorySeoPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <FeatureContent initialCategory="seo" />
    </div>
  )
}
