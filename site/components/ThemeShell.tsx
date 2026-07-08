'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// `/` and `/pricing` are intentionally NOT here — both ship LIGHT (#FAF9F7).
// See app/page.tsx (home) and app/pricing/page.tsx (pricing light redesign).
const DARK_ROUTES = new Set<string>(['/features/ai-visibility-tracking', '/features/geo-improvement-suggestions', '/features/sentiment-analysis', '/features/fanout-query', '/features/ai-crawlability', '/free-ai-visibility-score', '/customers', '/about', '/changelog', '/blog', '/blog/category/geo', '/blog/category/ai-search', '/blog/category/seo'])

// Prefix-matched dark sections — covers index + every nested/[slug] page.
// The whole marketing site is dark, so this spans content, docs, legal, and
// the comparison/alternatives pages.
const DARK_PREFIXES = ['/blog', '/news', '/webinars', '/resources', '/faq', '/compare', '/alternatives', '/docs', '/legal', '/tools']

// Light exceptions inside an otherwise-dark prefix. These comparison pages were
// rebranded to the light homepage palette (#FAF9F7 + Clove orange), so they opt
// out of the /compare dark scope while the hub + /clovion-vs-profound stay dark.
const LIGHT_EXCEPTIONS = new Set<string>(['/compare/clovion-vs-peec-ai', '/compare/clovion-vs-otterly', '/compare/clovion-vs-searchable'])

function isDarkRoute(pathname: string): boolean {
  if (LIGHT_EXCEPTIONS.has(pathname)) return false
  if (DARK_ROUTES.has(pathname)) return true
  return DARK_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

/**
 * Mounts the dark-theme class on <html> for the homepage redesign and
 * removes it elsewhere. Scoped via .clv-dark so the rest of the site keeps
 * its light brand book.
 */
export function ThemeShell() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (pathname && isDarkRoute(pathname)) {
      root.classList.add('clv-dark')
    } else {
      root.classList.remove('clv-dark')
    }
  }, [pathname])

  return null
}
