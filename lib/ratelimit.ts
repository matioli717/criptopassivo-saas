import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'),
  analytics: true,
  prefix: 'ratelimit',
});

export async function checkRateLimit(key: string) {
  return ratelimit.limit(key);
}