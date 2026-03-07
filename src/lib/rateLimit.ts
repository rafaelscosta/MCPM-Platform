// Simple in-memory rate limiter
const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  key: string,
  { maxRequests = 30, windowMs = 60000 }: { maxRequests?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requests.get(key);

  if (!record || now > record.resetTime) {
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requests.entries()) {
    if (now > record.resetTime) {
      requests.delete(key);
    }
  }
}, 60000);
