// Shared motion primitives for the PillarStepper coded mocks.
//
// Plain .ts module — NO 'use client' here; the consuming mock .tsx files carry
// it. All hooks are SSR-safe (no window access at module scope).
//
// IMPORTANT (documented footgun): never put a var(--*) inside a CSS `transition`
// shorthand — React drops it during style serialization and the transition
// silently never fires. Always inline `cb` (the literal value of
// --ease-out-expo) instead.

import { useEffect, useRef, useState } from 'react'

/** The ONLY easing literal mocks may use inside a transition shorthand. */
export const cb = 'cubic-bezier(0.16, 1, 0.3, 1)'

/** True iff the user requested reduced motion. SSR-safe (starts false). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/**
 * Reveal gate. Returns whether the mock should be in its "revealed" (final)
 * state. Latches true once `active` first becomes true and stays true (so the
 * choreography doesn't replay every time the pillar re-activates). Under
 * reduced motion it simply mirrors `active` so content snaps in with no
 * animation (the consumers also drop their transitions when reduced).
 */
export function useReveal(active: boolean): boolean {
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(false)
  const latched = useRef(false)
  useEffect(() => {
    if (active && !latched.current) {
      latched.current = true
      setRevealed(true)
    }
  }, [active])
  if (reduced) return active
  return revealed
}

interface CountUpOpts {
  durationMs?: number
  decimals?: number
  startMs?: number
}

/**
 * Counts from 0 → target via rAF when `play` is true. Snaps to target under
 * reduced motion. Returns the current (rounded) value.
 */
export function useCountUp(target: number, play: boolean, opts: CountUpOpts = {}): number {
  const { durationMs = 700, decimals = 0, startMs = 0 } = opts
  const reduced = useReducedMotion()
  const [val, setVal] = useState(0)
  const raf = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!play) {
      setVal(0)
      return
    }
    if (reduced) {
      setVal(target)
      return
    }
    const factor = Math.pow(10, decimals)
    const round = (n: number) => Math.round(n * factor) / factor
    let start = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / durationMs)
      setVal(round(target * ease(p)))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    timer.current = setTimeout(() => {
      raf.current = requestAnimationFrame(step)
    }, startMs)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [play, target, durationMs, decimals, startMs, reduced])

  return val
}

/**
 * Staggered reveal flags. Returns a boolean[] of length `count`; index i flips
 * true at startMs + i*stepMs after `play`. All true immediately under reduced
 * motion.
 */
export function useStagger(count: number, play: boolean, stepMs = 70, startMs = 0): boolean[] {
  const reduced = useReducedMotion()
  const [flags, setFlags] = useState<boolean[]>(() => new Array(count).fill(false))
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (!play) {
      setFlags(new Array(count).fill(false))
      return
    }
    if (reduced) {
      setFlags(new Array(count).fill(true))
      return
    }
    setFlags(new Array(count).fill(false))
    for (let i = 0; i < count; i++) {
      const t = setTimeout(() => {
        setFlags((prev) => {
          const next = prev.slice()
          next[i] = true
          return next
        })
      }, startMs + i * stepMs)
      timers.current.push(t)
    }
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [count, play, stepMs, startMs, reduced])

  return flags
}

/**
 * Typewriter. Returns the progressively-typed substring of `text` plus a `done`
 * flag. Full text immediately under reduced motion.
 */
export function useTypewriter(text: string, play: boolean, cps = 40): { text: string; done: boolean } {
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!play) {
      setN(0)
      return
    }
    if (reduced) {
      setN(text.length)
      return
    }
    let start = 0
    const perChar = 1000 / cps
    const step = (ts: number) => {
      if (!start) start = ts
      const chars = Math.min(text.length, Math.floor((ts - start) / perChar))
      setN(chars)
      if (chars < text.length) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [text, play, cps, reduced])

  return { text: text.slice(0, n), done: n >= text.length }
}
