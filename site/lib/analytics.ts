// dataLayer push helper for GTM (GTM-WHCPZS4P) → GA4 (G-QXKYL1Z4LB).
// Event names match Custom Event triggers configured in the GTM container.

type DataLayerEvent = Record<string, unknown> & { event: string }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function track(event: DataLayerEvent) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

export const analytics = {
  ctaClick: (text: string, location: string, url?: string) =>
    track({ event: 'cta_click', cta_text: text, cta_location: location, link_url: url }),

  bookDemo: (location: string) =>
    track({ event: 'book_demo', cta_location: location }),

  startTrial: (location: string, plan?: string) =>
    track({ event: 'start_trial', cta_location: location, plan_name: plan }),

  getFreeScore: (location: string) =>
    track({ event: 'get_free_score', cta_location: location }),

  pricingClick: (plan: string, location: string) =>
    track({ event: 'pricing_click', plan_name: plan, cta_location: location }),

  formSubmit: (formName: string, location: string) =>
    track({ event: 'generate_lead', form_name: formName, form_location: location }),

  fileDownload: (fileName: string, url: string) =>
    track({ event: 'file_download', file_name: fileName, link_url: url }),

  pageView: (path: string) =>
    track({ event: 'page_view', page_path: path })
}
