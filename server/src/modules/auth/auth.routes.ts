// =====================================================
// MatFlow - Auth Routes
// =====================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '@matflow/validators';
import { AuthService } from './auth.service.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);

  // Login
  fastify.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'User login',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            rememberMe: { type: 'boolean' },
            twoFactorCode: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  expiresIn: { type: 'number' },
                  tokenType: { type: 'string' },
                  user: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = loginSchema.parse(request.body);
      const result = await authService.login(input);

      return reply.send({
        success: true,
        data: result,
      });
    }
  );

  // Refresh token
  fastify.post(
    '/refresh',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { refreshToken } = request.body as { refreshToken: string };
      const result = await authService.refreshToken(refreshToken);

      return reply.send({
        success: true,
        data: result,
      });
    }
  );

  // Logout
  fastify.post(
    '/logout',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'User logout',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { refreshToken } = request.body as { refreshToken?: string };
      await authService.logout(request.currentUser!.id, refreshToken);

      return reply.send({
        success: true,
        message: 'Logged out successfully',
      });
    }
  );

  // Forgot password
  fastify.post(
    '/forgot-password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Request password reset',
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = forgotPasswordSchema.parse(request.body);
      await authService.forgotPassword(input.email);

      return reply.send({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }
  );

  // Reset password
  fastify.post(
    '/reset-password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        body: {
          type: 'object',
          required: ['token', 'password', 'passwordConfirmation'],
          properties: {
            token: { type: 'string' },
            password: { type: 'string' },
            passwordConfirmation: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = resetPasswordSchema.parse(request.body);
      await authService.resetPassword(input.token, input.password);

      return reply.send({
        success: true,
        message: 'Password reset successfully',
      });
    }
  );

  // Change password
  fastify.post(
    '/change-password',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Change password',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['currentPassword', 'newPassword', 'newPasswordConfirmation'],
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string' },
            newPasswordConfirmation: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = changePasswordSchema.parse(request.body);
      await authService.changePassword(
        request.currentUser!.id,
        input.currentPassword,
        input.newPassword
      );

      return reply.send({
        success: true,
        message: 'Password changed successfully',
      });
    }
  );

  // Get current user
  fastify.get(
    '/me',
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Get current user info',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({
        success: true,
        data: request.currentUser,
      });
    }
  );
}
