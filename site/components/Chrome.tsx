'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { HomeHeader } from './HomeHeader'
import { HomeFooter } from './HomeFooter'

// `/` and `/pricing` are intentionally NOT here — both light routes use the
// light Header/Footer. See app/page.tsx and app/pricing/page.tsx.
const HOME_ROUTES = new Set<string>(['/features/ai-visibility-tracking', '/features/geo-improvement-suggestions', '/features/sentiment-analysis', '/features/fanout-query', '/features/ai-crawlability', '/features/platform-coverage', '/affiliate', '/free-ai-visibility-score', '/customers', '/about', '/changelog', '/blog', '/blog/category/geo', '/blog/category/ai-search', '/blog/category/seo'])

// Prefix-matched dark-chrome sections — index + every nested/[slug] page.
const HOME_PREFIXES = ['/blog', '/news', '/webinars', '/resources', '/faq', '/compare', '/alternatives', '/docs', '/legal', '/tools']

function isHomeChrome(pathname: string): boolean {
  if (HOME_ROUTES.has(pathname)) return true
  return HOME_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function ChromeHeader() {
  const pathname = usePathname()
  return pathname && isHomeChrome(pathname) ? <HomeHeader /> : <Header />
}

export function ChromeFooter() {
  const pathname = usePathname()
  return pathname && isHomeChrome(pathname) ? <HomeFooter /> : <Footer />
}
