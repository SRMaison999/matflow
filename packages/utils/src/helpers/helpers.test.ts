import { describe, it, expect, vi } from 'vitest';
import {
  generateUUID,
  generateShortId,
  generateCode,
  deepClone,
  deepMerge,
  pick,
  omit,
  isEmpty,
  isEqual,
  unique,
  groupBy,
  sortBy,
  chunk,
  capitalize,
  camelToSnake,
  snakeToCamel,
  ok,
  err,
  isOk,
  isErr,
  sleep,
  retry,
  debounce,
  throttle,
} from './index';

describe('Helper Utils', () => {
  describe('generateUUID', () => {
    it('should generate valid UUID format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('should generate unique UUIDs', () => {
      const uuids = Array.from({ length: 100 }, () => generateUUID());
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(100);
    });
  });

  describe('generateShortId', () => {
    it('should generate ID of specified length', () => {
      expect(generateShortId(8)).toHaveLength(8);
      expect(generateShortId(16)).toHaveLength(16);
    });

    it('should use default length of 12', () => {
      expect(generateShortId()).toHaveLength(12);
    });
  });

  describe('generateCode', () => {
    it('should generate code with prefix', () => {
      const code = generateCode('ART');
      expect(code).toMatch(/^ART-[A-Z0-9]{8}$/);
    });
  });

  describe('deepClone', () => {
    it('should clone objects deeply', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should clone arrays', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('isEmpty', () => {
    it('should check empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('isEqual', () => {
    it('should compare primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('a', 'a')).toBe(true);
      expect(isEqual(1, 2)).toBe(false);
    });

    it('should compare objects deeply', () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should compare arrays', () => {
      expect(isEqual([1, 2], [1, 2])).toBe(true);
      expect(isEqual([1, 2], [2, 1])).toBe(false);
    });
  });

  describe('unique', () => {
    it('should return unique values', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should work with key function', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(unique(arr, (x) => x.id)).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('groupBy', () => {
    it('should group by key', () => {
      const arr = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const grouped = groupBy(arr, 'type');
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });

  describe('sortBy', () => {
    it('should sort by key ascending', () => {
      const arr = [{ n: 3 }, { n: 1 }, { n: 2 }];
      expect(sortBy(arr, 'n')).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
    });

    it('should sort by key descending', () => {
      const arr = [{ n: 1 }, { n: 3 }, { n: 2 }];
      expect(sortBy(arr, 'n', 'desc')).toEqual([{ n: 3 }, { n: 2 }, { n: 1 }]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });
  });

  describe('camelToSnake', () => {
    it('should convert camelCase to snake_case', () => {
      expect(camelToSnake('firstName')).toBe('first_name');
      expect(camelToSnake('myLongVariableName')).toBe('my_long_variable_name');
    });
  });

  describe('snakeToCamel', () => {
    it('should convert snake_case to camelCase', () => {
      expect(snakeToCamel('first_name')).toBe('firstName');
      expect(snakeToCamel('my_long_variable_name')).toBe('myLongVariableName');
    });
  });

  describe('Result type helpers', () => {
    it('should create ok result', () => {
      const result = ok(42);
      expect(isOk(result)).toBe(true);
      expect(isErr(result)).toBe(false);
      expect(result.data).toBe(42);
    });

    it('should create err result', () => {
      const result = err('Something went wrong');
      expect(isOk(result)).toBe(false);
      expect(isErr(result)).toBe(true);
      expect(result.error).toBe('Something went wrong');
    });
  });

  describe('sleep', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await sleep(50);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(45);
    });
  });

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const fn = vi.fn(async () => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'success';
      });

      const result = await retry(fn, 3, 10);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const fn = vi.fn(async () => {
        throw new Error('always fails');
      });

      await expect(retry(fn, 2, 10)).rejects.toThrow('always fails');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      await sleep(60);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 50);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      await sleep(60);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
