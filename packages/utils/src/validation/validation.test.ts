import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidSwissPhone,
  isValidPostalCode,
  isValidSwissPostalCode,
  isValidVatNumber,
  isValidSwissVat,
  isValidIban,
  isValidSwissIban,
  isStrongPassword,
  isValidBarcode,
  isValidEan13,
  isValidUrl,
  isValidHexColor,
  sanitizeString,
  sanitizeHtml,
} from './index';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone numbers', () => {
      expect(isValidPhone('+41791234567')).toBe(true);
      expect(isValidPhone('+33612345678')).toBe(true);
      expect(isValidPhone('0041791234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('isValidSwissPhone', () => {
    it('should validate Swiss phone numbers', () => {
      expect(isValidSwissPhone('+41791234567')).toBe(true);
      expect(isValidSwissPhone('0791234567')).toBe(true);
      expect(isValidSwissPhone('+41 79 123 45 67')).toBe(true);
    });

    it('should reject non-Swiss phone numbers', () => {
      expect(isValidSwissPhone('+33612345678')).toBe(false);
      expect(isValidSwissPhone('123456')).toBe(false);
    });
  });

  describe('isValidPostalCode', () => {
    it('should validate postal codes', () => {
      expect(isValidPostalCode('1000')).toBe(true);
      expect(isValidPostalCode('75001')).toBe(true);
      expect(isValidPostalCode('12345-6789')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(isValidPostalCode('')).toBe(false);
      expect(isValidPostalCode('abc')).toBe(false);
    });
  });

  describe('isValidSwissPostalCode', () => {
    it('should validate Swiss postal codes', () => {
      expect(isValidSwissPostalCode('1000')).toBe(true);
      expect(isValidSwissPostalCode('8001')).toBe(true);
      expect(isValidSwissPostalCode('9999')).toBe(true);
    });

    it('should reject invalid Swiss postal codes', () => {
      expect(isValidSwissPostalCode('999')).toBe(false);
      expect(isValidSwissPostalCode('10000')).toBe(false);
      expect(isValidSwissPostalCode('0999')).toBe(false);
    });
  });

  describe('isValidSwissVat', () => {
    it('should validate Swiss VAT numbers', () => {
      expect(isValidSwissVat('CHE-123.456.789')).toBe(true);
      expect(isValidSwissVat('CHE123456789')).toBe(true);
      expect(isValidSwissVat('CHE-123.456.789 MWST')).toBe(true);
    });

    it('should reject invalid Swiss VAT numbers', () => {
      expect(isValidSwissVat('DE123456789')).toBe(false);
      expect(isValidSwissVat('CHE-12.34.567')).toBe(false);
    });
  });

  describe('isValidSwissIban', () => {
    it('should validate Swiss IBAN', () => {
      expect(isValidSwissIban('CH93 0076 2011 6238 5295 7')).toBe(true);
      expect(isValidSwissIban('CH9300762011623852957')).toBe(true);
    });

    it('should reject non-Swiss IBAN', () => {
      expect(isValidSwissIban('DE89370400440532013000')).toBe(false);
      expect(isValidSwissIban('invalid')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong passwords', () => {
      expect(isStrongPassword('MyP@ssw0rd!')).toBe(true);
      expect(isStrongPassword('Str0ng#Pass')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isStrongPassword('password')).toBe(false);
      expect(isStrongPassword('12345678')).toBe(false);
      expect(isStrongPassword('NoNumbers!')).toBe(false);
      expect(isStrongPassword('nonumber1!')).toBe(false);
      expect(isStrongPassword('Short1!')).toBe(false);
    });
  });

  describe('isValidBarcode', () => {
    it('should validate barcodes', () => {
      expect(isValidBarcode('1234567890123')).toBe(true);
      expect(isValidBarcode('ABC-123-XYZ')).toBe(true);
    });

    it('should reject invalid barcodes', () => {
      expect(isValidBarcode('')).toBe(false);
      expect(isValidBarcode('ab')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://sub.domain.org/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://invalid')).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate hex colors', () => {
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#ffffff')).toBe(true);
      expect(isValidHexColor('#ABC123')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('fff')).toBe(false);
      expect(isValidHexColor('#gg0000')).toBe(false);
      expect(isValidHexColor('#12345')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should trim and normalize whitespace', () => {
      expect(sanitizeString('  hello   world  ')).toBe('hello world');
      expect(sanitizeString('test\n\nstring')).toBe('test string');
    });

    it('should handle empty strings', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString('   ')).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
      expect(sanitizeHtml('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d');
    });
  });
});
