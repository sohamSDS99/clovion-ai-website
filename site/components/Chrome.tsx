'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { HomeHeader } from './HomeHeader'
import { HomeFooter } from './HomeFooter'

// `/` and `/pricing` are intentionally NOT here — both light routes use the
// light Header/Footer. See app/page.tsx and app/pricing/page.tsx.
const HOME_ROUTES = new Set<string>(['/customers', '/about', '/changelog'])

// Prefix-matched dark-chrome sections — index + every nested/[slug] page.
// `/blog` and `/resources` are intentionally absent — the whole content system
// is light, so it uses the light Header/Footer (light + orange going forward).
const HOME_PREFIXES = ['/news', '/webinars', '/faq', '/compare', '/alternatives', '/docs', '/legal']

// Light exceptions inside an otherwise-dark prefix — must mirror ThemeShell's
// LIGHT_EXCEPTIONS so these pages get the light Header/Footer to match their
// rebranded light palette.
const LIGHT_EXCEPTIONS = new Set<string>(['/compare/clovion-vs-peec-ai', '/compare/clovion-vs-otterly', '/compare/clovion-vs-searchable', '/legal/privacy', '/legal/terms'])

function isHomeChrome(pathname: string): boolean {
  if (LIGHT_EXCEPTIONS.has(pathname)) return false
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
