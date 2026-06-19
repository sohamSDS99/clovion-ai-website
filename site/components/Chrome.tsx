'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { HomeHeader } from './HomeHeader'
import { HomeFooter } from './HomeFooter'

const HOME_ROUTES = new Set<string>(['/'])

export function ChromeHeader() {
  const pathname = usePathname()
  return pathname && HOME_ROUTES.has(pathname) ? <HomeHeader /> : <Header />
}

export function ChromeFooter() {
  const pathname = usePathname()
  return pathname && HOME_ROUTES.has(pathname) ? <HomeFooter /> : <Footer />
}
