import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatDimensions,
  formatWeight,
  formatAddress,
  formatFullName,
  formatInitials,
  formatPhoneNumber,
  truncate,
  pluralize,
  slugify,
} from './index';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency with default locale', () => {
      expect(formatCurrency(1234.56)).toMatch(/1.*234.*56/);
    });

    it('should format currency with specific currency', () => {
      const result = formatCurrency(100, 'EUR', 'de-DE');
      expect(result).toContain('100');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toContain('0');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with separators', () => {
      const result = formatNumber(1234567.89);
      expect(result).toMatch(/1.*234.*567/);
    });

    it('should respect decimal places', () => {
      expect(formatNumber(123.456, 2)).toMatch(/123.*46/);
    });
  });

  describe('formatPercent', () => {
    it('should format percentages', () => {
      expect(formatPercent(0.5)).toContain('50');
      expect(formatPercent(1)).toContain('100');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('formatDimensions', () => {
    it('should format dimensions object', () => {
      expect(formatDimensions({ length: 100, width: 50, height: 30 })).toBe(
        '100 x 50 x 30 cm'
      );
    });

    it('should use custom unit', () => {
      expect(formatDimensions({ length: 1, width: 0.5, height: 0.3 }, 'm')).toBe(
        '1 x 0.5 x 0.3 m'
      );
    });
  });

  describe('formatWeight', () => {
    it('should format weight in kg', () => {
      expect(formatWeight(5)).toBe('5 kg');
      expect(formatWeight(2.5)).toBe('2.5 kg');
    });

    it('should format weight in grams for small values', () => {
      expect(formatWeight(0.5)).toBe('500 g');
      expect(formatWeight(0.25)).toBe('250 g');
    });
  });

  describe('formatAddress', () => {
    it('should format complete address', () => {
      const address = {
        street: 'Rue du Test 123',
        postalCode: '1000',
        city: 'Lausanne',
        country: 'Suisse',
      };
      expect(formatAddress(address)).toBe('Rue du Test 123, 1000 Lausanne, Suisse');
    });

    it('should handle partial address', () => {
      const address = {
        city: 'Geneva',
        country: 'Switzerland',
      };
      expect(formatAddress(address)).toBe('Geneva, Switzerland');
    });
  });

  describe('formatFullName', () => {
    it('should format first and last name', () => {
      expect(formatFullName('John', 'Doe')).toBe('John Doe');
    });

    it('should handle missing parts', () => {
      expect(formatFullName('John', '')).toBe('John');
      expect(formatFullName('', 'Doe')).toBe('Doe');
    });
  });

  describe('formatInitials', () => {
    it('should extract initials', () => {
      expect(formatInitials('John', 'Doe')).toBe('JD');
      expect(formatInitials('Alice', 'Bob')).toBe('AB');
    });

    it('should handle single name', () => {
      expect(formatInitials('John', '')).toBe('J');
    });

    it('should uppercase initials', () => {
      expect(formatInitials('john', 'doe')).toBe('JD');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 5, ' [more]')).toBe('Hello [more]');
    });
  });

  describe('pluralize', () => {
    it('should return singular for count of 1', () => {
      expect(pluralize(1, 'item', 'items')).toBe('1 item');
    });

    it('should return plural for count > 1', () => {
      expect(pluralize(5, 'item', 'items')).toBe('5 items');
    });

    it('should return plural for count of 0', () => {
      expect(pluralize(0, 'item', 'items')).toBe('0 items');
    });
  });

  describe('slugify', () => {
    it('should convert to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test String 123')).toBe('test-string-123');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('should handle accents', () => {
      expect(slugify('Cafe Resume')).toBe('cafe-resume');
    });
  });
});
