// =====================================================
// MatFlow - Article Validation Schemas
// =====================================================

import { z } from 'zod';
import {
  uuidSchema,
  isoDateSchema,
  moneySchema,
  dimensionsSchema,
  weightSchema,
  articleTypeSchema,
  articleStatusSchema,
  articleConditionSchema,
} from './common';

// ----- Create Article -----
export const createArticleSchema = z.object({
  code: z.string().max(50).optional(), // Auto-generated if not provided
  barcode: z.string().max(50).optional(),
  serialNumber: z.string().max(100).optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: articleTypeSchema,
  categoryId: uuidSchema,
  tags: z.array(z.string().max(50)).max(20).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  condition: articleConditionSchema.optional().default('GOOD'),
  dimensions: dimensionsSchema.optional(),
  weight: weightSchema.optional(),
  color: z.string().max(50).optional(),
  purchasePrice: moneySchema.optional(),
  purchaseDate: isoDateSchema.optional(),
  rentalPriceDaily: moneySchema.optional(),
  rentalPriceWeekly: moneySchema.optional(),
  branchId: uuidSchema,
  locationId: uuidSchema.optional(),
  quantity: z.number().int().nonnegative().optional(),
  unit: z.string().max(20).optional(),
  minStock: z.number().int().nonnegative().optional(),
  warrantyExpiresAt: isoDateSchema.optional(),
  maintenanceIntervalDays: z.number().int().positive().optional(),
  customAttributes: z.record(z.unknown()).optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

// ----- Update Article -----
export const updateArticleSchema = z.object({
  code: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  serialNumber: z.string().max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  categoryId: uuidSchema.optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  status: articleStatusSchema.optional(),
  condition: articleConditionSchema.optional(),
  conditionNotes: z.string().max(500).optional(),
  dimensions: dimensionsSchema.optional(),
  weight: weightSchema.optional(),
  color: z.string().max(50).optional(),
  purchasePrice: moneySchema.optional(),
  currentValue: moneySchema.optional(),
  replacementValue: moneySchema.optional(),
  insuranceValue: moneySchema.optional(),
  rentalPriceDaily: moneySchema.optional(),
  rentalPriceWeekly: moneySchema.optional(),
  locationId: uuidSchema.optional(),
  minStock: z.number().int().nonnegative().optional(),
  maxStock: z.number().int().nonnegative().optional(),
  warrantyExpiresAt: isoDateSchema.optional(),
  maintenanceIntervalDays: z.number().int().positive().optional(),
  customAttributes: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

// ----- Article Query -----
export const articleQuerySchema = z.object({
  search: z.string().optional(),
  type: articleTypeSchema.optional(),
  status: articleStatusSchema.optional(),
  condition: articleConditionSchema.optional(),
  categoryId: uuidSchema.optional(),
  branchId: uuidSchema.optional(),
  locationId: uuidSchema.optional(),
  tags: z.string().optional(), // comma-separated
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

export type ArticleQueryInput = z.infer<typeof articleQuerySchema>;

// ----- Bulk Update -----
export const bulkArticleUpdateSchema = z.object({
  articleIds: z.array(uuidSchema).min(1).max(100),
  updates: updateArticleSchema.partial(),
});

export type BulkArticleUpdateInput = z.infer<typeof bulkArticleUpdateSchema>;

// ----- Bulk Move -----
export const bulkArticleMoveSchema = z.object({
  articleIds: z.array(uuidSchema).min(1).max(100),
  targetLocationId: uuidSchema,
  targetBranchId: uuidSchema.optional(),
});

export type BulkArticleMoveInput = z.infer<typeof bulkArticleMoveSchema>;

// ----- Category -----
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  parentId: uuidSchema.optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  customAttributes: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        key: z.string().min(1).max(50).regex(/^[a-z][a-zA-Z0-9]*$/),
        type: z.enum(['string', 'number', 'boolean', 'date', 'select', 'multiselect']),
        options: z.array(z.string()).optional(),
        unit: z.string().max(20).optional(),
        isRequired: z.boolean().optional().default(false),
        isFilterable: z.boolean().optional().default(false),
        isSearchable: z.boolean().optional().default(false),
      })
    )
    .optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
