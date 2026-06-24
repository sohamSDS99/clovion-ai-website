'use client'

import { useEffect, useRef, useState } from 'react'
import { Container, Section, Eyebrow, Check } from '@/components/ui'

// -----------------------------------------------------------------------------
// Scroll-locked suggestion walkthrough.
// Three pinned stages drive a sticky canvas on the right.
// IntersectionObserver picks which stage is in view.
// -----------------------------------------------------------------------------

export function WalkthroughSection() {
  const [stage, setStage] = useState(0)
  const ref0 = useRef<HTMLDivElement | null>(null)
  const ref1 = useRef<HTMLDivElement | null>(null)
  const ref2 = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const refs = [ref0, ref1, ref2]
    const observers: IntersectionObserver[] = []
    refs.forEach((ref, i) => {
      if (!ref.current) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
              setStage(i)
            }
          })
        },
        { threshold: [0.55, 0.75], rootMargin: '-25% 0px -25% 0px' }
      )
      obs.observe(ref.current)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>Walk one through</Eyebrow>
          <h2 className="display-md mt-5 text-balance">
            One suggestion, from detected to resolved.
          </h2>
          <p className="lead mt-5 max-w-2xl text-balance">
            Scroll. The state on the right updates with each step. This is how every fix flows through the queue.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16">
          <div className="space-y-[55vh]">
            <div ref={ref0} className="min-h-[40vh]">
              <StageNumber active={stage === 0} num="01" />
              <h3 className="display-sm mt-4 font-semibold">Detected</h3>
              <p className="mt-3 text-[rgb(var(--ink-rgb)/70%)] leading-relaxed max-w-md">
                Our crawler reads /pricing daily. Today, it noticed no JSON-LD in the head. Severity HIGH because the page drives 41% of your buyer-intent queries. Estimated lift: +6 visibility points.
              </p>
            </div>
            <div ref={ref1} className="min-h-[40vh]">
              <StageNumber active={stage === 1} num="02" />
              <h3 className="display-sm mt-4 font-semibold">Suggested fix</h3>
              <p className="mt-3 text-[rgb(var(--ink-rgb)/70%)] leading-relaxed max-w-md">
                We draft the JSON-LD using the schema your category cites most. Product, Offer, and AggregateRating wired with your actual pricing tiers. Copy, paste, ship.
              </p>
            </div>
            <div ref={ref2} className="min-h-[40vh]">
              <StageNumber active={stage === 2} num="03" />
              <h3 className="display-sm mt-4 font-semibold">Resolved</h3>
              <p className="mt-3 text-[rgb(var(--ink-rgb)/70%)] leading-relaxed max-w-md">
                Once the fix ships, our crawler verifies the markup, the score recomputes against the next refresh of tracked prompts, and the suggestion closes itself. Score moves from 67 to 73.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-32 h-fit">
            <WalkthroughCanvas stage={stage} />
          </div>
        </div>
      </Container>
    </Section>
  )
}

function StageNumber({ active, num }: { active: boolean; num: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          'inline-flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[0.7rem] transition-all duration-500 ' +
          (active ? 'bg-ink text-white border-[var(--ink)]' : 'bg-[var(--white)] text-[rgb(var(--ink-rgb)/50%)] border-[var(--line)]')
        }
      >
        {num}
      </span>
      <span
        className={
          'font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-500 ' +
          (active ? 'text-[var(--ink)]' : 'text-[rgb(var(--ink-rgb)/40%)]')
        }
      >
        {active ? 'In view' : 'Up next'}
      </span>
    </div>
  )
}

