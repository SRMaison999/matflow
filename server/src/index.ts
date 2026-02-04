// =====================================================
// MatFlow - Server Entry Point
// =====================================================

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';

import { config, isDevelopment } from '@/config/index.js';
import { connectDatabase, disconnectDatabase } from '@/lib/prisma.js';
import { getRedis, disconnectRedis } from '@/lib/redis.js';
import { logger, requestLoggerOptions } from '@/lib/logger.js';
import { authPlugin, swaggerPlugin } from '@/plugins/index.js';
import { errorHandler, requestContextHook, responseTimeHook } from '@/middleware/index.js';

// Import routes
import { authRoutes } from '@/modules/auth/index.js';
import { articlesRoutes } from '@/modules/articles/index.js';

async function buildServer() {
  const fastify = Fastify({
    logger: requestLoggerOptions,
    trustProxy: true,
  });

  // Register hooks
  fastify.addHook('onRequest', requestContextHook);
  fastify.addHook('onSend', responseTimeHook);

  // Register error handler
  fastify.setErrorHandler(errorHandler);

  // Register plugins
  await fastify.register(sensible);

  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: isDevelopment ? false : undefined,
  });

  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.window,
  });

  await fastify.register(cookie);

  await fastify.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // Register custom plugins
  await fastify.register(authPlugin);

  // Register Swagger (only in development)
  if (isDevelopment) {
    await fastify.register(swaggerPlugin);
  }

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // API version
  fastify.get('/api/version', async () => ({
    version: '0.1.0',
    name: config.app.name,
  }));

  // Register routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(articlesRoutes, { prefix: '/api/articles' });

  // TODO: Register other module routes
  // await fastify.register(usersRoutes, { prefix: '/api/users' });
  // await fastify.register(categoriesRoutes, { prefix: '/api/categories' });
  // await fastify.register(stockRoutes, { prefix: '/api/stock' });
  // await fastify.register(locationsRoutes, { prefix: '/api/locations' });
  // await fastify.register(reservationsRoutes, { prefix: '/api/reservations' });
  // await fastify.register(projectsRoutes, { prefix: '/api/projects' });
  // await fastify.register(kitsRoutes, { prefix: '/api/kits' });
  // await fastify.register(casesRoutes, { prefix: '/api/cases' });
  // await fastify.register(operationsRoutes, { prefix: '/api/operations' });
  // await fastify.register(maintenanceRoutes, { prefix: '/api/maintenance' });
  // await fastify.register(billingRoutes, { prefix: '/api/billing' });
  // await fastify.register(notificationsRoutes, { prefix: '/api/notifications' });
  // await fastify.register(branchesRoutes, { prefix: '/api/branches' });
  // await fastify.register(documentsRoutes, { prefix: '/api/documents' });
  // await fastify.register(importRoutes, { prefix: '/api/import' });
  // await fastify.register(reportsRoutes, { prefix: '/api/reports' });

  return fastify;
}

async function start() {
  let server;

  try {
    // Connect to database
    await connectDatabase();

    // Connect to Redis
    getRedis();

    // Build and start server
    server = await buildServer();

    await server.listen({
      port: config.server.port,
      host: config.server.host,
    });

    logger.info(`🚀 Server running at http://${config.server.host}:${config.server.port}`);

    if (isDevelopment) {
      logger.info(`📚 API Documentation: http://localhost:${config.server.port}/docs`);
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    if (server) {
      await server.close();
    }

    await disconnectDatabase();
    await disconnectRedis();

    logger.info('Server shut down complete');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
