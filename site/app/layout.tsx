import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono, Hanken_Grotesk } from 'next/font/google'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ChromeHeader, ChromeFooter } from '@/components/Chrome'
import { ThemeShell } from '@/components/ThemeShell'
import { RouteTracker } from '@/components/RouteTracker'

// Inline pre-hydration script — applies the .clv-dark scope synchronously
// for routes that ship dark so the body bg paints black from the first frame
// instead of cream→black flickering after ThemeShell's useEffect runs.
// Mirrors ThemeShell's DARK_ROUTES set. NOTE: `/` is intentionally absent —
// the homepage ships LIGHT (#FAF9F7); see app/page.tsx.
const themeBootstrap = `(function(){try{var p=location.pathname;var pre=['/news','/webinars','/faq','/compare','/alternatives','/legal'];var darkPre=pre.some(function(x){return p===x||p.indexOf(x+'/')===0;});if((p==='/customers'||p==='/changelog'||darkPre)&&p!=='/compare/clovion-vs-peec-ai'&&p!=='/compare/clovion-vs-otterly'&&p!=='/compare/clovion-vs-searchable'&&p!=='/compare/clovion-vs-profound'&&p!=='/legal/privacy'&&p!=='/legal/terms')document.documentElement.classList.add('clv-dark');}catch(_){}})();`

// Microsoft Clarity — session recordings + heatmaps. Project x8d3ot6py2.
// Loads asynchronously; the snippet queues calls until the remote script
// (https://www.clarity.ms/tag/x8d3ot6py2) loads and replays them.
const clarityBootstrap = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "x8d3ot6py2");`

// Meta Pixel — pixel id 1059601186732604. Fires initial PageView from the
// bootstrap; SPA route changes are picked up by RouteTracker.tsx so
// every client-side navigation also fires a Pixel PageView.
const metaPixelBootstrap = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1059601186732604');fbq('track','PageView');`

// LinkedIn Insight Tag — partner id 9552940. Sets up the lintrk queue,
// pushes the partner id into window._linkedin_data_partner_ids, then
// async-loads insight.min.js which fires the initial pageview beacon
// to px.ads.linkedin.com/wa/. SPA route changes re-fire via
// RouteTracker.tsx so client-side navs are tracked alongside fbq + GA4.
const linkedInBootstrap = `_linkedin_partner_id="9552940";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`

const saans = localFont({
  src: './fonts/Saans-TRIAL-SemiBold.otf',
  variable: '--font-saans',
  display: 'swap',
  weight: '600',
  style: 'normal'
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap'
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body-reg',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Clovion AI — Track your brand visibility in AI search',
    template: '%s | Clovion AI'
  },
  description:
    'Track your brand mentions across ChatGPT, Perplexity, Gemini, and AI Overviews. Get the GEO fixes that actually move the needle. Used by Linear, Ramp, Notion, and Vercel.',
  // www is the host that serves 200 (apex 301-redirects to it). Canonical and
  // OG URLs resolve against this, so they must point at www, not the redirect.
  metadataBase: new URL('https://www.clovion.ai'),
  openGraph: {
    title: 'Clovion AI — Track your brand visibility in AI search',
    description: 'See how AI engines describe your brand. Fix what is holding you back. Across ChatGPT, Claude, Perplexity, Gemini, and AI Overviews.',
    type: 'website'
  },
  // X/Twitter reads the large-image card + falls back to the OG image (the
  // site-wide app/opengraph-image, or a page's own). Inherited by every route
  // that doesn't set its own twitter block.
  twitter: {
    card: 'summary_large_image',
    site: '@clovionai',
    creator: '@clovionai'
  },
  verification: {
    google: 'Of0ydr1XJckA0sM0jA4HEKUzVOxrgvB-6R6ti5P3EjQ',
    other: {
      'msvalidate.01': '1D569DC0A94228D66B05E262EAD9C8F5',
      'facebook-domain-verification': 'jun19086bk3h816jakt4xojw9cq3vm'
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${saans.variable} ${mono.variable} ${hankenGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: clarityBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: metaPixelBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: linkedInBootstrap }} />
        <link
          rel="stylesheet"
          href="https://assets.calendly.com/assets/external/widget.css"
        />
        <script
          async
          src="https://assets.calendly.com/assets/external/widget.js"
        />
        {/* Tolt affiliate tracking — plain <script async> on purpose; next/script
            silently fails to load external scripts in this repo (same as Calendly). */}
        <script
          async
          src="https://files.tlt-cdn.com/tlt.js"
          data-tolt="pk_6W7tm3rWzsBJ8kP6M3GoJ1YX"
        />
      </head>
      <GoogleTagManager gtmId="GTM-WHCPZS4P" />
      <body className="font-sans antialiased">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://www.facebook.com/tr?id=1059601186732604&ev=PageView&noscript=1"
          />
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=9552940&fmt=gif"
          />
        </noscript>
        <ThemeShell />
        <RouteTracker />
        <ChromeHeader />
        <main>{children}</main>
        <ChromeFooter />
      </body>
      <GoogleAnalytics gaId="G-QXKYL1Z4LB" />
    </html>
  )
}
