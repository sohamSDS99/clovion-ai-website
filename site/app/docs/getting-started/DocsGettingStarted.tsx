'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Section, Container, Card, ArrowRight, Check, HeroShade } from '@/components/ui'
import { docsSections } from '@/lib/content'

const toc = [
  { id: 'before-you-start', label: '01 — Before you start' },
  { id: 'create-workspace', label: '02 — Create a workspace' },
  { id: 'name-brand', label: '03 — Name your brand' },
  { id: 'pick-engines', label: '04 — Pick your engines' },
  { id: 'starter-prompts', label: '05 — Starter prompts' },
  { id: 'first-scan', label: '06 — First scan' },
  { id: 'what-happens-next', label: '07 — What happens next' },
  { id: 'common-issues', label: '08 — Common issues' },
  { id: 'next-doc', label: '09 — Connect GA4 + GSC' }
]

const engines = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Perplexity',
  'Google AIO',
  'Bing Copilot',
  'You.com',
  'Grok',
  'Meta AI',
  'Mistral'
]

const starterPrompts = [
  'best AI visibility tools for B2B SaaS',
  'how to track brand mentions in ChatGPT',
  'Clovion AI vs Profound vs Goodie',
  'what is generative engine optimization',
  'tools to measure share of voice in AI search'
]

const commonIssues = [
  {
    title: 'Domain not verified',
    detail: 'Add the TXT record we email you within 24 hours, or upload a verification HTML file to /.well-known/.'
  },
  {
    title: 'Google Search Console not connected',
    detail: 'Skip for now — first scan still runs. GSC unlocks citation-path recommendations after onboarding.'
  },
  {
    title: 'Brand name disambiguation',
    detail: 'If your name is a common word (Apex, North, Vector), add 2–3 disambiguating terms in Settings → Brand.'
  }
]

