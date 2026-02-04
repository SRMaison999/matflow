// =====================================================
// MatFlow - Logger
// =====================================================

import pino from 'pino';
import { config, isDevelopment } from '@/config/index.js';

export const logger = pino({
  level: config.logging.level,
  ...(config.logging.pretty && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

// Create child logger for specific module
export function createLogger(module: string) {
  return logger.child({ module });
}

// Request logger middleware options
export const requestLoggerOptions = {
  logger,
  serializers: {
    req(req: unknown) {
      const r = req as { method: string; url: string; headers?: Record<string, string> };
      return {
        method: r.method,
        url: r.url,
        headers: isDevelopment ? r.headers : undefined,
      };
    },
    res(res: unknown) {
      const r = res as { statusCode: number };
      return {
        statusCode: r.statusCode,
      };
    },
  },
};
