import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import ResourcesContent, { type ResourcePost } from '@/components/resources/ResourcesContent'
import { listContent } from '@/lib/cms'
import type { CmsSummary } from '@/lib/cms-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guides & Downloads | Clovion AI',
  description:
    'Guides, playbooks, and reports on AI visibility, GEO, and answer-engine optimization. Download the ones that fit your team.'
}

// Map a CMS resource summary into the composer's card shape. category passes
// through as both display name and slug so the filter (Playbook / Study &
// Reports) and the KindChip can classify it; both tolerate null.
function toResourcePost(item: CmsSummary): ResourcePost {
  return {
    slug: item.slug,
    title: item.title.trim(),
    excerpt: item.excerpt ?? '',
    category: item.category?.name ?? null,
    categorySlug: item.category?.slug ?? null,
    author: item.author?.displayName ?? 'Clovion AI',
    authorAvatar: item.author?.avatar ?? null,
    date: item.publishedAt ?? '',
    coverImageUrl: item.coverImageUrl ?? null
  }
}

export default async function ResourcesPage() {
  // RESOURCE only. RESEARCH reports have their own /research section and must
  // NOT appear here (they used to be merged in as gated downloads).
  const { items } = await listContent('RESOURCE', { limit: 60 })
  const posts = items
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .map(toResourcePost)

  return (
    <div
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <ResourcesContent posts={posts} />
    </div>
  )
}
