// =====================================================
// MatFlow - Swagger Documentation Plugin
// =====================================================

import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { config } from '@/config/index.js';

async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'MatFlow API',
        description: 'API pour la gestion de stock circulant événementiel',
        version: '0.1.0',
        contact: {
          name: 'MatFlow Team',
        },
      },
      servers: [
        {
          url: config.app.apiUrl,
          description: config.app.env === 'production' ? 'Production' : 'Development',
        },
      ],
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management' },
        { name: 'Articles', description: 'Article management' },
        { name: 'Categories', description: 'Category management' },
        { name: 'Stock', description: 'Stock and location management' },
        { name: 'Reservations', description: 'Reservation management' },
        { name: 'Projects', description: 'Project management' },
        { name: 'Kits', description: 'Kit management' },
        { name: 'Cases', description: 'Case/flight case management' },
        { name: 'Operations', description: 'Picking and return operations' },
        { name: 'Maintenance', description: 'Maintenance management' },
        { name: 'Billing', description: 'Quotes and invoices' },
        { name: 'Notifications', description: 'Notification management' },
        { name: 'Branches', description: 'Branch management' },
        { name: 'Documents', description: 'Document management' },
        { name: 'Import', description: 'Data import' },
        { name: 'Reports', description: 'Reports and statistics' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
    },
    staticCSP: true,
  });
}

export default fp(swaggerPlugin, {
  name: 'swagger',
});
