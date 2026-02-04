import { describe, it, expect } from 'vitest';
import {
  uuidSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  moneySchema,
  positiveIntSchema,
  dateSchema,
  dateRangeSchema,
  addressSchema,
  paginationSchema,
  sortSchema,
  idParamSchema,
} from './common';

describe('Common Schemas', () => {
  describe('uuidSchema', () => {
    it('should validate correct UUID', () => {
      const result = uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000');
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = uuidSchema.safeParse('not-a-uuid');
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = uuidSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('emailSchema', () => {
    it('should validate correct email', () => {
      expect(emailSchema.safeParse('user@example.com').success).toBe(true);
      expect(emailSchema.safeParse('test.user+tag@domain.org').success).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(emailSchema.safeParse('invalid').success).toBe(false);
      expect(emailSchema.safeParse('@domain.com').success).toBe(false);
    });

    it('should lowercase email', () => {
      const result = emailSchema.safeParse('USER@EXAMPLE.COM');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('user@example.com');
      }
    });
  });

  describe('phoneSchema', () => {
    it('should validate phone numbers', () => {
      expect(phoneSchema.safeParse('+41791234567').success).toBe(true);
      expect(phoneSchema.safeParse('0791234567').success).toBe(true);
    });
  });

  describe('urlSchema', () => {
    it('should validate URLs', () => {
      expect(urlSchema.safeParse('https://example.com').success).toBe(true);
      expect(urlSchema.safeParse('http://localhost:3000').success).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(urlSchema.safeParse('not-a-url').success).toBe(false);
    });
  });

  describe('moneySchema', () => {
    it('should validate positive money values', () => {
      expect(moneySchema.safeParse(100).success).toBe(true);
      expect(moneySchema.safeParse(99.99).success).toBe(true);
      expect(moneySchema.safeParse(0).success).toBe(true);
    });

    it('should reject negative values', () => {
      expect(moneySchema.safeParse(-1).success).toBe(false);
    });
  });

  describe('positiveIntSchema', () => {
    it('should validate positive integers', () => {
      expect(positiveIntSchema.safeParse(1).success).toBe(true);
      expect(positiveIntSchema.safeParse(100).success).toBe(true);
    });

    it('should reject zero and negative', () => {
      expect(positiveIntSchema.safeParse(0).success).toBe(false);
      expect(positiveIntSchema.safeParse(-1).success).toBe(false);
    });

    it('should reject non-integers', () => {
      expect(positiveIntSchema.safeParse(1.5).success).toBe(false);
    });
  });

  describe('dateSchema', () => {
    it('should validate date strings', () => {
      expect(dateSchema.safeParse('2024-06-15').success).toBe(true);
      expect(dateSchema.safeParse('2024-06-15T14:30:00Z').success).toBe(true);
    });

    it('should validate Date objects', () => {
      expect(dateSchema.safeParse(new Date()).success).toBe(true);
    });
  });

  describe('dateRangeSchema', () => {
    it('should validate valid date range', () => {
      const validRange = {
        startDate: '2024-06-15',
        endDate: '2024-06-20',
      };
      const result = dateRangeSchema.safeParse(validRange);
      expect(result.success).toBe(true);
    });

    it('should reject end before start', () => {
      const invalidRange = {
        startDate: '2024-06-20',
        endDate: '2024-06-15',
      };
      const result = dateRangeSchema.safeParse(invalidRange);
      expect(result.success).toBe(false);
    });
  });

  describe('addressSchema', () => {
    it('should validate complete address', () => {
      const validAddress = {
        street: '123 Main St',
        city: 'Zurich',
        postalCode: '8001',
        country: 'Switzerland',
      };
      const result = addressSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it('should validate partial address', () => {
      const partialAddress = {
        city: 'Geneva',
        country: 'Switzerland',
      };
      const result = addressSchema.safeParse(partialAddress);
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should provide defaults', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should validate custom pagination', () => {
      const result = paginationSchema.safeParse({ page: 5, limit: 50 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(result.data.limit).toBe(50);
      }
    });

    it('should reject invalid values', () => {
      expect(paginationSchema.safeParse({ page: 0 }).success).toBe(false);
      expect(paginationSchema.safeParse({ limit: 0 }).success).toBe(false);
      expect(paginationSchema.safeParse({ limit: 200 }).success).toBe(false);
    });
  });

  describe('sortSchema', () => {
    it('should validate sort parameters', () => {
      const result = sortSchema.safeParse({ sortBy: 'name', sortOrder: 'asc' });
      expect(result.success).toBe(true);
    });

    it('should accept desc order', () => {
      const result = sortSchema.safeParse({ sortBy: 'createdAt', sortOrder: 'desc' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid sort order', () => {
      const result = sortSchema.safeParse({ sortBy: 'name', sortOrder: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('idParamSchema', () => {
    it('should validate id parameter', () => {
      const result = idParamSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid id', () => {
      const result = idParamSchema.safeParse({ id: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });
  });
});
