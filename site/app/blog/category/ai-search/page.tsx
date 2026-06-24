import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'
import { listContent } from '@/lib/cms'
import { toPost } from '@/app/blog/page'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'AI Search — the new SERP | Clovion AI',
  description:
    'How buyers actually use ChatGPT, Perplexity, and AI Overviews — what those engines cite, where the traffic is moving, and how to show up.'
}

export default async function BlogCategoryAISearchPage() {
  const { items } = await listContent('BLOG', { limit: 100 })
  return (
    <div className="clv-dark clv-ai-vis-page">
      <FeatureContent initialCategory="ai-search" cmsPosts={items.map(toPost)} />
    </div>
  )
}
