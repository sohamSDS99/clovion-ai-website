import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

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
    google: 'Of0ydr1XJckA0sM0jA4HEKUzVOxrgvB-6R6ti5P3EjQ'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${saans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-QXKYL1Z4LB" />
    </html>
  )
}
