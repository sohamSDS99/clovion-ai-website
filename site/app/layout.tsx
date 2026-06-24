import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono, Hanken_Grotesk } from 'next/font/google'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ChromeHeader, ChromeFooter } from '@/components/Chrome'
import { ThemeShell } from '@/components/ThemeShell'
import { RouteTracker } from '@/components/RouteTracker'
import { LeadCaptureModal } from '@/components/LeadCaptureModal'

// Inline pre-hydration script — applies the .clv-dark scope synchronously
// for routes that ship dark (currently just `/`) so the body bg paints
// black from the first frame instead of cream→black flickering after
// ThemeShell's useEffect runs. Mirrors ThemeShell's DARK_ROUTES set.
const themeBootstrap = `(function(){try{var p=location.pathname;var pre=['/blog','/news','/webinars','/resources','/faq','/compare','/alternatives','/docs','/legal'];var darkPre=pre.some(function(x){return p===x||p.indexOf(x+'/')===0;});if(p==='/'||p==='/features/ai-visibility-tracking'||p==='/features/geo-improvement-suggestions'||p==='/features/sentiment-analysis'||p==='/features/fanout-query'||p==='/features/ai-crawlability'||p==='/features/platform-coverage'||p==='/pricing'||p==='/affiliate'||p==='/free-ai-visibility-score'||p==='/customers'||p==='/about'||p==='/changelog'||p==='/blog'||p==='/blog/category/geo'||p==='/blog/category/ai-search'||p==='/blog/category/seo'||darkPre)document.documentElement.classList.add('clv-dark');}catch(_){}})();`

// Microsoft Clarity — session recordings + heatmaps. Project x8d3ot6py2.
// Loads asynchronously; the snippet queues calls until the remote script
// (https://www.clarity.ms/tag/x8d3ot6py2) loads and replays them.
const clarityBootstrap = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "x8d3ot6py2");`

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
  metadataBase: new URL('https://clovion.ai'),
  openGraph: {
    title: 'Clovion AI — Track your brand visibility in AI search',
    description: 'See how AI engines describe your brand. Fix what is holding you back. Across ChatGPT, Claude, Perplexity, Gemini, and AI Overviews.',
    type: 'website'
  },
  verification: {
    google: 'Of0ydr1XJckA0sM0jA4HEKUzVOxrgvB-6R6ti5P3EjQ',
    other: {
      'msvalidate.01': '1D569DC0A94228D66B05E262EAD9C8F5'
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
        <link
          rel="stylesheet"
          href="https://assets.calendly.com/assets/external/widget.css"
        />
        <script
          async
          src="https://assets.calendly.com/assets/external/widget.js"
        />
      </head>
      <GoogleTagManager gtmId="GTM-WHCPZS4P" />
      <body className="font-sans antialiased">
        <ThemeShell />
        <RouteTracker />
        <ChromeHeader />
        <main>{children}</main>
        <ChromeFooter />
        <LeadCaptureModal />
      </body>
      <GoogleAnalytics gaId="G-QXKYL1Z4LB" />
    </html>
  )
}
