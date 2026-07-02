// dataLayer push helper for GTM (GTM-WHCPZS4P) → GA4 (G-QXKYL1Z4LB).
// Event names match Custom Event triggers configured in the GTM container.
//
// Every click-style event carries a `button_id` — a globally unique identity
// for the exact button INSTANCE that was clicked:
//
//   <page-slug>__<cta_location>__<button-text-slug>
//
//   home__home_hero__start-free-trial        (homepage hero)
//   home__home_final_cta__start-free-trial   (same button text, pre-footer)
//   pricing__final_cta__start-free-trial     (same text, /pricing CTABanner)
//
// Two visually identical buttons — same text, same event — on different pages
// or in different slots of the same page never collapse into one entity.
// Register `button_id` as an event-scoped custom dimension in GA4
// (Admin → Custom definitions) so it surfaces in reports.

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

// "Start Free Trial" → "start-free-trial"
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// "/features/ai-visibility-tracking" → "features-ai-visibility-tracking"; "/" → "home"
export function pageSlug(path?: string): string {
  const p = path ?? (typeof window !== 'undefined' ? window.location.pathname : '')
  const cleaned = p.replace(/\/+$/, '').replace(/^\/+/, '')
  return cleaned ? slugify(cleaned) : 'home'
}

// Unique per-button-instance identity. `path` is optional: omitted, it reads
// window.location.pathname at click time. The Button primitive passes
// usePathname() at render time so the data-btn-id DOM attribute matches.
export function buttonId(location: string, text?: string, path?: string): string {
  const parts = [pageSlug(path), slugify(location)]
  const t = text ? slugify(text) : ''
  if (t) parts.push(t)
  return parts.join('__')
}

// GA4-safe event-name characters: lowercase letters, digits, underscores.
function eventSafe(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

// Locations rendered by shared chrome/components on many pages — these need
// a page prefix or identical buttons on different pages collapse again.
const SHARED_LOCATIONS = new Set(['header', 'header_mobile', 'final_cta'])

// Per-button GA4 EVENT NAME, e.g. home_hero_start_free_trial. Sent alongside
// the semantic event via GTM's dynamic-Event-Name tag ("GA4 Event - per
// button"), so every button surfaces as its own row in GA4's Events report.
// GA4 hard-caps event names at 40 chars — longer names are silently dropped,
// hence the slice.
export function buttonEvent(location: string, intent: string): string {
  const loc = SHARED_LOCATIONS.has(location) ? `${pageSlug()}_${location}` : location
  return eventSafe(`${loc}_${intent}`).slice(0, 40).replace(/_+$/, '')
}

export const analytics = {
  ctaClick: (text: string, location: string, url?: string) =>
    track({
      event: 'cta_click',
      cta_text: text,
      cta_location: location,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, text),
      ...(url ? { link_url: url } : {})
    }),

  bookDemo: (location: string, text = 'Book a Demo') =>
    track({
      event: 'book_demo',
      cta_location: location,
      cta_text: text,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, 'book_demo')
    }),

  startTrial: (location: string, plan?: string, text = 'Start Free Trial') =>
    track({
      event: 'start_trial',
      cta_location: location,
      cta_text: text,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, 'start_trial'),
      ...(plan ? { plan_name: plan } : {})
    }),

  getFreeScore: (location: string, text = 'Get Free Score') =>
    track({
      event: 'get_free_score',
      cta_location: location,
      cta_text: text,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, 'free_score')
    }),

  pricingClick: (plan: string, location: string, text?: string) =>
    track({
      event: 'pricing_click',
      plan_name: plan,
      cta_location: location,
      ...(text ? { cta_text: text } : {}),
      button_id: buttonId(location, text || plan),
      button_event: buttonEvent(location, plan)
    }),

  formSubmit: (formName: string, location: string) =>
    track({
      event: 'generate_lead',
      form_name: formName,
      form_location: location,
      button_id: buttonId(location, formName),
      button_event: buttonEvent(location, 'lead')
    }),

  fileDownload: (fileName: string, url: string) =>
    track({
      event: 'file_download',
      file_name: fileName,
      link_url: url,
      button_id: buttonId('file_download', fileName),
      button_event: buttonEvent('file_download', fileName)
    }),

  pageView: (path: string) =>
    track({ event: 'page_view', page_path: path })
}
