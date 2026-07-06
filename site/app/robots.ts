import type { MetadataRoute } from 'next'

// NOTE: The LIVE /robots.txt is currently served by Cloudflare's
// "Managed Content" feature, which overrides this origin file. This route
// still defines the correct origin-level policy (used if Cloudflare's
// managed robots.txt is ever disabled) and — importantly — advertises the
// sitemap location. To surface the Sitemap directive on the live site,
// also add it in the Cloudflare robots.txt manager.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://www.clovion.ai/sitemap.xml',
    host: 'https://www.clovion.ai',
  }
}
