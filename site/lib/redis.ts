// Shared ioredis client — HMR-safe via globalThis (mirrors the in-memory map
// pattern in the legacy free-score route).
//
// Returns null when REDIS_URL is unset, so callers transparently fall back to
// in-memory state. Redis is an optimization (shared cache + cross-replica rate
// limit), never a hard dependency: a Redis blip must never 500 the scan.

import Redis from 'ioredis'

type RedisGlobal = typeof globalThis & {
  __clvRedis?: Redis | null
  __clvRedisHealthy?: boolean
}
const g = globalThis as RedisGlobal

export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (g.__clvRedis !== undefined) return g.__clvRedis

  try {
    const client = new Redis(process.env.REDIS_URL, {
      // Fail fast and fall back rather than hang the request path.
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 3000,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    })
    g.__clvRedisHealthy = true
    client.on('error', (err: Error) => {
      g.__clvRedisHealthy = false
      console.warn('[free-score] redis error:', err?.message)
    })
    client.on('ready', () => {
      g.__clvRedisHealthy = true
    })
    g.__clvRedis = client
    return client
  } catch (e) {
    console.warn('[free-score] redis init failed:', (e as Error)?.message)
    g.__clvRedis = null
    return null
  }
}

export function redisHealthy(): boolean {
  return Boolean(g.__clvRedisHealthy)
}
