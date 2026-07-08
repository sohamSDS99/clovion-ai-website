import type { MetadataRoute } from 'next'

// Origin robots policy: allow all crawlers full access, no disallow rules.
// Once Cloudflare's "Managed Content" robots.txt is disabled, this origin
// file becomes the source of truth for the live /robots.txt. It advertises
// the sitemap location and imposes no crawl restrictions.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://www.clovion.ai/sitemap.xml',
    host: 'https://www.clovion.ai',
  }
}
