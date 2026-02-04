// =====================================================
// MatFlow - Authentication Plugin
// =====================================================

import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from '@/config/index.js';
import { prisma } from '@/lib/prisma.js';
import { cache, cacheKeys } from '@/lib/redis.js';
import type { User, UserRole } from '@matflow/types';

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (...roles: UserRole[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
      role: string;
      branchId: string;
    };
    user: {
      userId: string;
      email: string;
      role: UserRole;
      branchId: string;
    };
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  branchId: string;
  branchIds: string[];
  permissions: string[];
}

// Extend FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: AuthUser;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  // Register JWT plugin
  await fastify.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.accessExpiration,
    },
  });

  // Authenticate decorator
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();

        const { userId } = request.user;

        // Try cache first
        let user = await cache.get<AuthUser>(cacheKeys.user(userId));

        if (!user) {
          // Fetch from database
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              branchId: true,
              branchIds: true,
              permissions: true,
            },
          });

          if (!dbUser || dbUser.status !== 'ACTIVE') {
            return reply.code(401).send({ error: 'Unauthorized' });
          }

          user = {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role as UserRole,
            branchId: dbUser.branchId,
            branchIds: dbUser.branchIds,
            permissions: dbUser.permissions,
          };

          // Cache for 5 minutes
          await cache.set(cacheKeys.user(userId), user, 300);
        }

        request.currentUser = user;
      } catch (error) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }
  );

  // Optional authentication decorator
  fastify.decorate(
    'optionalAuth',
    async function (request: FastifyRequest, _reply: FastifyReply) {
      try {
        await request.jwtVerify();

        const { userId } = request.user;
        const user = await cache.get<AuthUser>(cacheKeys.user(userId));

        if (user) {
          request.currentUser = user;
        }
      } catch {
        // Ignore auth errors for optional auth
      }
    }
  );

  // Role requirement decorator
  fastify.decorate('requireRole', function (...roles: UserRole[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      await fastify.authenticate(request, reply);

      if (!request.currentUser) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      if (!roles.includes(request.currentUser.role)) {
        return reply.code(403).send({ error: 'Forbidden - Insufficient permissions' });
      }
    };
  });
}

export default fp(authPlugin, {
  name: 'auth',
});
