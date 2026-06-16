'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/analytics'

// Fires a page_view on client-side route changes only.
// GTM's container fires its own pageview on the initial load via gtm.js,
// so we skip the first render to avoid double-counting.
export function RouteTracker() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    analytics.pageView(pathname)
  }, [pathname])

  return null
}
