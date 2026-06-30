// Result cache + IP rate-limit for the v2 scan.
//
// Redis-backed when REDIS_URL is set (shared across replicas); otherwise an
// in-memory fallback (single-replica only). Every Redis op is wrapped so a
// Redis failure degrades to the in-memory path instead of throwing — Redis is
// an accelerator, not a system of record.

import { getRedis } from '@/lib/redis'
import type { FreeScoreResult } from './types'

const CACHE_TTL_S = 24 * 60 * 60
const RL_MAX = 5
const RL_WINDOW_S = 60

type CacheEntry = { result: FreeScoreResult; expiresAt: number }
type Bucket = { count: number; resetAt: number }

type StoreGlobal = typeof globalThis & {
  __clvMemCache?: Map<string, CacheEntry>
  __clvMemRate?: Map<string, Bucket>
  __clvMemQuota?: Map<string, Bucket>
}
const g = globalThis as StoreGlobal
const memCache: Map<string, CacheEntry> = g.__clvMemCache ?? (g.__clvMemCache = new Map())
const memRate: Map<string, Bucket> = g.__clvMemRate ?? (g.__clvMemRate = new Map())
const memQuota: Map<string, Bucket> = g.__clvMemQuota ?? (g.__clvMemQuota = new Map())

export async function getCached(domain: string): Promise<FreeScoreResult | null> {
  const redis = getRedis()
  if (redis) {
    try {
      const raw = await redis.get(`scan:result:${domain}`)
      return raw ? (JSON.parse(raw) as FreeScoreResult) : null
    } catch (e) {
      console.warn('[free-score] cache get → mem fallback:', (e as Error).message)
    }
  }
  const entry = memCache.get(domain)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    memCache.delete(domain)
    return null
  }
  return entry.result
}

export async function setCached(domain: string, result: FreeScoreResult): Promise<void> {
  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(`scan:result:${domain}`, JSON.stringify(result), 'EX', CACHE_TTL_S)
      return
    } catch (e) {
      console.warn('[free-score] cache set → mem fallback:', (e as Error).message)
    }
  }
  memCache.set(domain, { result, expiresAt: Date.now() + CACHE_TTL_S * 1000 })
}

export type RateResult = { allowed: boolean; retryAfterSec: number }

// Fixed-window limiter (5 / 60s / IP) — matches the legacy behaviour. Atomic in
// Redis via INCR + EXPIRE; in-memory fallback otherwise. (A sliding window is a
// P3 refinement; fixed-window is correct-enough here.)
export async function checkRateLimit(ip: string): Promise<RateResult> {
  const redis = getRedis()
  if (redis) {
    try {
      const key = `rl:ip:${ip}`
      const n = await redis.incr(key)
      if (n === 1) await redis.expire(key, RL_WINDOW_S)
      if (n > RL_MAX) {
        const ttl = await redis.ttl(key)
        return { allowed: false, retryAfterSec: ttl > 0 ? ttl : RL_WINDOW_S }
      }
      return { allowed: true, retryAfterSec: 0 }
    } catch (e) {
      console.warn('[free-score] ratelimit → mem fallback:', (e as Error).message)
    }
  }
  const now = Date.now()
  const b = memRate.get(ip)
  if (!b || b.resetAt <= now) {
    memRate.set(ip, { count: 1, resetAt: now + RL_WINDOW_S * 1000 })
    return { allowed: true, retryAfterSec: 0 }
  }
  if (b.count >= RL_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) }
  }
  b.count++
  return { allowed: true, retryAfterSec: 0 }
}

// ── Single-flight coalescing (P3) ────────────────────────────────────────
// A short lock so concurrent scans of the same domain collapse to one upstream
// call (the trending-brand stampede). In-memory fallback always acquires
// (single replica = the race that matters doesn't exist).

const LOCK_TTL_MS = 30_000

export async function acquireLock(domain: string): Promise<boolean> {
  const redis = getRedis()
  if (redis) {
    try {
      const res = await redis.set(`lock:scan:${domain}`, '1', 'PX', LOCK_TTL_MS, 'NX')
      return res === 'OK'
    } catch (e) {
      console.warn('[free-score] lock acquire → allow:', (e as Error).message)
    }
  }
  return true
}

export async function releaseLock(domain: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.del(`lock:scan:${domain}`)
  } catch {
    /* lock expires on its own */
  }
}

// Poll the cache for up to `ms`, waiting for another in-flight scan's result.
export async function waitForCached(domain: string, ms: number): Promise<FreeScoreResult | null> {
  const deadline = Date.now() + ms
  while (Date.now() < deadline) {
    await sleep(1000)
    const hit = await getCached(domain)
    if (hit) return hit
  }
  return null
}

// ── Daily spend cap (P3) ─────────────────────────────────────────────────

let memSpend = { date: '', amount: 0 }

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function getDailySpend(): Promise<number> {
  const redis = getRedis()
  if (redis) {
    try {
      const raw = await redis.get(`budget:spend:${todayKey()}`)
      return raw ? parseFloat(raw) : 0
    } catch (e) {
      console.warn('[free-score] spend get → mem:', (e as Error).message)
    }
  }
  return memSpend.date === todayKey() ? memSpend.amount : 0
}

export async function addDailySpend(amount: number): Promise<void> {
  const redis = getRedis()
  if (redis) {
    try {
      const key = `budget:spend:${todayKey()}`
      await redis.incrbyfloat(key, amount)
      await redis.expire(key, 48 * 60 * 60)
      return
    } catch (e) {
      console.warn('[free-score] spend add → mem:', (e as Error).message)
    }
  }
  const t = todayKey()
  if (memSpend.date !== t) memSpend = { date: t, amount: 0 }
  memSpend.amount += amount
}

// ── Per-key daily quota (anti-abuse) ─────────────────────────────────────
// Caps free scans per email / per IP per day. Without this, one captured lead
// (a 30-min cookie) could fire unlimited scans — each an OpenAI call + an
// email. Reserve up front with an atomic INCR; refund (decr) if the scan can't
// be delivered, so a failed attempt doesn't burn the user's free score.

const QUOTA_TTL_S = 24 * 60 * 60

export async function bumpDailyCount(key: string): Promise<number> {
  const redis = getRedis()
  if (redis) {
    try {
      const k = `quota:${key}:${todayKey()}`
      const n = await redis.incr(k)
      if (n === 1) await redis.expire(k, QUOTA_TTL_S)
      return n
    } catch (e) {
      console.warn('[free-score] quota bump → mem:', (e as Error).message)
    }
  }
  const k = `${key}:${todayKey()}`
  const now = Date.now()
  const b = memQuota.get(k)
  if (!b || b.resetAt <= now) {
    memQuota.set(k, { count: 1, resetAt: now + QUOTA_TTL_S * 1000 })
    return 1
  }
  b.count++
  return b.count
}

export async function refundDailyCount(key: string): Promise<void> {
  const redis = getRedis()
  if (redis) {
    try {
      const k = `quota:${key}:${todayKey()}`
      const n = await redis.decr(k)
      if (n < 0) await redis.set(k, '0', 'EX', QUOTA_TTL_S)
      return
    } catch (e) {
      console.warn('[free-score] quota refund → mem:', (e as Error).message)
    }
  }
  const b = memQuota.get(`${key}:${todayKey()}`)
  if (b && b.count > 0) b.count--
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
