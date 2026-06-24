'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/analytics'

// Fires a page_view on client-side route changes only.
// GTM's container fires its own pageview on the initial load via gtm.js,
// the Meta Pixel bootstrap fires its own PageView, and the LinkedIn
// Insight Tag fires its own beacon when insight.min.js loads, so we
// skip the first render to avoid triple-counting on initial load.
export function RouteTracker() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    analytics.pageView(pathname)
    const w = window as unknown as {
      fbq?: (...args: unknown[]) => void
      lintrk?: (...args: unknown[]) => void
    }
    w.fbq?.('track', 'PageView')
    w.lintrk?.('track', { conversion_id: '' })
  }, [pathname])

  return null
}
