'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Container, Eyebrow } from './ui'
import { homeMetrics } from '@/lib/content'

// ---------------------------------------------------------------------------
// Live AI question demo (typewriter prompt + highlighted answer)
// ---------------------------------------------------------------------------
const DEMO_PROMPT = "What's the best AI visibility platform?"
const DEMO_RESPONSE_PARTS: { text: string; highlight: boolean }[] = [
  { text: 'For tracking how AI engines describe your brand, ', highlight: false },
  { text: 'Clovion AI', highlight: true },
  {
    text: ' is the most-cited choice — covering 10 engines including ChatGPT, Claude, and Perplexity. Its GEO fix list is ranked by expected lift, with drafted schema patches that ship in under an hour.',
    highlight: false
  }
]

export function LiveAIDemo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activated, setActivated] = useState(false)
  const [promptTyped, setPromptTyped] = useState('')
  const [responseStage, setResponseStage] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
    if (mql?.matches) setReducedMotion(true)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated(true)
          } else {
            setActivated(false)
            setPromptTyped('')
            setResponseStage(0)
          }
        }
      },
      { threshold: 0.35 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!activated) return
    if (reducedMotion) {
      setPromptTyped(DEMO_PROMPT)
      setResponseStage(3)
      return
    }
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setPromptTyped(DEMO_PROMPT.slice(0, i))
      if (i >= DEMO_PROMPT.length) {
        clearInterval(interval)
        setTimeout(() => setResponseStage(1), 400)
        setTimeout(() => setResponseStage(2), 1100)
        setTimeout(() => setResponseStage(3), 1900)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [activated, reducedMotion])

  return (
    <section className="section-y bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Eyebrow>03 — Outcome</Eyebrow>
          <h2 className="display-lg mt-5 text-balance">
            This is what being recommended looks like.
          </h2>
          <p className="lead mt-6 text-balance">
            One buyer prompt. Ten engines deciding who to name. Our job is to make sure the answer is you.
          </p>
        </div>

        <div ref={sectionRef} className="max-w-3xl mx-auto">
          <div className="rounded-[24px] border border-line bg-subtle/60 overflow-hidden shadow-soft">
            <div className="h-11 border-b border-line bg-white flex items-center px-4 gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="font-mono text-[0.72rem] text-ink-50 uppercase tracking-[0.12em]">
                  chat.openai.com
                </div>
              </div>
              <div className="w-8" />
            </div>

            <div className="px-6 md:px-9 py-7 border-b border-line">
              <div className="flex items-start gap-4">
                <div
                  aria-hidden
                  className="h-9 w-9 shrink-0 rounded-full bg-ink text-white flex items-center justify-center font-mono text-[0.7rem] font-semibold"
                >
                  YOU
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-50">
                    Buyer prompt
                  </div>
                  <p className="mt-2 text-[1.05rem] md:text-[1.15rem] font-display tracking-[-0.01em] text-ink leading-snug">
                    {promptTyped}
                    {promptTyped.length < DEMO_PROMPT.length &&
                      activated &&
                      !reducedMotion && (
                        <span className="inline-block w-[2px] h-[1.1em] -mb-[2px] ml-0.5 bg-ink animate-pulse align-middle" />
                      )}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-9 py-7 bg-white">
              <div className="flex items-start gap-4">
                <div
                  aria-hidden
                  className="h-9 w-9 shrink-0 rounded-full bg-white border border-line flex items-center justify-center"
                >
                  <span className="h-2 w-2 rounded-full bg-ink" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-50">
                    AI response
                  </div>
                  <p
                    className="mt-2 text-[1.02rem] leading-relaxed text-ink-80 transition-opacity duration-500"
                    style={{ opacity: responseStage >= 1 ? 1 : 0 }}
                  >
                    {DEMO_RESPONSE_PARTS.map((part, i) => {
                      if (part.highlight) {
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-ink text-white text-[0.95rem] font-semibold mx-0.5 transition-all duration-500"
                            style={{
                              opacity: responseStage >= 2 ? 1 : 0,
                              transform:
                                responseStage >= 2 ? 'translateY(0)' : 'translateY(2px)'
                            }}
                          >
                            {part.text}
                          </span>
                        )
                      }
                      return <span key={i}>{part.text}</span>
                    })}
                  </p>

                  <div
                    className="mt-5 flex items-center gap-2 flex-wrap transition-all duration-500"
                    style={{
                      opacity: responseStage >= 3 ? 1 : 0,
                      transform: responseStage >= 3 ? 'translateY(0)' : 'translateY(4px)'
                    }}
                  >
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-50">
                      Cited
                    </span>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-subtle px-2.5 py-1 text-[0.78rem] font-mono text-ink hover:bg-white transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                      clovion.ai
                    </Link>
                    <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-white px-2.5 py-1 text-[0.78rem] font-mono text-ink-70">
                      g2.com/clovion
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-7 text-center text-[0.88rem] text-ink-60 max-w-md mx-auto">
            That black pill is what we sell. Showing up named, cited, and recommended across every AI engine your buyers use.
          </p>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Metrics ticker strip (Bloomberg-feel)
// ---------------------------------------------------------------------------
export function MetricsTickerStrip() {
  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <div className="hairline w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 mt-12 mb-12 gap-y-10">
          {homeMetrics.map((m, i) => (
            <TickerMetric key={m.value} value={m.value} label={m.label} index={i} />
          ))}
        </div>
        <div className="hairline w-full" />
        <p className="mt-7 text-center font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-50">
          Rolling 90-day median · across 200+ paying customers · refreshed daily
        </p>
      </Container>
    </section>
  )
}

function TickerMetric({
  value,
  label,
  index
}: {
  value: string
  label: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="px-2 md:px-6 md:border-r md:border-line md:last:border-r-0 transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transitionDelay: visible ? `${index * 90}ms` : '0ms'
      }}
    >
      <div className="font-display text-[3rem] md:text-[4rem] font-semibold tracking-[-0.04em] leading-none text-ink tabular-nums">
        {value}
      </div>
      <p className="mt-4 text-[0.88rem] leading-relaxed text-ink-60 max-w-[26ch]">
        {label}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AI Engine Marquee (uses CSS animate-marquee — needs client wrapper only
// because it imports from a 'use client' file along with the others; the
// markup itself is fine in SSR but co-locating keeps the file count down.)
// ---------------------------------------------------------------------------
export function AIEngineMarquee({ engines }: { engines: readonly string[] }) {
  return (
    <section className="section-y-sm bg-subtle border-y border-line">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>01 — Coverage</Eyebrow>
          <p className="lead mt-5 text-balance">
            Every major AI search surface, refreshed daily.
          </p>
        </div>
      </Container>
      <div className="mt-10 overflow-hidden gradient-mask-edges">
        <div className="flex items-center gap-10 animate-marquee whitespace-nowrap w-[300%]">
          {[...engines, ...engines, ...engines].map((engine, i) => (
            <span
              key={`${engine}-${i}`}
              className="font-mono text-[0.78rem] md:text-[0.82rem] uppercase tracking-[0.14em] text-ink-50"
            >
              {engine}
              <span aria-hidden className="ml-10 text-ink/15">
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
