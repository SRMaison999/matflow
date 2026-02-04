// =====================================================
// MatFlow - Validation Utilities
// =====================================================

import type { ValidationError } from '@matflow/types';

// ----- Email -----
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ----- Phone -----
export function isValidPhone(phone: string): boolean {
  // Swiss phone: +41XXXXXXXXX or 0XXXXXXXXX
  const cleaned = phone.replace(/\D/g, '');
  return (
    (cleaned.startsWith('41') && cleaned.length === 11) ||
    (cleaned.startsWith('0') && cleaned.length === 10)
  );
}

// ----- Swiss Postal Code -----
export function isValidSwissPostalCode(code: string): boolean {
  return /^\d{4}$/.test(code);
}

// ----- VAT Number -----
export function isValidSwissVatNumber(vat: string): boolean {
  // Format: CHE-XXX.XXX.XXX or CHE-XXX.XXX.XXX MWST
  const cleaned = vat.replace(/[\s.]/g, '').toUpperCase();
  return /^CHE\d{9}(MWST|TVA|IVA)?$/.test(cleaned);
}

export function isValidEUVatNumber(vat: string): boolean {
  // Basic EU VAT format check (country code + digits)
  return /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(vat.replace(/\s/g, '').toUpperCase());
}

// ----- IBAN -----
export function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  // Basic format check
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned)) {
    return false;
  }

  // Swiss IBAN
  if (cleaned.startsWith('CH') && cleaned.length !== 21) {
    return false;
  }

  // Checksum validation
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numericString = rearranged
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      return code >= 65 ? (code - 55).toString() : char;
    })
    .join('');

  let remainder = 0;
  for (const digit of numericString) {
    remainder = (remainder * 10 + parseInt(digit)) % 97;
  }

  return remainder === 1;
}

// ----- Password Strength -----
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Ajoutez des lettres minuscules');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Ajoutez des lettres majuscules');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Ajoutez des chiffres');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Ajoutez des caractères spéciaux');
  }

  return {
    score: Math.min(score, 4),
    feedback,
    isStrong: score >= 4,
  };
}

// ----- Barcode -----
export function isValidBarcode(barcode: string): boolean {
  // EAN-13
  if (/^\d{13}$/.test(barcode)) {
    return validateEAN13(barcode);
  }
  // EAN-8
  if (/^\d{8}$/.test(barcode)) {
    return validateEAN8(barcode);
  }
  // UPC-A
  if (/^\d{12}$/.test(barcode)) {
    return validateUPCA(barcode);
  }
  // Code 39 / Code 128 (alphanumeric)
  if (/^[A-Z0-9\-.\s$\/+%]+$/i.test(barcode)) {
    return true;
  }
  return false;
}

function validateEAN13(barcode: string): boolean {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]!);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode[12]!);
}

function validateEAN8(barcode: string): boolean {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(barcode[i]!);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode[7]!);
}

function validateUPCA(barcode: string): boolean {
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(barcode[i]!);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode[11]!);
}

// ----- URL -----
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ----- Validation Result Builder -----
export class ValidationResult {
  private errors: ValidationError[] = [];

  addError(field: string, message: string, code: string = 'invalid'): this {
    this.errors.push({ field, message, code });
    return this;
  }

  addIf(condition: boolean, field: string, message: string, code?: string): this {
    if (condition) {
      this.addError(field, message, code);
    }
    return this;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): ValidationError[] {
    return [...this.errors];
  }

  getFirstError(): ValidationError | undefined {
    return this.errors[0];
  }

  toResult<T>(data: T): { success: true; data: T } | { success: false; errors: ValidationError[] } {
    if (this.isValid()) {
      return { success: true, data };
    }
    return { success: false, errors: this.errors };
  }
}

export function validate(): ValidationResult {
  return new ValidationResult();
}
