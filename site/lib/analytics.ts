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

// Compact intent for the event name, derived from the button's visible text
// (or the pricing plan name). Keeps names short and human-scannable.
function buttonIntent(textOrIntent: string): string {
  const t = textOrIntent.toLowerCase()
  if (t.includes('free trial')) return 'free_trial'
  if (t.includes('free score')) return 'free_score'
  if (t.includes('demo')) return 'book_demo'
  if (t.includes('talk to sales')) return 'sales'
  if (t.includes('expert')) return 'expert'
  if (t.includes('log in') || t.includes('login')) return 'login'
  if (t.includes('sign up') || t.includes('signup')) return 'signup'
  return eventSafe(textOrIntent)
}

// Verbose location/page slugs compressed so every event name fits GA4's
// hard 40-char cap (names over 40 chars are dropped by GA4).
const LOCATION_SQUEEZES: [RegExp, string][] = [
  [/^tools_/, ''],
  [/^features_/, ''],
  [/_generator/, ''],
  [/_checker/, ''],
  [/^alternatives_/, 'alt_'],
  [/^compare_clovion_vs_/, 'compare_'],
  [/^blog_category_/, 'blog_'],
  [/^free_ai_visibility_score/, 'free_score'],
  [/^geo_improvement_suggestions/, 'geo'],
  [/^ai_visibility_tracking/, 'ai_visibility'],
  [/^sentiment_analysis/, 'sentiment'],
  [/^brand_perception/, 'brand'],
  [/^platform_coverage/, 'platform'],
  [/^ai_crawlability/, 'ai_crawl']
]

function compactLocation(loc: string): string {
  let out = loc
  for (const [re, sub] of LOCATION_SQUEEZES) out = out.replace(re, sub)
  return out
}

// Per-button GA4 EVENT NAME: <location>_<intent>_click, e.g.
//   home_hero_free_trial_click        (Start Free Trial, homepage hero)
//   home_final_cta_free_trial_click   (same button text, pre-footer)
//   pricing_card_growth_click         (Growth tier card)
//   pricing_header_login_click        (Log in, header while on /pricing)
// Sent via GTM's dynamic-Event-Name tag ("GA4 Event - per button"), so every
// button instance surfaces as its own row in GA4's Events report.
export function buttonEvent(location: string, textOrIntent: string): string {
  const prefixed = SHARED_LOCATIONS.has(location) ? `${pageSlug()}_${location}` : location
  const loc = compactLocation(eventSafe(prefixed))
  const name = `${loc}_${buttonIntent(textOrIntent)}_click`
  return name.slice(0, 40).replace(/^_+|_+$/g, '')
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
      button_event: buttonEvent(location, text)
    }),

  startTrial: (location: string, plan?: string, text = 'Start Free Trial') =>
    track({
      event: 'start_trial',
      cta_location: location,
      cta_text: text,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, text),
      ...(plan ? { plan_name: plan } : {})
    }),

  getFreeScore: (location: string, text = 'Get Free Score') =>
    track({
      event: 'get_free_score',
      cta_location: location,
      cta_text: text,
      button_id: buttonId(location, text),
      button_event: buttonEvent(location, text)
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
      event: 'form_submit',
      form_name: formName,
      cta_location: location,
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
    track({
      event: 'page_view',
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : ''
    })
}
