/**
 * Hybrid Rate Limiter for Next.js API Routes.
 *
 * Architecture:
 * 1. For general computational routes (/api/aqi, /api/impact, /api/community):
 *    - In-memory process-local Map with window expiration.
 *    - Zero external network hops, zero latency overhead.
 * 2. For the expensive Gemini AI route (/api/recommendations):
 *    - Distributed sliding-window limiter via Upstash Redis REST when UPSTASH_REDIS_REST_URL and
 *      UPSTASH_REDIS_REST_TOKEN are configured.
 *    - Privacy-preserving IP hashing (SHA-256 slice) so raw IP addresses are never persisted in external stores.
 *    - 1,000 ms strict network timeout with graceful fail-open to the local memory limiter.
 *    - If Upstash credentials are not set (e.g. local dev, offline CI), automatically falls back to in-memory limiter.
 *    - Basic AQI viewing NEVER depends on Redis.
 */

import crypto from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// --- In-memory fallback / local limiter ---

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

export function clearMemoryRateLimitStore(): void {
  memoryStore.clear();
}

export interface RateLimitConfig {
  /** Maximum requests per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
  isDistributed?: boolean;
}

/**
 * Synchronous in-memory rate limit check (used for static routes and as distributed fallback).
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.limit - 1, resetAt, limit: config.limit, isDistributed: false };
  }

  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, limit: config.limit, isDistributed: false };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
    limit: config.limit,
    isDistributed: false,
  };
}

// --- Distributed Upstash Redis limiter for expensive endpoints ---

let upstashRatelimitInstance: Ratelimit | null = null;
let upstashConfigSignature = '';

function getUpstashRatelimit(config: RateLimitConfig): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const signature = `${url}:${config.limit}:${config.windowMs}`;
  if (upstashRatelimitInstance && upstashConfigSignature === signature) {
    return upstashRatelimitInstance;
  }

  try {
    const redis = new Redis({
      url,
      token,
      // 1000ms max latency budget for rate-limiting
      signal: AbortSignal.timeout(1000),
    });

    const windowSeconds = Math.max(1, Math.round(config.windowMs / 1000));
    upstashRatelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.limit, `${windowSeconds} s`),
      analytics: false,
      prefix: 'vayudisha_rl',
    });
    upstashConfigSignature = signature;
    return upstashRatelimitInstance;
  } catch (err) {
    console.warn('Failed to initialize Upstash Redis rate limiter, using local fallback:', err);
    return null;
  }
}

/**
 * Asynchronously check rate limit.
 * Uses Upstash Redis if configured; gracefully falls back to memory limiter on error or when unconfigured.
 */
export async function checkDistributedRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const limiter = getUpstashRatelimit(config);

  if (!limiter) {
    return checkRateLimit(key, config);
  }

  try {
    // 1000ms timeout budget for rate limit check
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Upstash rate limit timeout (>1000ms)')), 1000)
    );

    const checkPromise = limiter.limit(key);
    const result = await Promise.race([checkPromise, timeoutPromise]);

    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
      limit: result.limit,
      isDistributed: true,
    };
  } catch (err) {
    console.warn('Upstash rate limit failed or timed out. Falling back to local in-memory limiter:', err);
    return checkRateLimit(key, config);
  }
}

// --- Request Identifier & Security Helpers ---

/**
 * Extract a privacy-preserving hash of the client identifier from request headers.
 * SHA-256 hashed and truncated to 16 characters so raw IPs are not stored in external Redis keys.
 */
export function getAnonymizedClientKey(request: Request, prefix = 'client'): string {
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    '127.0.0.1';

  const hash = crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 16);
  return `${prefix}:${hash}`;
}

/** Backwards-compatible raw IP extractor (for internal logging) */
export function getClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Build standard rate limit response headers */
export function createRateLimitHeaders(rl: RateLimitResult): Record<string, string> {
  const now = Date.now();
  const retryAfterSec = Math.max(1, Math.ceil((rl.resetAt - now) / 1000));

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(Math.max(0, rl.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
  };

  if (!rl.allowed) {
    headers['Retry-After'] = String(retryAfterSec);
  }

  return headers;
}
