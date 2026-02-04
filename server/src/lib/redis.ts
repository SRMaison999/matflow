// =====================================================
// MatFlow - Redis Client
// =====================================================

import Redis from 'ioredis';
import { config } from '@/config/index.js';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('error', (error) => {
      console.error('Redis error:', error);
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });
  }

  return redis;
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log('Redis disconnected');
  }
}

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await getRedis().get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  },

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await getRedis().setex(key, ttlSeconds, data);
    } else {
      await getRedis().set(key, data);
    }
  },

  async del(key: string): Promise<void> {
    await getRedis().del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await getRedis().keys(pattern);
    if (keys.length > 0) {
      await getRedis().del(...keys);
    }
  },

  async exists(key: string): Promise<boolean> {
    const result = await getRedis().exists(key);
    return result === 1;
  },

  async ttl(key: string): Promise<number> {
    return getRedis().ttl(key);
  },

  async incr(key: string): Promise<number> {
    return getRedis().incr(key);
  },

  async expire(key: string, seconds: number): Promise<void> {
    await getRedis().expire(key, seconds);
  },
};

// Key patterns
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,
  session: (id: string) => `session:${id}`,
  article: (id: string) => `article:${id}`,
  articleAvailability: (id: string, start: string, end: string) =>
    `article:${id}:availability:${start}:${end}`,
  project: (id: string) => `project:${id}`,
  reservation: (id: string) => `reservation:${id}`,
  config: (key: string) => `config:${key}`,
  rateLimit: (ip: string, route: string) => `ratelimit:${ip}:${route}`,
};
