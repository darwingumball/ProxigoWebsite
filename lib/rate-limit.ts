interface RateLimitEntry {
  count: number;
  reset: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean expired entries to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.reset) store.delete(key);
  }
}, 60_000);

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.reset - now) / 1000),
    };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, retryAfter: 0 };
}

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
