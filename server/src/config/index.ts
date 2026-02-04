// =====================================================
// MatFlow - Configuration Index
// =====================================================

export * from './env.js';

import { env, isDevelopment } from './env.js';

export const config = {
  app: {
    name: env.APP_NAME,
    url: env.APP_URL,
    apiUrl: env.API_URL,
    env: env.NODE_ENV,
  },

  server: {
    port: env.PORT,
    host: env.HOST,
  },

  database: {
    url: env.DATABASE_URL,
  },

  redis: {
    url: env.REDIS_URL,
  },

  jwt: {
    secret: env.JWT_SECRET,
    accessExpiration: env.JWT_ACCESS_EXPIRATION,
    refreshExpiration: env.JWT_REFRESH_EXPIRATION,
  },

  storage: {
    endpoint: env.STORAGE_ENDPOINT,
    port: env.STORAGE_PORT,
    useSSL: env.STORAGE_USE_SSL,
    accessKey: env.STORAGE_ACCESS_KEY,
    secretKey: env.STORAGE_SECRET_KEY,
    bucket: env.STORAGE_BUCKET,
  },

  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
    enabled: Boolean(env.SMTP_HOST && env.SMTP_USER),
  },

  logging: {
    level: env.LOG_LEVEL,
    pretty: isDevelopment,
  },

  cors: {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  },

  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    window: env.RATE_LIMIT_WINDOW,
  },
} as const;
