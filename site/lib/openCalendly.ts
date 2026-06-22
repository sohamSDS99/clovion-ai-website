import { CALENDLY_URL } from './calendly'
import { track } from './analytics'

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void }
  }
}

export function openCalendly(location?: string, plan?: string) {
  if (location) {
    track({
      event: 'book_demo',
      cta_location: location,
      ...(plan ? { plan_name: plan } : {})
    })
  }
  if (typeof window !== 'undefined' && window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL })
  } else if (typeof window !== 'undefined') {
    window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
  }
}
