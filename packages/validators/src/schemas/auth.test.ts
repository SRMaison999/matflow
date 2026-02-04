import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from './auth';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional rememberMe', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'newuser@example.com',
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'newuser@example.com',
        password: 'StrongP@ss1',
        confirmPassword: 'DifferentPass1',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'newuser@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short names', () => {
      const invalidData = {
        email: 'newuser@example.com',
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
        firstName: 'J',
        lastName: 'Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const validData = { email: 'user@example.com' };
      const result = forgotPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = { email: 'not-an-email' };
      const result = forgotPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate correct reset data', () => {
      const validData = {
        token: 'valid-reset-token',
        password: 'NewStr0ng!Pass',
        confirmPassword: 'NewStr0ng!Pass',
      };
      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const invalidData = {
        token: '',
        password: 'NewStr0ng!Pass',
        confirmPassword: 'NewStr0ng!Pass',
      };
      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate correct change password data', () => {
      const validData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewStr0ng!Pass',
        confirmPassword: 'NewStr0ng!Pass',
      };
      const result = changePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject same old and new password', () => {
      const invalidData = {
        currentPassword: 'SamePass123!',
        newPassword: 'SamePass123!',
        confirmPassword: 'SamePass123!',
      };
      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('refreshTokenSchema', () => {
    it('should validate refresh token', () => {
      const validData = { refreshToken: 'valid-refresh-token' };
      const result = refreshTokenSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const invalidData = { refreshToken: '' };
      const result = refreshTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
