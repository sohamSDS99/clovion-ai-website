import { CALENDLY_URL } from './calendly'
import { track, buttonId, buttonEvent } from './analytics'

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void }
  }
}

// `text` is the visible button label — pass it from the callsite so the
// button_id (<page>__<location>__<text-slug>) identifies this exact button.
export function openCalendly(location?: string, plan?: string, text = 'Talk to Sales') {
  if (location) {
    track({
      event: 'book_demo',
      cta_location: location,
      cta_text: text,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, text),
      ...(plan ? { plan_name: plan } : {})
    })
  }
  if (typeof window !== 'undefined' && window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL })
  } else if (typeof window !== 'undefined') {
    window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
  }
}
