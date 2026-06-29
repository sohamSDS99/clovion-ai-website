'use client'

import { useEffect, useRef, useState } from 'react'
import type { TocItem } from './toc'

// Sticky, scroll-spy table-of-contents rail (Profound-style). Lists the article's
// H2 sections; the active section highlights as you scroll and the rail stays
// pinned until the article body ends, then scrolls away with the page (the
// sticky lives inside the body grid track, so it releases naturally at the end).
//
// Scroll-spy is deterministic (not IntersectionObserver): on each rAF-throttled
// scroll we pick the LAST heading whose top has crossed the offset line. That
// handles short trailing sections and fast scrolls without the IO edge cases.
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')
  const tickingRef = useRef(false)

  useEffect(() => {
    if (items.length === 0) return

    const ids = items.map((i) => i.id)
    const offset = 120 // header height + breathing room

    const compute = () => {
      tickingRef.current = false
      const els = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
      if (els.length === 0) return

      // At the very bottom of the page, force the last section active so the
      // final (often short) heading still lights up.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) {
        setActive(els[els.length - 1].id)
        return
      }

      let current = els[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top <= offset) current = el.id
        else break
      }
      setActive(current)
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    // Reflect the click immediately; the scroll handler will reconcile.
    setActive(id)
    history.replaceState(null, '', `#${id}`)
  }

  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-4 text-xs uppercase tracking-[0.14em] text-[var(--ink-40)]">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5 border-l border-[var(--line)]">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => onClick(e, item.id)}
                aria-current={isActive ? 'true' : undefined}
                className="block py-1.5 pl-4 leading-snug transition-colors"
                style={{
                  marginLeft: '-1px',
                  borderLeft: `2px solid ${isActive ? 'var(--ink)' : 'transparent'}`,
                  color: isActive ? 'var(--ink)' : 'var(--ink-50)'
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
