import "server-only";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 50_000;

export interface RateLimitOptions {
  capacity: number;
  refillPerSecond: number;
}

/** A simple in-memory token bucket. Fine for a single-instance VPS deployment. */
export function rateLimit(key: string, { capacity, refillPerSecond }: RateLimitOptions): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: capacity, lastRefill: now };

  const elapsedSeconds = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSeconds * refillPerSecond);
  bucket.lastRefill = now;

  const allowed = bucket.tokens >= 1;
  if (allowed) bucket.tokens -= 1;

  if (buckets.size >= MAX_TRACKED_KEYS && !buckets.has(key)) {
    buckets.clear();
  }
  buckets.set(key, bucket);
  return allowed;
}
