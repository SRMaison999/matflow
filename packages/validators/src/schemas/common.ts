// =====================================================
// MatFlow - Common Zod Schemas
// =====================================================

import { z } from 'zod';

// ----- Primitives -----
export const uuidSchema = z.string().uuid();

export const isoDateSchema = z.string().datetime();

export const emailSchema = z.string().email().toLowerCase();

export const phoneSchema = z.string().regex(/^(\+41|0)\d{9}$/, 'Invalid phone number');

export const passwordSchema = z
  .string()
  .min(8, 'Minimum 8 characters')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/\d/, 'Must contain number');

export const urlSchema = z.string().url();

// ----- Pagination -----
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  cursor: z.string().optional(),
});

export const sortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

// ----- Date Range -----
export const dateRangeSchema = z
  .object({
    start: isoDateSchema,
    end: isoDateSchema,
  })
  .refine((data) => new Date(data.start) <= new Date(data.end), {
    message: 'Start date must be before end date',
    path: ['end'],
  });

// ----- Address -----
export const addressSchema = z.object({
  street: z.string().min(1).max(200),
  streetLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  state: z.string().max(100).optional(),
  country: z.string().min(1).max(100),
  countryCode: z.string().length(2).toUpperCase(),
});

// ----- Contact -----
export const contactInfoSchema = z.object({
  email: emailSchema.optional(),
  phone: z.string().max(30).optional(),
  mobile: z.string().max(30).optional(),
  fax: z.string().max(30).optional(),
  website: urlSchema.optional(),
});

// ----- Dimensions -----
export const dimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  unit: z.enum(['mm', 'cm', 'm']),
});

export const weightSchema = z.object({
  value: z.number().nonnegative(),
  unit: z.enum(['g', 'kg']),
});

// ----- Money -----
export const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.enum(['CHF', 'EUR', 'USD', 'GBP']),
});

// ----- Localized String -----
export const localizedStringSchema = z.object({
  fr: z.string(),
  de: z.string().optional(),
  en: z.string().optional(),
  it: z.string().optional(),
});

// ----- File Info -----
export const fileInfoSchema = z.object({
  id: uuidSchema,
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number().positive(),
  url: urlSchema,
  thumbnailUrl: urlSchema.optional(),
  uploadedAt: isoDateSchema,
  uploadedBy: uuidSchema,
});

// ----- List Query -----
export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(), // field:asc or field:desc
  search: z.string().optional(),
  filter: z.string().optional(), // JSON encoded
  include: z.string().optional(), // comma-separated
  fields: z.string().optional(), // comma-separated
});

// ----- Enums as Schemas -----
export const userRoleSchema = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'PROJECT_MANAGER',
  'WAREHOUSE_MANAGER',
  'TECHNICIAN',
  'VIEWER',
]);

export const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED']);

export const articleTypeSchema = z.enum(['SERIALIZED', 'BATCH', 'CONSUMABLE']);

export const articleStatusSchema = z.enum([
  'AVAILABLE',
  'RESERVED',
  'IN_USE',
  'IN_TRANSIT',
  'IN_MAINTENANCE',
  'OUT_OF_SERVICE',
  'LOST',
  'SOLD',
]);

export const articleConditionSchema = z.enum([
  'NEW',
  'EXCELLENT',
  'GOOD',
  'FAIR',
  'POOR',
  'DAMAGED',
]);

export const reservationStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'DISPATCHED',
  'IN_USE',
  'RETURNING',
  'RETURNED',
  'COMPLETED',
  'CANCELLED',
]);

export const projectStatusSchema = z.enum([
  'DRAFT',
  'PLANNED',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
]);

export const projectTypeSchema = z.enum(['RENTAL', 'INTERNAL', 'SERVICE', 'MAINTENANCE']);

export const languageSchema = z.enum(['fr', 'de', 'en', 'it']);

export const currencySchema = z.enum(['CHF', 'EUR', 'USD', 'GBP']);
