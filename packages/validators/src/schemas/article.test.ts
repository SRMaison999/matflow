import { describe, it, expect } from 'vitest';
import {
  createArticleSchema,
  updateArticleSchema,
  articleFiltersSchema,
  bulkUpdateArticlesSchema,
} from './article';

describe('Article Schemas', () => {
  describe('createArticleSchema', () => {
    it('should validate correct article data', () => {
      const validData = {
        code: 'ART-001',
        name: 'Test Article',
        type: 'SERIALIZED',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        branchId: '550e8400-e29b-41d4-a716-446655440001',
      };
      const result = createArticleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate article with all optional fields', () => {
      const validData = {
        code: 'ART-002',
        name: 'Full Article',
        type: 'BATCH',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        branchId: '550e8400-e29b-41d4-a716-446655440001',
        description: 'A detailed description',
        barcode: '1234567890123',
        serialNumber: 'SN-12345',
        purchasePrice: 100.5,
        rentalPriceDaily: 10.0,
        weight: 5.5,
        dimensions: { length: 100, width: 50, height: 30 },
        locationId: '550e8400-e29b-41d4-a716-446655440002',
      };
      const result = createArticleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        name: 'Test Article',
      };
      const result = createArticleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid article type', () => {
      const invalidData = {
        code: 'ART-001',
        name: 'Test Article',
        type: 'INVALID_TYPE',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        branchId: '550e8400-e29b-41d4-a716-446655440001',
      };
      const result = createArticleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative prices', () => {
      const invalidData = {
        code: 'ART-001',
        name: 'Test Article',
        type: 'SERIALIZED',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        branchId: '550e8400-e29b-41d4-a716-446655440001',
        purchasePrice: -100,
      };
      const result = createArticleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        code: 'ART-001',
        name: 'Test Article',
        type: 'SERIALIZED',
        categoryId: 'not-a-uuid',
        branchId: '550e8400-e29b-41d4-a716-446655440001',
      };
      const result = createArticleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateArticleSchema', () => {
    it('should validate partial update', () => {
      const validData = {
        name: 'Updated Name',
      };
      const result = updateArticleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate status update', () => {
      const validData = {
        status: 'IN_MAINTENANCE',
      };
      const result = updateArticleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        status: 'INVALID_STATUS',
      };
      const result = updateArticleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow empty object', () => {
      const result = updateArticleSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('articleFiltersSchema', () => {
    it('should validate filter parameters', () => {
      const validFilters = {
        search: 'test',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'AVAILABLE',
        type: 'SERIALIZED',
        page: 1,
        limit: 20,
      };
      const result = articleFiltersSchema.safeParse(validFilters);
      expect(result.success).toBe(true);
    });

    it('should use default pagination', () => {
      const validFilters = {};
      const result = articleFiltersSchema.safeParse(validFilters);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should reject invalid page number', () => {
      const invalidFilters = {
        page: 0,
      };
      const result = articleFiltersSchema.safeParse(invalidFilters);
      expect(result.success).toBe(false);
    });

    it('should reject limit exceeding max', () => {
      const invalidFilters = {
        limit: 200,
      };
      const result = articleFiltersSchema.safeParse(invalidFilters);
      expect(result.success).toBe(false);
    });
  });

  describe('bulkUpdateArticlesSchema', () => {
    it('should validate bulk update', () => {
      const validData = {
        ids: [
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440001',
        ],
        data: {
          status: 'IN_MAINTENANCE',
        },
      };
      const result = bulkUpdateArticlesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty ids array', () => {
      const invalidData = {
        ids: [],
        data: {
          status: 'AVAILABLE',
        },
      };
      const result = bulkUpdateArticlesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
