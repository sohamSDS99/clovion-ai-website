'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/analytics'

// Fires a page_view on client-side route changes only.
// GTM's container fires its own pageview on the initial load via gtm.js,
// and the Meta Pixel bootstrap in app/layout.tsx fires its own PageView,
// so we skip the first render to avoid double-counting both.
export function RouteTracker() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    analytics.pageView(pathname)
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
    fbq?.('track', 'PageView')
  }, [pathname])

  return null
}