function WalkthroughCanvas({ stage }: { stage: number }) {
  return (
    <div className="relative">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)] bg-[var(--white)]">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--ink-rgb)/30%)]" />
            <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--ink-rgb)/30%)]" />
            <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--ink-rgb)/30%)]" />
          </div>
          <div className="font-mono text-[0.7rem] text-[rgb(var(--ink-rgb)/50%)]">suggestion://geo-0421</div>
          <div className="font-mono text-[0.7rem] text-[rgb(var(--ink-rgb)/50%)]">
            {stage === 0 && 'OPEN'}
            {stage === 1 && 'IN PROGRESS'}
            {stage === 2 && 'RESOLVED'}
          </div>
        </div>

        <div className="p-7 min-h-[460px] relative">
          <div
            className={
              'transition-opacity duration-500 ' +
              (stage === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-7')
            }
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-5 items-center rounded-full bg-ink text-white px-2 font-mono text-[0.62rem] tracking-wider shrink-0 mt-0.5">
                HIGH
              </span>
              <div>
                <div className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] leading-snug">
                  No JSON-LD on /pricing
                </div>
                <div className="font-mono text-[0.72rem] text-[rgb(var(--ink-rgb)/50%)] mt-2">
                  /pricing · last crawled 11m ago
                </div>
              </div>
            </div>
            <ul className="mt-7 space-y-3 text-[0.9rem] text-[rgb(var(--ink-rgb)/70%)]">
              <li className="flex gap-3"><span className="text-[rgb(var(--ink-rgb)/40%)]">•</span> Drives 41% of buyer-intent queries</li>
              <li className="flex gap-3"><span className="text-[rgb(var(--ink-rgb)/40%)]">•</span> Competitor pages all carry Product + Offer markup</li>
              <li className="flex gap-3"><span className="text-[rgb(var(--ink-rgb)/40%)]">•</span> Estimated lift: <span className="font-semibold text-[var(--ink)]">+6 visibility points</span></li>
              <li className="flex gap-3"><span className="text-[rgb(var(--ink-rgb)/40%)]">•</span> Effort: 12 minutes</li>
            </ul>
            <div className="mt-7 inline-flex items-center gap-2 text-[0.78rem] text-[rgb(var(--ink-rgb)/60%)] font-mono">
              Δshare × promptVolume × engineWeight / effortHours = <span className="text-[var(--ink)]">+6.0</span>
            </div>
          </div>

          <div
            className={
              'transition-opacity duration-500 ' +
              (stage === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-7')
            }
          >
            <div className="font-mono text-[0.7rem] uppercase tracking-wider text-[rgb(var(--ink-rgb)/50%)]">
              Generated JSON-LD · Product + Offer
            </div>
            <div className="mt-3 code-block text-[0.78rem] leading-relaxed">
              <pre className="whitespace-pre-wrap">{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Clovion AI",
  "description": "AI visibility platform.",
  "brand": { "@type": "Brand", "name": "Clovion" },
  "offers": [
    { "@type": "Offer", "name": "Starter", "price": "99" },
    { "@type": "Offer", "name": "Growth",  "price": "399" }
  ]
}`}</pre>
            </div>
            <div className="mt-5 flex items-center gap-2 text-[0.82rem] text-[rgb(var(--ink-rgb)/60%)]">
              <Check className="text-[var(--ink)]" /> Validated against Schema.org · 1.2 KB minified
            </div>
          </div>

          <div
            className={
              'transition-opacity duration-500 ' +
              (stage === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-7')
            }
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-3 py-1 font-mono text-[0.7rem] tracking-wider">
              <Check /> RESOLVED
            </div>
            <div className="mt-6">
              <div className="font-mono text-[0.72rem] uppercase tracking-wider text-[rgb(var(--ink-rgb)/50%)]">
                Visibility score
              </div>
              <ScoreTick stage={stage} />
              <div className="mt-3 text-[0.82rem] text-[rgb(var(--ink-rgb)/60%)]">
                Recomputed against today&rsquo;s prompt refresh.
              </div>
            </div>
            <div className="mt-7 hairline w-full" />
            <ul className="mt-5 space-y-2 text-[0.9rem] text-[rgb(var(--ink-rgb)/70%)]">
              <li className="flex gap-3 items-center"><Check className="text-[var(--ink)]" /> Markup verified by crawler</li>
              <li className="flex gap-3 items-center"><Check className="text-[var(--ink)]" /> 3 engines re-cited /pricing within 48h</li>
              <li className="flex gap-3 items-center"><Check className="text-[var(--ink)]" /> Logged to changelog · GEO-0421</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreTick({ stage }: { stage: number }) {
  const [value, setValue] = useState(67)
  useEffect(() => {
    if (stage !== 2) {
      setValue(67)
      return
    }
    let raf = 0
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / 900)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(67 + Math.round(eased * 6))
      if (t < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [stage])

  return (
    <div className="flex items-baseline gap-4 mt-2">
      <div className="font-display text-[3.2rem] font-semibold tracking-[-0.04em] leading-none tabular-nums">
        {value}
      </div>
      <div className="font-mono text-[0.78rem] text-[rgb(var(--ink-rgb)/60%)]">
        from 67 · +{Math.max(0, value - 67)}
      </div>
    </div>
  )
}