export default function DocsGettingStarted() {
  const [activeId, setActiveId] = useState(toc[0].id)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    toc.forEach((item) => {
      const el = document.getElementById(item.id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(item.id)
          })
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      {/* Hero strip */}
      <Section tight className="section-y-sm border-b border-[var(--line)] relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)]">
            <Link href="/resources" className="hover:text-[var(--ink)] transition-colors">Docs</Link>
            <span className="text-[rgb(var(--ink-rgb)/30%)]">/</span>
            <span className="text-[var(--ink)]">Getting started</span>
          </div>
          <h1 className="display-md mt-5 text-[var(--ink)]">Ship your first scan.</h1>
          <p className="lead mt-4 max-w-2xl text-[rgb(var(--ink-rgb)/70%)]">
            5-minute walkthrough · Last updated November 2026 · Difficulty: Easy
          </p>
        </Container>
      </Section>

      {/* 3-pane layout */}
      <Section tight className="!py-0 bg-bg">
        <Container>
          <div className="lg:hidden border-b border-[var(--line)] py-4">
            <button
              onClick={() => setNavOpen((v) => !v)}
              className="flex w-full items-center justify-between font-mono text-xs uppercase tracking-wider text-[var(--ink)]"
            >
              <span>Browse docs</span>
              <span className="text-[rgb(var(--ink-rgb)/50%)]">{navOpen ? '−' : '+'}</span>
            </button>
            {navOpen && (
              <div className="mt-4 space-y-5">
                {docsSections.map((section) => (
                  <div key={section.title}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--ink-rgb)/40%)] mb-2">
                      {section.title}
                    </div>
                    <ul className="space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} className="font-mono text-xs text-[rgb(var(--ink-rgb)/60%)] hover:text-[var(--ink)]">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-8 py-14">
            {/* Left rail */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)] mb-5">
                  Documentation
                </div>
                <nav className="space-y-7">
                  {docsSections.map((section) => (
                    <div key={section.title}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)] mb-3">
                        {section.title}
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item, i) => {
                          const isCurrent =
                            section.title === 'Getting started' && i === 0
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={
                                  isCurrent
                                    ? 'font-mono text-[12px] text-[var(--ink)] border-l-2 border-[var(--ink)] pl-3 -ml-3 block py-0.5'
                                    : 'font-mono text-[12px] text-[rgb(var(--ink-rgb)/55%)] hover:text-[var(--ink)] transition-colors block py-0.5 pl-3 -ml-3 border-l-2 border-transparent'
                                }
                              >
                                {item.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Center column */}
            <article className="col-span-12 lg:col-span-6 max-w-[720px]">
              {/* Step 1 - Before you start */}
              <section id="before-you-start" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 00</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Before you start.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Four things to have on hand. The whole flow takes five minutes if your DNS is in order, ten if it isn't.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'A verified work email — the link expires in 24 hours.',
                    'Your brand name as it should appear in AI answers (full form, not handle).',
                    'Primary domain you want tracked (root, not subdomain).',
                    'Five minutes of uninterrupted attention. Coffee optional.'
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <Check />
                      <span className="text-[15px] leading-[1.7] text-[rgb(var(--ink-rgb)/80%)]">{line}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="hairline my-14" />

              {/* Step 2 - Create workspace */}
              <section id="create-workspace" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 01</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Create a workspace.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Workspaces hold one brand and its competitors. Free trial gets one workspace; Scale tier gets unlimited.
                  You can rename it later.
                </p>
                <div className="code-block mt-6">
                  <div className="flex items-center gap-2 border-b border-[rgb(var(--ink-rgb)/10%)] pb-3 mb-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--ink-rgb)/10%)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--ink-rgb)/10%)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--ink-rgb)/10%)]" />
                    </div>
                    <div className="font-mono text-[10px] text-[rgb(var(--ink-rgb)/40%)] ml-2">app.clovion.ai/setup</div>
                  </div>
                  <code className="font-mono text-[12.5px] text-[rgb(var(--ink-rgb)/80%)] leading-relaxed">
                    <span className="text-[rgb(var(--ink-rgb)/40%)]">{'>'} </span>
                    Navigate to <span className="text-[var(--ink)]">app.clovion.ai/setup</span>
                    <br />
                    <span className="text-[rgb(var(--ink-rgb)/40%)]">{'>'} </span>
                    Sign in with Google or email
                    <br />
                    <span className="text-[rgb(var(--ink-rgb)/40%)]">{'>'} </span>
                    Click <span className="text-[var(--ink)]">New workspace</span>
                  </code>
                </div>
              </section>

              <div className="hairline my-14" />

              {/* Step 3 - Name your brand */}
              <section id="name-brand" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 02</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Name your brand and seed competitors.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Seeding 3-5 competitors at setup time cuts your first useful score from a week to a day.
                  Pick the names buyers actually compare you to, not aspirational ones.
                </p>
                <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--white)] p-7">
                  <div className="space-y-5">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)] block mb-2">
                        Brand name
                      </label>
                      <div className="border border-[rgb(var(--ink-rgb)/15%)] rounded-md px-4 py-3 text-[14px] text-[var(--ink)] bg-bg">
                        Clovion AI
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)] block mb-2">
                        Primary domain
                      </label>
                      <div className="border border-[rgb(var(--ink-rgb)/15%)] rounded-md px-4 py-3 text-[14px] text-[rgb(var(--ink-rgb)/70%)] bg-bg font-mono">
                        clovion.ai
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)] block mb-2">
                        Competitors (3-5 recommended)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Profound', 'Goodie', 'Peec', 'Otterly'].map((c) => (
                          <span key={c} className="font-mono text-[12px] px-3 py-1.5 rounded-full bg-[var(--subtle)] border border-[var(--line)] text-[var(--ink)]">
                            {c} ×
                          </span>
                        ))}
                        <span className="font-mono text-[12px] px-3 py-1.5 rounded-full border border-dashed border-[rgb(var(--ink-rgb)/20%)] text-[rgb(var(--ink-rgb)/40%)]">
                          + add competitor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="hairline my-14" />

              {/* Step 4 - Pick engines */}
              <section id="pick-engines" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 03</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Pick your engines.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Ten engines are on by default. Most teams leave them all on. You can toggle off engines you don't care about
                  to speed scans, but our pricing is flat-rate so there's no cost reason to.
                </p>
                <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--white)] p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)]">
                      AI engines · 10 selected
                    </span>
                    <span className="font-mono text-[11px] text-[rgb(var(--ink-rgb)/40%)]">all on</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {engines.map((e) => (
                      <span
                        key={e}
                        className="inline-flex items-center gap-2 font-mono text-[12px] px-3 py-1.5 rounded-full bg-ink text-white"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--white)]" />
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <div className="hairline my-14" />

              {/* Step 5 - Starter prompts */}
              <section id="starter-prompts" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 04</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Add your starter prompts.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  We auto-suggest 20 prompts based on your brand name, domain, and industry. Edit any of them, delete what
                  doesn't fit, add your own. The good rule: would a buyer actually type this into ChatGPT?
                </p>
                <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--white)]">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)]">
                      Suggested prompts · 20 total
                    </span>
                    <span className="font-mono text-[11px] text-[rgb(var(--ink-rgb)/40%)]">edit any</span>
                  </div>
                  <ul className="divide-y divide-[var(--line)]">
                    {starterPrompts.map((p, i) => (
                      <li key={p} className="flex items-center gap-4 px-6 py-3.5">
                        <span className="font-mono text-[10px] text-[rgb(var(--ink-rgb)/40%)] w-6">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-mono text-[13px] text-[rgb(var(--ink-rgb)/80%)] flex-1">"{p}"</span>
                        <span className="font-mono text-[10px] text-[rgb(var(--ink-rgb)/40%)]">edit</span>
                      </li>
                    ))}
                    <li className="px-6 py-3 text-center font-mono text-[11px] text-[rgb(var(--ink-rgb)/40%)]">
                      + 15 more suggestions
                    </li>
                  </ul>
                </div>
              </section>

              <div className="hairline my-14" />

              {/* Step 6 - First scan */}
              <section id="first-scan" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 05</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">First scan runs in 60 seconds.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Click Run scan. We hit all 10 engines in parallel. You'll see live progress and the first results
                  populate in your dashboard before the spinner stops.
                </p>
                <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--white)] p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)]">
                      Scan progress
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ink)]">4 / 10 done</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {engines.map((e, i) => (
                      <div key={e} className="text-center">
                        <div
                          className={
                            i < 4
                              ? 'h-12 rounded-md bg-ink flex items-center justify-center'
                              : 'h-12 rounded-md bg-[var(--subtle)] border border-[var(--line)] flex items-center justify-center'
                          }
                        >
                          {i < 4 ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-[rgb(var(--ink-rgb)/30%)] animate-pulse" />
                          )}
                        </div>
                        <div className="font-mono text-[9px] text-[rgb(var(--ink-rgb)/50%)] mt-1.5 truncate">{e}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-1.5 bg-[var(--subtle)] rounded-full overflow-hidden">
                    <div className="h-full bg-ink rounded-full" style={{ width: '40%' }} />
                  </div>
                  <div className="flex justify-between mt-2 font-mono text-[10px] text-[rgb(var(--ink-rgb)/40%)]">
                    <span>00:24 elapsed</span>
                    <span>~36s remaining</span>
                  </div>
                </div>
              </section>

              <div className="hairline my-14" />

              {/* Step 7 - What happens next */}
              <section id="what-happens-next" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 06</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">What happens next.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Your dashboard fills in. The top panel is your visibility score per engine. The middle is share of voice
                  against the competitors you seeded. The bottom is a prioritized fix list with effort estimates.
                </p>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Spend ten minutes reading each panel before you ship fixes. Visit{' '}
                  <Link href="/features/ai-visibility-tracking" className="text-[var(--ink)] underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                    AI Visibility Tracking
                  </Link>{' '}
                  for a breakdown of how each chart is computed.
                </p>
              </section>

              <div className="hairline my-14" />

              {/* Step 8 - Common issues */}
              <section id="common-issues" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 07</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Common issues.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Three things trip up roughly one in ten new accounts. None block your first scan.
                </p>
                <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {commonIssues.map((issue) => (
                    <li key={issue.title} className="py-5 flex flex-col sm:flex-row gap-3 sm:gap-8">
                      <div className="sm:w-56 shrink-0 font-mono text-[12px] text-[var(--ink)] uppercase tracking-wider">
                        {issue.title}
                      </div>
                      <div className="text-[14.5px] leading-[1.65] text-[rgb(var(--ink-rgb)/70%)] flex-1">{issue.detail}</div>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="hairline my-14" />

              {/* Step 9 - Next doc */}
              <section id="next-doc" className="scroll-mt-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)]">Step 08</div>
                <h2 className="display-sm mt-2 text-[var(--ink)]">Next: connect GA4 and GSC.</h2>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/75%)]">
                  Once your first scan is in, link Google Analytics 4 and Search Console. We use them to attribute AI-driven
                  traffic and surface citation-path recommendations grounded in your real query data.
                </p>
                <Link
                  href="/docs/ga4-gsc"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--ink)] hover:text-[rgb(var(--ink-rgb)/70%)] transition-colors"
                >
                  Read the GA4 + GSC guide <ArrowRight />
                </Link>
              </section>

              {/* Helpful row */}
              <div className="mt-20 border-y border-[var(--line)] py-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[rgb(var(--ink-rgb)/60%)]">
                  <span className="text-[var(--ink)]">Was this helpful?</span>
                  <button className="px-3 py-1 border border-[var(--line)] rounded-full hover:bg-[var(--subtle)] text-[var(--ink)] transition-colors">Yes</button>
                  <button className="px-3 py-1 border border-[var(--line)] rounded-full hover:bg-[var(--subtle)] text-[var(--ink)] transition-colors">No</button>
                  <span className="text-[rgb(var(--ink-rgb)/30%)]">·</span>
                  <Link href="#" className="text-[rgb(var(--ink-rgb)/60%)] hover:text-[var(--ink)] transition-colors">Edit on GitHub</Link>
                  <span className="text-[rgb(var(--ink-rgb)/30%)]">·</span>
                  <span>Last reviewed by Eva R.</span>
                </div>
              </div>
            </article>

            {/* Right rail TOC */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 pl-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)] mb-4">
                  On this page
                </div>
                <ul className="space-y-1">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={
                          activeId === item.id
                            ? 'font-mono text-[11.5px] text-[var(--ink)] border-l-2 border-[var(--ink)] pl-3 block py-1.5 transition-all'
                            : 'font-mono text-[11.5px] text-[rgb(var(--ink-rgb)/55%)] hover:text-[var(--ink)] border-l-2 border-transparent hover:border-[rgb(var(--ink-rgb)/30%)] pl-3 block py-1.5 transition-all'
                        }
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-[var(--line)]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)] mb-3">
                    Need help?
                  </div>
                  <Link href="/contact" className="font-mono text-[11.5px] text-[rgb(var(--ink-rgb)/70%)] hover:text-[var(--ink)] block py-1">
                    Talk to support
                  </Link>
                  <Link href="/contact" className="font-mono text-[11.5px] text-[rgb(var(--ink-rgb)/70%)] hover:text-[var(--ink)] block py-1">
                    Join the community
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Next steps */}
      <Section className="section-y bg-[var(--subtle)] border-t border-[var(--line)]">
        <Container>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)] mb-3">Next</div>
          <h2 className="display-sm text-[var(--ink)] max-w-2xl">Three things to do once your first scan finishes.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {[
              {
                num: '01',
                title: 'Connect GA4 + GSC',
                desc: 'Attribute AI-driven traffic and surface citation-path recommendations grounded in real query data.',
                href: '/docs/ga4-gsc'
              },
              {
                num: '02',
                title: 'Set up the API',
                desc: 'Pull scores into your data warehouse, dashboard, or internal tools. REST + TypeScript SDK.',
                href: '/docs/api'
              },
              {
                num: '03',
                title: 'Push fixes to your CMS',
                desc: 'Wire WordPress, Sanity, Contentful, or Webflow. Schema patches ship as draft PRs you approve.',
                href: '/docs/cms'
              }
            ].map((tile) => (
              <Link key={tile.num} href={tile.href} className="group">
                <Card className="h-full p-7 transition-all hover:border-[rgb(var(--ink-rgb)/30%)]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/40%)] mb-5">
                    {tile.num}
                  </div>
                  <div className="font-semibold text-[17px] text-[var(--ink)] mb-3 tracking-tight">{tile.title}</div>
                  <p className="text-[13.5px] leading-[1.6] text-[rgb(var(--ink-rgb)/65%)] mb-6">{tile.desc}</p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)] group-hover:gap-2.5 transition-all">
                    Read guide <ArrowRight />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
