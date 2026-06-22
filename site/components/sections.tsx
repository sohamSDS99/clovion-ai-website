'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Container, Section, Button, Eyebrow, Tag, ArrowRight, Check } from './ui'
import { cn } from '@/lib/cn'
import { customers, aiEngines, faqs as defaultFaqs, testimonials as defaultTestimonials } from '@/lib/content'
import { openCalendly } from '@/lib/openCalendly'
import Link from 'next/link'

export function LogoMarquee({
  items = customers,
  eyebrow = 'Trusted by teams at',
  className
}: {
  items?: readonly string[]
  eyebrow?: string
  className?: string
}) {
  const doubled = [...items, ...items, ...items]
  return (
    <section className={cn('section-y-tight', className)}>
      <Container>
        <p className="text-center text-[0.82rem] uppercase tracking-[0.14em] text-ink-50 mb-10">{eyebrow}</p>
        <div className="overflow-hidden gradient-mask-edges">
          <div className="flex items-center gap-14 animate-marquee w-[300%]">
            {doubled.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="font-display text-2xl md:text-[1.7rem] tracking-[-0.02em] text-ink-40 hover:text-ink-80 transition-colors whitespace-nowrap"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export function AIEngineStrip({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {aiEngines.map((engine) => (
        <span
          key={engine}
          className="inline-flex h-8 items-center px-3 rounded-pill bg-white border border-line text-[0.82rem] text-ink-70 font-semibold"
        >
          {engine}
        </span>
      ))}
    </div>
  )
}

export function FAQ({
  items = defaultFaqs,
  heading = 'Frequently asked questions',
  sub = "If yours isn't here, drop us a line and we'll get back to you.",
  className
}: {
  items?: readonly { q: string; a: string }[]
  heading?: string
  sub?: string
  className?: string
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section className={className}>
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="display-md mt-5 text-balance">{heading}</h2>
            <p className="lead mt-5 max-w-xl mx-auto text-balance">{sub}</p>
            <div className="mt-8 inline-flex justify-center">
              <Button href="/contact" variant="secondary" size="sm">
                Talk to us <ArrowRight />
              </Button>
            </div>
          </div>

          <ul className="mt-16 divide-y divide-line border-y border-line">
            {items.map((item, idx) => {
              const isOpen = open === idx
              return (
                <li key={item.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full text-left py-6 flex items-start gap-6 group"
                    aria-expanded={isOpen}
                  >
                    <span className="display-sm flex-1 text-[1.15rem] md:text-[1.3rem] font-semibold leading-snug">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        'mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isOpen ? 'bg-ink text-white rotate-45 border-ink' : 'group-hover:border-ink/20'
                      )}
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-12 text-[1rem] leading-relaxed text-ink-70">{item.a}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </Section>
  )
}

export function CTABanner({
  heading,
  sub,
  body,
  primary,
  primaryHref = '/pricing',
  secondary,
  secondaryHref = '/contact'
}: {
  heading: string
  sub?: string
  body?: string
  primary: string
  primaryHref?: string
  secondary?: string
  secondaryHref?: string
}) {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-ink text-white px-8 md:px-14 py-16 md:py-24 isolate">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              background:
                'radial-gradient(ellipse 70% 80% at 80% 50%, rgba(10,10,15,0.18), transparent 65%)'
            }}
          />
          <div className="grid-bg absolute inset-0 -z-10 opacity-50 mix-blend-overlay" aria-hidden />
          <div className="max-w-2xl">
            {sub && <Eyebrow className="text-white/70">{sub}</Eyebrow>}
            <h2 className="display-lg mt-5 text-balance">{heading}</h2>
            {body && <p className="lead mt-6 text-white/70 max-w-xl">{body}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={primaryHref} variant="invert" size="lg" trackLocation="final_cta">
                {primary} <ArrowRight />
              </Button>
              {secondary &&
                (secondaryHref.startsWith('https://calendly.com') ? (
                  <a
                    href={secondaryHref}
                    onClick={(e) => {
                      e.preventDefault()
                      openCalendly('final_cta')
                    }}
                    className="btn h-12 px-6 text-base text-white border border-white/15 hover:bg-white/5 cursor-pointer"
                  >
                    {secondary}
                  </a>
                ) : /^(https?:|mailto:|tel:)/i.test(secondaryHref) ? (
                  <a
                    href={secondaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn h-12 px-6 text-base text-white border border-white/15 hover:bg-white/5"
                  >
                    {secondary}
                  </a>
                ) : (
                  <Link
                    href={secondaryHref}
                    className="btn h-12 px-6 text-base text-white border border-white/15 hover:bg-white/5"
                  >
                    {secondary}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function StatStrip({
  items,
  eyebrow = 'Outcomes',
  heading = 'What customers see in the first 90 days.',
  sub
}: {
  items: { value: string; label: string }[]
  eyebrow?: string
  heading?: string
  sub?: string
}) {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="display-md mt-4 text-balance">{heading}</h2>
          {sub && <p className="lead mt-5 text-balance">{sub}</p>}
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line rounded-card overflow-hidden">
          {items.map((m) => (
            <li
              key={m.label}
              className="bg-white p-7 md:p-9 group transition-colors hover:bg-gradient-to-br hover:from-subtle/60 hover:to-white"
            >
              <div className="display-lg metric-glow inline-block font-display text-ink">
                {m.value}
              </div>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-70 max-w-[28ch]">{m.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

export function FeatureGrid({
  items,
  cols = 3,
  variant = 'default'
}: {
  items: { name: string; description: string; icon?: React.ReactNode }[]
  cols?: 2 | 3 | 4
  variant?: 'default' | 'bordered' | 'subtle'
}) {
  const colClass = cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
  return (
    <ul className={cn('grid gap-5', colClass)}>
      {items.map((it, i) => (
        <li
          key={it.name}
          className={cn(
            'p-7 rounded-card border transition-all duration-300 group',
            variant === 'bordered' ? 'bg-white border-line hover:border-ink/20 hover:shadow-soft hover:-translate-y-0.5' : '',
            variant === 'subtle' ? 'bg-subtle border-transparent hover:bg-white hover:border-line hover:shadow-soft hover:-translate-y-0.5' : '',
            variant === 'default' ? 'bg-white border-line hover:border-ink/20 hover:shadow-soft hover:-translate-y-0.5' : ''
          )}
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-subtle text-ink border border-line mb-5 transition-transform group-hover:scale-105">
            {it.icon ?? <span className="text-[0.78rem] font-semibold">{String(i + 1).padStart(2, '0')}</span>}
          </div>
          <h3 className="font-display text-[1.1rem] font-semibold tracking-[-0.02em]">{it.name}</h3>
          <p className="mt-2.5 text-[0.94rem] leading-relaxed text-ink-70">{it.description}</p>
        </li>
      ))}
    </ul>
  )
}

export function TestimonialPullQuote({
  quote,
  author,
  role,
  company,
  className
}: {
  quote: string
  author: string
  role: string
  company: string
  className?: string
}) {
  return (
    <Section className={className} bg="subtle">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <Tag>Customer story · {company}</Tag>
          <div className="relative">
            <span aria-hidden className="absolute -top-12 left-1/2 -translate-x-1/2 font-display text-[12rem] leading-none text-ink/10 select-none pointer-events-none">&ldquo;</span>
            <blockquote className="display-lg relative mt-8 text-balance leading-[1.1] font-semibold italic">
              &ldquo;{quote}&rdquo;
            </blockquote>
          </div>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div
              aria-hidden
              className="h-11 w-11 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-ink"
            />
            <div className="text-left">
              <div className="font-semibold text-[0.95rem]">{author}</div>
              <div className="text-[0.85rem] text-ink-60">
                {role} · {company}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function TestimonialRail({
  items = defaultTestimonials,
  eyebrow = 'Customer stories',
  heading = 'What customers are saying.',
  sub,
  className
}: {
  items?: typeof defaultTestimonials
  eyebrow?: string
  heading?: string
  sub?: string
  className?: string
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = useCallback((i: number) => {
    const item = itemRefs.current[i]
    if (!item) return
    item.scrollIntoView({ behavior: 'auto', inline: 'start', block: 'nearest' })
    setActiveIndex(i)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (mostVisible) {
          const idx = itemRefs.current.indexOf(mostVisible.target as HTMLElement)
          if (idx >= 0) setActiveIndex(idx)
        }
      },
      { root: rail, threshold: [0.55, 0.75, 1] }
    )

    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items.length])

  return (
    <Section bg="subtle" className={className}>
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="display-md mt-4 text-balance">{heading}</h2>
          {sub && <p className="lead mt-5 max-w-lg mx-auto text-balance">{sub}</p>}
        </div>
      </Container>

      <div className="relative gradient-mask-edges">
        <div
          ref={railRef}
          className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-proximity pb-6 px-6 lg:px-8"
          style={{ scrollPaddingLeft: '2rem', scrollPaddingRight: '2rem' }}
        >
          {items.map((t, i) => (
            <article
              key={`${t.author}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="card snap-start shrink-0 w-[320px] md:w-[380px] p-7 md:p-8 flex flex-col"
            >
              <div className="text-ink/15" aria-hidden>
                <svg width="28" height="22" viewBox="0 0 32 24" fill="currentColor">
                  <path d="M9 0C4.5 1 .5 5 .5 10v14h11V10H5C5 7 7.5 4 11 3L9 0zm14 0c-4.5 1-8.5 5-8.5 10v14h11V10H19c0-3 2.5-6 6-7L23 0z" />
                </svg>
              </div>
              <blockquote className="mt-5 text-[1rem] md:text-[1.05rem] leading-relaxed text-ink-80 flex-1 text-balance">
                {t.quote}
              </blockquote>
              <div className="mt-6 pt-6 border-t border-line flex items-center gap-3">
                <div
                  aria-hidden
                  className="h-10 w-10 rounded-full bg-ink/10 shrink-0 flex items-center justify-center text-[0.78rem] font-semibold text-ink-60"
                >
                  {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[0.92rem] truncate">{t.author}</div>
                  <div className="text-[0.82rem] text-ink-60 truncate">{t.role} · {t.company}</div>
                </div>
              </div>
            </article>
          ))}
          <div aria-hidden className="shrink-0 w-2" />
        </div>
      </div>

      <Container className="mt-10">
        <div
          role="tablist"
          aria-label="Customer story pagination"
          className="flex items-center justify-center gap-2"
        >
          {items.map((t, i) => {
            const isActive = activeIndex === i
            return (
              <button
                key={`${t.author}-dot-${i}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to story ${i + 1} of ${items.length} — ${t.author}, ${t.company}`}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 ease-out',
                  isActive
                    ? 'w-8 bg-ink'
                    : 'w-1.5 bg-ink/20 hover:bg-ink/40'
                )}
              />
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
