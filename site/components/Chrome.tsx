'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { HomeHeader } from './HomeHeader'
import { HomeFooter } from './HomeFooter'

const HOME_ROUTES = new Set<string>(['/', '/features/ai-visibility-tracking', '/features/geo-improvement-suggestions', '/features/sentiment-analysis', '/features/fanout-query', '/features/ai-crawlability', '/pricing', '/affiliate', '/free-ai-visibility-score'])

export function ChromeHeader() {
  const pathname = usePathname()
  return pathname && HOME_ROUTES.has(pathname) ? <HomeHeader /> : <Header />
}

export function ChromeFooter() {
  const pathname = usePathname()
  return pathname && HOME_ROUTES.has(pathname) ? <HomeFooter /> : <Footer />
}
