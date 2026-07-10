/**
 * Site-wide default share image. Points at the generated app/opengraph-image
 * route (1200x630 PNG). Next replaces the whole `openGraph` object when a page
 * declares its own, so a root default doesn't cascade — pages with a custom
 * openGraph spread this in to keep a share image. CMS pages fall back to it
 * when a post has no cover/OG image of its own.
 */
export const OG_IMAGES = [
  {
    url: '/opengraph-image',
    width: 1200,
    height: 630,
    alt: 'Clovion AI — Track your brand visibility in AI search',
  },
]
