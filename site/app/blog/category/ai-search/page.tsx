import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import BlogIndex from '@/components/blog/BlogIndex'
import { listContent } from '@/lib/cms'
import { toPost } from '@/components/blog/toPost'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Search — the new SERP | Clovion AI',
  description:
    'How buyers actually use ChatGPT, Perplexity, and AI Overviews — what those engines cite, where the traffic is moving, and how to show up.'
}

export default async function BlogCategoryAISearchPage() {
  const { items } = await listContent('BLOG', { limit: 100 })
  return (
    <div
      className="clv-blog"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .clv-blog .eyebrow-dot::before {
              background: #C2410C;
              box-shadow: 0 0 0 4px rgba(194, 65, 12, 0.07);
            }
          `
        }}
      />
      <BlogIndex initialCategory="ai-search" cmsPosts={items.map(toPost)} />
    </div>
  )
}
