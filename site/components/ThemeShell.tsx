'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// `/`, `/pricing`, and `/about` are intentionally NOT here — all ship LIGHT
// (#FAF9F7). See app/page.tsx (home), app/pricing/page.tsx, and
// app/about/page.tsx (about light redesign).
const DARK_ROUTES = new Set<string>(['/customers', '/changelog'])

// Prefix-matched dark sections — covers index + every nested/[slug] page.
// The whole marketing site is dark, so this spans content, docs, legal, and
// the comparison/alternatives pages.
// NOTE: `/blog` and `/resources` are intentionally NOT dark prefixes — the whole
// content system (both listings, categories, AND every article/[slug]) ships
// LIGHT (#FAF9F7 + Clove orange). Light + orange is the only pattern going forward.
const DARK_PREFIXES = ['/news', '/webinars', '/faq', '/compare', '/alternatives', '/legal']

// Light exceptions inside an otherwise-dark prefix. These pages were rebranded
// to the light homepage palette (#FAF9F7 + Clove orange), so they opt out of
// their section's dark scope.
const LIGHT_EXCEPTIONS = new Set<string>(['/compare/clovion-vs-peec-ai', '/compare/clovion-vs-otterly', '/compare/clovion-vs-searchable', '/compare/clovion-vs-profound', '/legal/privacy', '/legal/terms'])

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
