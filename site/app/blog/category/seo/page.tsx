import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'
import { listContent } from '@/lib/cms'
import { toPost } from '@/app/blog/page'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'SEO — what carries into the AI era | Clovion AI',
  description:
    'Posts for SEO teams moving into generative engines. Where SEO still ships traffic, where it diverges from GEO, and the patterns that survive the transition.'
}

export default async function BlogCategorySeoPage() {
  const { items } = await listContent('BLOG', { limit: 100 })
  return (
    <div className="clv-dark clv-ai-vis-page">
      <FeatureContent initialCategory="seo" cmsPosts={items.map(toPost)} />
    </div>
  )
}
