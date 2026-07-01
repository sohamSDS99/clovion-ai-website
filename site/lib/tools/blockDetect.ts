// Detects WAF/CDN block pages, bot challenges, and HTTP error pages so the
// crawler tools never mistake an interstitial's <title> ("503 Service
// Temporarily Unavailable", "Attention Required! | Cloudflare", "Access
// Denied") for real page content.
//
// Two independent checks, kept precise to avoid false positives on legitimate
// pages (e.g. a real SPA whose <noscript> says "enable JavaScript"):
//   - isErrorTitle(): the extracted <title> looks like an error/challenge page.
//   - looksLikeChallengeBody(): the body carries a known WAF challenge signature
//     even though the status was 2xx (soft-block served with HTTP 200).

// Error/challenge page titles. Anchored, specific phrases only — we do NOT match
// bare words like "unavailable" or "denied" that could appear in real titles.
const ERROR_TITLE_RE = new RegExp(
  [
    // Leading HTTP code FOLLOWED BY an error word ("503 Service…", "404 Not Found").
    // Requiring the word avoids nuking legit numeric titles like "500 GB SSD".
    '^\\s*\\d{3}\\s+(service|forbidden|not\\s+found|bad\\s+gateway|gateway\\s+time|unauthorized|internal\\s+server|too\\s+many|temporarily|request\\b|error\\b|unavailable|access\\s+denied|method\\s+not|proxy|conflict|gone)',
    '^\\s*\\d{3}\\s*$', // title is only an HTTP code, e.g. "404"
    '^\\s*(http\\s+)?error\\s+\\d{3}\\b',
    '^\\s*error\\b',
    'service (temporarily )?unavailable',
    'temporarily unavailable',
    '\\baccess denied\\b',
    '\\baccess to this page has been denied\\b',
    'attention required',
    'just a moment\\.{0,3}$',
    '^\\s*forbidden\\s*$',
    'bad gateway',
    'gateway time-?out',
    'too many requests',
    'request unsuccessful',
    'are you (a )?human',
    'verify you are (a )?human',
    'security check',
    'ddos-guard',
    // Description-shaped blocks (empty <title>, block text in meta description).
    'the requested url was rejected',
    'you have been blocked',
    'unable to access this (website|page)',
    'your request has been blocked',
    'one more step',
    'checking your browser',
    'this site can’?t be reached',
    '^\\s*page not found\\b', // soft-404 landing (anchored — don't scrub titles that merely mention it)
    '^\\s*not found\\s*$',
    '^\\s*(site|under)\\s+maintenance\\b',
  ].join('|'),
  'i',
)

// WAF challenge/block signatures that can accompany an HTTP-200 soft block.
// Each token is specific to a known vendor interstitial, so a normal page that
// merely mentions "JavaScript" or "cookies" does not trip it.
const CHALLENGE_BODY_RE = new RegExp(
  [
    'cf-chl-', // Cloudflare challenge
    '__cf_chl_', // Cloudflare challenge
    'challenge-platform', // Cloudflare
    'window\\._cf_chl_opt',
    'Enable JavaScript and cookies to continue', // Cloudflare managed challenge
    'Attention Required! \\| Cloudflare',
    'Checking if the site connection is secure', // Cloudflare
    'Incapsula incident ID', // Imperva
    'Request unsuccessful\\. Incapsula', // Imperva
    '_Incapsula_Resource', // Imperva
    'Powered by PerimeterX', // PerimeterX / HUMAN
    '_pxAppId', // PerimeterX
    'px-captcha', // PerimeterX
    "You don't have permission to access", // Akamai reference error
    'Reference&#32;#\\d', // Akamai
    'AkamaiGHost', // Akamai
    'ddos-guard', // DDoS-Guard
    'data-translate="checking_browser"', // Cloudflare legacy
  ].join('|'),
  'i',
)

/** True if a page <title> looks like an error / block / challenge interstitial. */
export function isErrorTitle(title: string): boolean {
  if (!title) return false
  return ERROR_TITLE_RE.test(title.trim())
}

/** True if a (typically HTTP-200) body carries a known WAF challenge signature. */
export function looksLikeChallengeBody(body: string): boolean {
  if (!body) return false
  // Only scan the head of the document — challenge markers live near the top and
  // this bounds the regex cost on large pages.
  return CHALLENGE_BODY_RE.test(body.slice(0, 20_000))
}

/**
 * Decide whether a fetched response is usable real content.
 * Blocked when: non-2xx, an HTML challenge body, or an error-looking <title>.
 */
export function isUsableContent(status: number, ok: boolean, body: string, title: string): boolean {
  if (!ok || status < 200 || status >= 300) return false
  if (looksLikeChallengeBody(body)) return false
  if (isErrorTitle(title)) return false
  return true
}
