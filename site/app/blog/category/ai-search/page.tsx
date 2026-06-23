import type { Metadata } from 'next'
import FeatureContent from '@/components/blog/FeatureContent'

export const metadata: Metadata = {
  title: 'AI Search — the new SERP | Clovion AI',
  description:
    'How buyers actually use ChatGPT, Perplexity, and AI Overviews — what those engines cite, where the traffic is moving, and how to show up.'
}

export default function BlogCategoryAISearchPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <FeatureContent initialCategory="ai-search" />
    </div>
  )
}
