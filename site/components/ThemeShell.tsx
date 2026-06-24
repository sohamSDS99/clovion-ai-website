'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const DARK_ROUTES = new Set<string>(['/', '/features/ai-visibility-tracking', '/features/geo-improvement-suggestions', '/features/sentiment-analysis', '/features/fanout-query', '/features/ai-crawlability', '/pricing', '/affiliate', '/free-ai-visibility-score', '/customers', '/blog', '/blog/category/geo', '/blog/category/ai-search', '/blog/category/seo'])

// CMS sections whose index AND [slug] detail pages are dark. Matched by
// prefix (not exact) so /news, /news/some-post, etc. all resolve to dark.
const DARK_PREFIXES = ['/blog', '/news', '/webinars', '/resources', '/faq']

function isDarkRoute(pathname: string): boolean {
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
