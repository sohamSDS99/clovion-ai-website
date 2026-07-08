import type { MetadataRoute } from 'next'
import { listContent } from '@/lib/cms'
import type { CmsSummary, CmsType } from '@/lib/cms-types'

// Revalidate on the same cadence as the CMS reads so freshly-published
// posts show up in the sitemap without a redeploy.
export const revalidate = 300

const BASE = 'https://www.clovion.ai'

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

// Static marketing routes. `/features` is intentionally omitted — it
// redirect()s to `/`. `/api/*` and dynamic `[slug]` routes are handled
// separately (the latter via the CMS below).
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: ChangeFreq }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },

  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/free-ai-visibility-score', priority: 0.9, changeFrequency: 'monthly' },

  // Feature pages
  { path: '/features/ai-visibility-tracking', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features/geo-improvement-suggestions', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features/sentiment-analysis', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features/brand-perception', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features/fanout-query', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features/ai-crawlability', priority: 0.8, changeFrequency: 'monthly' },

  // Free tools
  { path: '/tools/robots-checker', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tools/ai-crawlability-checker', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tools/llms-txt-generator', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tools/fanout', priority: 0.7, changeFrequency: 'monthly' },

  // Compare / alternatives
  { path: '/compare', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/compare/clovion-vs-profound', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/compare/clovion-vs-peec-ai', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/alternatives/profound', priority: 0.7, changeFrequency: 'monthly' },

  // Company / social proof
  { path: '/customers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/affiliate', priority: 0.6, changeFrequency: 'monthly' },

  // Content hubs
  { path: '/blog', priority: 0.7, changeFrequency: 'daily' },
  { path: '/blog/category/geo', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/blog/category/ai-search', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/blog/category/seo', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/news', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/webinars', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/resources', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/faq', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/changelog', priority: 0.5, changeFrequency: 'weekly' },

  // Docs
  { path: '/docs', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/docs/getting-started', priority: 0.5, changeFrequency: 'monthly' },

  // Legal
  { path: '/legal/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/legal/terms', priority: 0.3, changeFrequency: 'yearly' },
]

// CMS content types → their public route prefix (note the plural routes).
const CMS_ROUTES: { type: CmsType; prefix: string }[] = [
  { type: 'BLOG', prefix: '/blog' },
  { type: 'NEWS', prefix: '/news' },
  { type: 'WEBINAR', prefix: '/webinars' },
  { type: 'RESOURCE', prefix: '/resources' },
  { type: 'FAQ', prefix: '/faq' },
]

// Pull every published slug for a type, paginating defensively. Returns []
// on any CMS failure (listContent already degrades gracefully).
async function allItems(type: CmsType): Promise<CmsSummary[]> {
  const out: CmsSummary[] = []
  let cursor: string | undefined
  for (let page = 0; page < 25; page++) {
    const { items, nextCursor } = await listContent(type, { limit: 100, cursor })
    out.push(...items)
    if (!nextCursor) break
    cursor = nextCursor
  }
  return out
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const cmsGroups = await Promise.all(
    CMS_ROUTES.map(async ({ type, prefix }) => {
      const items = await allItems(type)
      return items
        .filter((it) => !it.seo?.noIndex)
        .map((it) => ({
          url: `${BASE}${prefix}/${it.slug}`,
          lastModified: it.publishedAt ? new Date(it.publishedAt) : now,
          changeFrequency: 'monthly' as ChangeFreq,
          priority: 0.5,
        }))
    })
  )

  return [...staticEntries, ...cmsGroups.flat()]
}
