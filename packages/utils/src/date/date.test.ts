import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelative,
  parseDate,
  isValidDate,
  startOfDay,
  endOfDay,
  addDays,
  addMonths,
  addYears,
  diffInDays,
  diffInMonths,
  diffInYears,
  isBefore,
  isAfter,
  isSameDay,
  isWeekend,
  getWeekNumber,
  getQuarter,
} from './index';

describe('Date Utils', () => {
  const testDate = new Date('2024-06-15T14:30:00.000Z');

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/06|juin|Jun/i);
      expect(result).toMatch(/2024/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const result = formatDateTime(testDate);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2024/);
    });
  });

  describe('formatTime', () => {
    it('should format time', () => {
      const result = formatTime(testDate);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('formatRelative', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format relative time', () => {
      const oneHourAgo = new Date('2024-06-15T11:00:00.000Z');
      const result = formatRelative(oneHourAgo);
      expect(result).toMatch(/1|hour|heure/i);
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date string', () => {
      const result = parseDate('2024-06-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(5);
      expect(result?.getDate()).toBe(15);
    });

    it('should return null for invalid date', () => {
      expect(parseDate('invalid')).toBeNull();
      expect(parseDate('')).toBeNull();
    });
  });

  describe('isValidDate', () => {
    it('should validate dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2024-06-15'))).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate(null as any)).toBe(false);
    });
  });

  describe('startOfDay', () => {
    it('should return start of day', () => {
      const result = startOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return end of day', () => {
      const result = endOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('addDays', () => {
    it('should add days', () => {
      const result = addDays(new Date('2024-06-15'), 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle negative days', () => {
      const result = addDays(new Date('2024-06-15'), -5);
      expect(result.getDate()).toBe(10);
    });

    it('should handle month rollover', () => {
      const result = addDays(new Date('2024-06-30'), 5);
      expect(result.getMonth()).toBe(6);
      expect(result.getDate()).toBe(5);
    });
  });

  describe('addMonths', () => {
    it('should add months', () => {
      const result = addMonths(new Date('2024-06-15'), 3);
      expect(result.getMonth()).toBe(8);
    });

    it('should handle year rollover', () => {
      const result = addMonths(new Date('2024-11-15'), 3);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1);
    });
  });

  describe('addYears', () => {
    it('should add years', () => {
      const result = addYears(new Date('2024-06-15'), 2);
      expect(result.getFullYear()).toBe(2026);
    });
  });

  describe('diffInDays', () => {
    it('should calculate difference in days', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2024-06-20');
      expect(diffInDays(date1, date2)).toBe(5);
    });

    it('should return negative for past dates', () => {
      const date1 = new Date('2024-06-20');
      const date2 = new Date('2024-06-15');
      expect(diffInDays(date1, date2)).toBe(-5);
    });
  });

  describe('isBefore', () => {
    it('should check if date is before another', () => {
      const date1 = new Date('2024-06-10');
      const date2 = new Date('2024-06-15');
      expect(isBefore(date1, date2)).toBe(true);
      expect(isBefore(date2, date1)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('should check if date is after another', () => {
      const date1 = new Date('2024-06-20');
      const date2 = new Date('2024-06-15');
      expect(isAfter(date1, date2)).toBe(true);
      expect(isAfter(date2, date1)).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('should check if dates are same day', () => {
      const date1 = new Date('2024-06-15T10:00:00');
      const date2 = new Date('2024-06-15T20:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2024-06-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isWeekend', () => {
    it('should identify weekends', () => {
      expect(isWeekend(new Date('2024-06-15'))).toBe(true);
      expect(isWeekend(new Date('2024-06-16'))).toBe(true);
    });

    it('should identify weekdays', () => {
      expect(isWeekend(new Date('2024-06-17'))).toBe(false);
      expect(isWeekend(new Date('2024-06-14'))).toBe(false);
    });
  });

  describe('getWeekNumber', () => {
    it('should return week number', () => {
      const result = getWeekNumber(new Date('2024-01-08'));
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(53);
    });
  });

  describe('getQuarter', () => {
    it('should return correct quarter', () => {
      expect(getQuarter(new Date('2024-01-15'))).toBe(1);
      expect(getQuarter(new Date('2024-04-15'))).toBe(2);
      expect(getQuarter(new Date('2024-07-15'))).toBe(3);
      expect(getQuarter(new Date('2024-10-15'))).toBe(4);
    });
  });
});
