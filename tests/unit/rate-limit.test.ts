import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  checkRateLimit,
  checkDistributedRateLimit,
  getAnonymizedClientKey,
  createRateLimitHeaders,
  clearMemoryRateLimitStore,
} from '@/lib/rate-limit';

describe('Rate Limiter & Privacy Protection', () => {
  beforeEach(() => {
    clearMemoryRateLimitStore();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('allows requests within limit and decrements remaining counter', () => {
    const config = { limit: 3, windowMs: 10_000 };
    const r1 = checkRateLimit('client-1', config);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit('client-1', config);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit('client-1', config);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    const r4 = checkRateLimit('client-1', config);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it('resets counter after windowMs expires', () => {
    const config = { limit: 1, windowMs: 50 };
    const r1 = checkRateLimit('client-temp', config);
    expect(r1.allowed).toBe(true);

    const r2 = checkRateLimit('client-temp', config);
    expect(r2.allowed).toBe(false);

    // Fast-forward by overriding Date.now
    const future = Date.now() + 100;
    vi.spyOn(Date, 'now').mockReturnValue(future);

    const r3 = checkRateLimit('client-temp', config);
    expect(r3.allowed).toBe(true);

    vi.restoreAllMocks();
  });

  it('anonymizes IP address to 16-character SHA-256 slice (PII safe)', () => {
    const req = new Request('http://localhost:3000/api/recommendations', {
      headers: { 'x-forwarded-for': '203.0.113.195, 10.0.0.1' },
    });
    const key = getAnonymizedClientKey(req, 'rec');
    expect(key).toMatch(/^rec:[a-f0-9]{16}$/);
    expect(key).not.toContain('203.0.113.195');

    // Repeated calls with same IP yield identical anonymous hash
    const key2 = getAnonymizedClientKey(req, 'rec');
    expect(key2).toBe(key);
  });

  it('generates standard rate limit headers including Retry-After when blocked', () => {
    const allowedHeaders = createRateLimitHeaders({
      allowed: true,
      remaining: 5,
      resetAt: Date.now() + 30_000,
      limit: 10,
    });
    expect(allowedHeaders['X-RateLimit-Limit']).toBe('10');
    expect(allowedHeaders['X-RateLimit-Remaining']).toBe('5');
    expect(allowedHeaders['Retry-After']).toBeUndefined();

    const blockedHeaders = createRateLimitHeaders({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 15_000,
      limit: 10,
    });
    expect(blockedHeaders['X-RateLimit-Remaining']).toBe('0');
    expect(blockedHeaders['Retry-After']).toBeDefined();
    expect(Number(blockedHeaders['Retry-After'])).toBeGreaterThan(0);
  });

  it('gracefully falls back to in-memory limiter when Upstash is unconfigured', async () => {
    const config = { limit: 2, windowMs: 10_000 };
    const r1 = await checkDistributedRateLimit('anon-fallback', config);
    expect(r1.allowed).toBe(true);
    expect(r1.isDistributed).toBe(false);

    const r2 = await checkDistributedRateLimit('anon-fallback', config);
    expect(r2.allowed).toBe(true);

    const r3 = await checkDistributedRateLimit('anon-fallback', config);
    expect(r3.allowed).toBe(false);
  });
});
