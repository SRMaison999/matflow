import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  refreshToken: {
    create: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  passwordResetToken: {
    create: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
  },
};

const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
};

const mockJwt = {
  sign: vi.fn().mockReturnValue('mock-token'),
  verify: vi.fn(),
};

const mockEmail = {
  sendPasswordReset: vi.fn(),
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

vi.mock('@/lib/redis', () => ({
  redis: mockRedis,
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        AuthService.login({
          email: 'notfound@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if user is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        isActive: false,
        passwordHash: 'hash',
      });

      await expect(
        AuthService.login({
          email: 'user@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Account is disabled');
    });

    it('should throw error if password is incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        isActive: true,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$wronghash',
      });

      await expect(
        AuthService.login({
          email: 'user@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should delete refresh token and clear cache', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await AuthService.logout('user-id', 'refresh-token');

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-id',
          token: 'refresh-token',
        },
      });
    });
  });

  describe('forgotPassword', () => {
    it('should not throw if user not found (security)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        AuthService.forgotPassword('notfound@example.com')
      ).resolves.not.toThrow();
    });

    it('should create reset token if user exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
      });
      mockPrisma.passwordResetToken.create.mockResolvedValue({
        token: 'reset-token',
      });

      await AuthService.forgotPassword('user@example.com');

      expect(mockPrisma.passwordResetToken.create).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw if token is invalid', async () => {
      mockPrisma.passwordResetToken.findFirst.mockResolvedValue(null);

      await expect(
        AuthService.resetPassword('invalid-token', 'NewPassword123!')
      ).rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw if token is expired', async () => {
      mockPrisma.passwordResetToken.findFirst.mockResolvedValue({
        id: '1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        AuthService.resetPassword('expired-token', 'NewPassword123!')
      ).rejects.toThrow('Invalid or expired reset token');
    });
  });

  describe('changePassword', () => {
    it('should throw if current password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$wronghash',
      });

      await expect(
        AuthService.changePassword('user-1', 'wrong-current', 'NewPassword123!')
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('validateToken', () => {
    it('should return null if token is invalid', async () => {
      const result = await AuthService.validateToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const user = {
        id: 'user-1',
        email: 'user@example.com',
        role: 'ADMIN',
        branchId: 'branch-1',
      };

      const result = AuthService.generateTokens(user as any);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
