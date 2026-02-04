// =====================================================
// MatFlow - User Validation Schemas
// =====================================================

import { z } from 'zod';
import {
  uuidSchema,
  emailSchema,
  passwordSchema,
  userRoleSchema,
  userStatusSchema,
  languageSchema,
} from './common';

// ----- Create User -----
export const createUserSchema = z.object({
  email: emailSchema,
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid username format'),
  password: passwordSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: userRoleSchema,
  branchId: uuidSchema,
  branchIds: z.array(uuidSchema).optional(),
  language: languageSchema.optional().default('fr'),
  phone: z.string().max(30).optional(),
  mobile: z.string().max(30).optional(),
  jobTitle: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ----- Update User -----
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  branchId: uuidSchema.optional(),
  branchIds: z.array(uuidSchema).optional(),
  language: languageSchema.optional(),
  phone: z.string().max(30).optional(),
  mobile: z.string().max(30).optional(),
  jobTitle: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ----- Update Profile (self) -----
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional(),
  mobile: z.string().max(30).optional(),
  language: languageSchema.optional(),
  timezone: z.string().max(50).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ----- Update Notification Preferences -----
export const updateNotificationPreferencesSchema = z.object({
  channels: z.array(z.enum(['IN_APP', 'EMAIL', 'PUSH', 'SMS'])).optional(),
  categories: z
    .object({
      reservation: z.boolean().optional(),
      project: z.boolean().optional(),
      stock: z.boolean().optional(),
      maintenance: z.boolean().optional(),
      billing: z.boolean().optional(),
      system: z.boolean().optional(),
    })
    .optional(),
  quietHours: z
    .object({
      enabled: z.boolean(),
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
      timezone: z.string(),
    })
    .optional(),
  dailyDigest: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
});

export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;

// ----- User Preferences -----
export const updateUserPreferencesSchema = z.object({
  language: languageSchema.optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  timeFormat: z.enum(['12h', '24h']).optional(),
  firstDayOfWeek: z.union([z.literal(0), z.literal(1), z.literal(6)]).optional(),
  defaultBranchId: uuidSchema.optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  sidebarCollapsed: z.boolean().optional(),
  tableRowsPerPage: z.number().int().positive().max(100).optional(),
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;

// ----- User Query -----
export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  branchId: uuidSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;
