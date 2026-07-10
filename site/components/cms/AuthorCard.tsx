import type { CmsAuthor } from '@/lib/cms-types'

/**
 * Author bio block shown at the foot of a CMS article (blog / news / resource).
 * Complements the top byline (date · author) with the author's photo, job title,
 * short bio and a LinkedIn link. On-brand: strictly monochrome (the brand book
 * bans chromatic accents), Saans for the name, Hanken for the bio paragraph
 * (inherited from the `.clv-ai-vis-page p` scope). Dark-theme tokens auto-flip.
 *
 * Renders nothing unless the CMS actually returned a (public) author — the
 * public API only exposes an author when the profile opted into isPublic.
 */

function isLinkedInHost(hostname: string): boolean {
  return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')
}

/**
 * Turn one socials value into a safe, absolute LinkedIn href, or null.
 * The `socials` map is untrusted CMS data, so:
 *   - absolute URLs are ONLY trusted when they are https + a linkedin.com host
 *     (blocks an author pointing "linkedin" at an arbitrary/phishing/non-TLS URL),
 *   - a schemeless linkedin.com domain is upgraded to https and host-checked,
 *   - a bare handle is expanded to a profile URL ONLY when it came from the
 *     explicit `linkedin` key (a bare value under another key is not LinkedIn).
 */
function toLinkedInHref(value: string, fromLinkedInKey: boolean): string | null {
  const v = value.trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v)
      return u.protocol === 'https:' && isLinkedInHost(u.hostname) ? u.toString() : null
    } catch {
      return null
    }
  }
  if (/(^|\.)linkedin\.com(\/|$)/i.test(v)) {
    try {
      const u = new URL(`https://${v}`)
      return isLinkedInHost(u.hostname) ? u.toString() : null
    } catch {
      return null
    }
  }
  if (fromLinkedInKey) {
    const handle = v.replace(/^@/, '').replace(/^\/+/, '')
    if (/^[A-Za-z0-9._-]+$/.test(handle)) {
      return `https://www.linkedin.com/in/${handle}`
    }
  }
  return null
}

/** Resolve a LinkedIn URL from the flexible (untrusted) `socials` map: prefer an
 *  explicit `linkedin` key, then any value that is itself a LinkedIn URL. Every
 *  return is an absolute https linkedin.com URL or null. */
function linkedInUrl(socials?: Record<string, string>): string | null {
  if (!socials || typeof socials !== 'object') return null
  const entries = Object.entries(socials)
  for (const [key, value] of entries) {
    if (key.toLowerCase() !== 'linkedin' || typeof value !== 'string') continue
    const href = toLinkedInHref(value, true)
    if (href) return href
  }
  for (const [, value] of entries) {
    if (typeof value !== 'string') continue
    const href = toLinkedInHref(value, false)
    if (href) return href
  }
  return null
}

function initials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return parts || '?'
}

export function AuthorCard({ author }: { author: CmsAuthor | null | undefined }) {
  if (!author) return null
  const li = linkedInUrl(author.socials)
  // displayName is typed required, but the CMS payload is untrusted — fall back
  // so a blank value can't produce an empty name/alt/aria-label.
  const name =
    (typeof author.displayName === 'string' && author.displayName.trim()) || 'Author'

  return (
    <aside
      className="mt-14 border-t border-[var(--line)] pt-10"
      data-track-location="author_card"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-50)]">
        Written by
      </p>

      <div
        className="mt-4 flex flex-col gap-5 rounded-[20px] border border-[var(--line)] p-6 sm:flex-row sm:items-center sm:gap-6"
        style={{ background: 'var(--white)', boxShadow: 'var(--shadow-card)' }}
      >
        {/* Avatar — 80×80, round. CMS-hosted on an external host → plain <img>,
            matching the cover-image convention (no next/image). */}
        <div
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full"
          style={{ background: 'var(--subtle)' }}
        >
          {author.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatar}
              alt={name}
              width={80}
              height={80}
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-lg font-semibold text-[var(--ink-60)]">
              {initials(name)}
            </span>
          )}
          {/* On-top hairline (token-driven so it frames on light or dark). */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}
          />
        </div>

        {/* Identity + bio */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-lg font-semibold text-[var(--ink)]">
              {name}
            </span>
            {li && (
              <a
                href={li}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={`${name} on LinkedIn`}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-60)] transition-colors hover:border-[var(--ink-40)] hover:text-[var(--ink)]"
              >
                <LinkedInIcon />
              </a>
            )}
          </div>

          {author.title && (
            <p className="mt-0.5 text-sm text-[var(--ink-60)]">{author.title}</p>
          )}

          {author.bio && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-70)]">
              {author.bio}
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
