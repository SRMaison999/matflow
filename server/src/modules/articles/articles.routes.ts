// =====================================================
// MatFlow - Articles Routes
// =====================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  createArticleSchema,
  updateArticleSchema,
  articleQuerySchema,
  availabilityCheckSchema,
} from '@matflow/validators';
import { ArticlesService } from './articles.service.js';

export async function articlesRoutes(fastify: FastifyInstance) {
  const articlesService = new ArticlesService();

  // List articles
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Articles'],
        summary: 'List articles',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            search: { type: 'string' },
            type: { type: 'string', enum: ['SERIALIZED', 'BATCH', 'CONSUMABLE'] },
            status: { type: 'string' },
            condition: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            branchId: { type: 'string', format: 'uuid' },
            locationId: { type: 'string', format: 'uuid' },
            tags: { type: 'string' },
            minPrice: { type: 'number' },
            maxPrice: { type: 'number' },
            isActive: { type: 'boolean' },
            page: { type: 'integer', minimum: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100 },
            sort: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = articleQuerySchema.parse(request.query);
      const result = await articlesService.findAll(query, request.currentUser!.branchIds);

      return reply.send({
        success: true,
        ...result,
      });
    }
  );

  // Get article by ID
  fastify.get(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Articles'],
        summary: 'Get article by ID',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const article = await articlesService.findById(id, request.currentUser!.branchIds);

      return reply.send({
        success: true,
        data: article,
      });
    }
  );

  // Get article by code
  fastify.get(
    '/code/:code',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Articles'],
        summary: 'Get article by code',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['code'],
          properties: {
            code: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { code } = request.params as { code: string };
      const article = await articlesService.findByCode(code, request.currentUser!.branchIds);

      return reply.send({
        success: true,
        data: article,
      });
    }
  );

  // Create article
  fastify.post(
    '/',
    {
      onRequest: [fastify.requireRole('ADMIN', 'WAREHOUSE_MANAGER')],
      schema: {
        tags: ['Articles'],
        summary: 'Create new article',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = createArticleSchema.parse(request.body);
      const article = await articlesService.create(input, request.currentUser!.id);

      return reply.code(201).send({
        success: true,
        data: article,
      });
    }
  );

  // Update article
  fastify.patch(
    '/:id',
    {
      onRequest: [fastify.requireRole('ADMIN', 'WAREHOUSE_MANAGER')],
      schema: {
        tags: ['Articles'],
        summary: 'Update article',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const input = updateArticleSchema.parse(request.body);
      const article = await articlesService.update(
        id,
        input,
        request.currentUser!.branchIds,
        request.currentUser!.id
      );

      return reply.send({
        success: true,
        data: article,
      });
    }
  );

  // Delete article
  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.requireRole('ADMIN')],
      schema: {
        tags: ['Articles'],
        summary: 'Delete article',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      await articlesService.delete(id, request.currentUser!.branchIds, request.currentUser!.id);

      return reply.send({
        success: true,
        message: 'Article deleted successfully',
      });
    }
  );

  // Check availability
  fastify.post(
    '/availability',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Articles'],
        summary: 'Check articles availability',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = availabilityCheckSchema.parse(request.body);
      const result = await articlesService.checkAvailability(
        input.articleIds,
        input.startDate,
        input.endDate,
        input.branchId,
        input.excludeReservationId
      );

      return reply.send({
        success: true,
        data: result,
      });
    }
  );
}
