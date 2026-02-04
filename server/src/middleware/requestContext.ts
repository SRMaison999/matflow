// =====================================================
// MatFlow - Request Context Middleware
// =====================================================

import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { generateUUID } from '@matflow/utils';

// Extend FastifyRequest with context
declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
    startTime: bigint;
  }
}

export function requestContextHook(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  // Generate unique request ID
  request.requestId = (request.headers['x-request-id'] as string) || generateUUID();

  // Track request start time
  request.startTime = process.hrtime.bigint();

  done();
}

export function responseTimeHook(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  // Calculate response time
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - request.startTime) / 1_000_000; // Convert to milliseconds

  // Add headers
  reply.header('X-Request-Id', request.requestId);
  reply.header('X-Response-Time', `${duration.toFixed(2)}ms`);

  done();
}
