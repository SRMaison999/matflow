// =====================================================
// MatFlow - Auth Validation Schemas
// =====================================================

import { z } from 'zod';
import { emailSchema, passwordSchema } from './common';

// ----- Login -----
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
  twoFactorCode: z.string().length(6).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ----- Register -----
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string(),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ----- Forgot Password -----
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ----- Reset Password -----
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ----- Change Password -----
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirmation'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ----- Refresh Token -----
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// ----- Two Factor -----
export const twoFactorVerifySchema = z.object({
  code: z.string().length(6).regex(/^\d+$/, 'Code must be numeric'),
});

export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchema>;

// ----- Email Verification -----
export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
