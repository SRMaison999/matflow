// =====================================================
// MatFlow - Auth Service
// =====================================================

import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import type { FastifyInstance } from 'fastify';
import { prisma } from '@/lib/prisma.js';
import { cache, cacheKeys } from '@/lib/redis.js';
import { email, emailTemplates } from '@/lib/email.js';
import { config } from '@/config/index.js';
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ConflictError,
} from '@/middleware/errorHandler.js';
import type { LoginInput, RegisterInput, AuthTokens } from '@matflow/types';

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async login(input: LoginInput): Promise<AuthTokens & { user: unknown }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    const validPassword = await argon2.verify(user.passwordHash, input.password);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // TODO: Handle 2FA if enabled

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role, user.branchId);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        branchId: user.branchId,
        branchName: user.branch.name,
        permissions: user.permissions,
      },
    };
  }

  async register(input: RegisterInput): Promise<{ userId: string }> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await argon2.hash(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.email.split('@')[0] || nanoid(8),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        displayName: `${input.firstName} ${input.lastName}`,
        role: 'TECHNICIAN',
        status: 'PENDING',
        branchId: '', // TODO: Get default branch
        branchIds: [],
        notificationPrefs: {
          channels: ['IN_APP', 'EMAIL'],
          categories: {
            reservation: true,
            project: true,
            stock: true,
            maintenance: true,
            billing: true,
            system: true,
          },
        },
        permissions: [],
      },
    });

    // Send welcome email
    const template = emailTemplates.welcomeEmail(
      user.displayName,
      `${config.app.url}/login`
    );
    await email.send({
      to: user.email,
      ...template,
    });

    return { userId: user.id };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    // Find refresh token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError('Refresh token expired');
    }

    if (storedToken.user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    // Generate new access token
    const accessToken = this.fastify.jwt.sign({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      branchId: storedToken.user.branchId,
    });

    return {
      accessToken,
      expiresIn: this.parseExpiration(config.jwt.accessExpiration),
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    // Invalidate refresh token
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
    }

    // Clear cache
    await cache.del(cacheKeys.user(userId));
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = nanoid(32);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Store token in Redis
    await cache.set(
      `password_reset:${resetToken}`,
      { userId: user.id, email: user.email },
      3600
    );

    // Send email
    const resetUrl = `${config.app.url}/reset-password?token=${resetToken}`;
    const template = emailTemplates.passwordReset(resetUrl, user.displayName);
    await email.send({
      to: user.email,
      ...template,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Get token from Redis
    const data = await cache.get<{ userId: string; email: string }>(
      `password_reset:${token}`
    );

    if (!data) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await argon2.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
      },
    });

    // Delete token
    await cache.del(`password_reset:${token}`);

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: data.userId },
    });

    // Clear user cache
    await cache.del(cacheKeys.user(data.userId));
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Verify current password
    const validPassword = await argon2.verify(user.passwordHash, currentPassword);
    if (!validPassword) {
      throw new ValidationError('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await argon2.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
      },
    });

    // Invalidate all refresh tokens except current
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // Clear user cache
    await cache.del(cacheKeys.user(userId));
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    branchId: string
  ): Promise<AuthTokens> {
    // Generate access token
    const accessToken = this.fastify.jwt.sign({
      userId,
      email,
      role,
      branchId,
    });

    // Generate refresh token
    const refreshToken = nanoid(64);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + this.parseExpiration(config.jwt.refreshExpiration) * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiration(config.jwt.accessExpiration),
      tokenType: 'Bearer',
    };
  }

  private parseExpiration(exp: string): number {
    const match = exp.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const [, value, unit] = match;
    const num = parseInt(value || '15', 10);

    switch (unit) {
      case 's':
        return num;
      case 'm':
        return num * 60;
      case 'h':
        return num * 3600;
      case 'd':
        return num * 86400;
      default:
        return 900;
    }
  }
}
