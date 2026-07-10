import type { CmsSummary } from '@/lib/cms-types'
import type { Post } from './BlogIndex'

// Map a CMS blog summary into the index card shape. Lives outside the page file
// so it can be shared by /blog and the /blog/category/* routes — a page module
// may only export Next's known fields (default, metadata, …), not helpers.
// publishedAt is guarded (falls back to "" so undated items sort last); category
// passes through as the CMS slug — BlogIndex's categoryLabel handles any value
// and the ChipRail filter matches geo/ai-search/seo.
export function toPost(item: CmsSummary): Post {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? '',
    category: item.category?.slug ?? 'geo',
    author: item.author?.displayName ?? 'Clovion AI',
    date: item.publishedAt ?? '',
    tag: item.tags?.[0]?.name,
    coverImageUrl: item.coverImageUrl ?? null
  }
}
