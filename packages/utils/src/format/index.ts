// =====================================================
// MatFlow - Formatting Utilities
// =====================================================

import type { Money, Dimensions, Weight, Address, Currency } from '@matflow/types';

// ----- Currency Formatting -----
const currencyFormats: Record<Currency, { locale: string; symbol: string }> = {
  CHF: { locale: 'de-CH', symbol: 'CHF' },
  EUR: { locale: 'de-DE', symbol: '€' },
  USD: { locale: 'en-US', symbol: '$' },
  GBP: { locale: 'en-GB', symbol: '£' },
};

export function formatMoney(money: Money, showSymbol: boolean = true): string {
  const config = currencyFormats[money.currency] || currencyFormats.CHF;
  const formatter = new Intl.NumberFormat(config.locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(money.amount);
}

export function formatAmount(
  amount: number,
  currency: Currency = 'CHF'
): string {
  return formatMoney({ amount, currency });
}

export function parseMoney(value: string, currency: Currency = 'CHF'): Money {
  const cleanValue = value.replace(/[^\d.,\-]/g, '').replace(',', '.');
  const amount = parseFloat(cleanValue);
  return { amount: isNaN(amount) ? 0 : amount, currency };
}

// ----- Number Formatting -----
export function formatNumber(
  value: number,
  locale: string = 'de-CH',
  decimals: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatInteger(value: number, locale: string = 'de-CH'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return `${formatNumber(value * 100, 'de-CH', decimals)}%`;
}

// ----- Dimensions Formatting -----
export function formatDimensions(dimensions: Dimensions): string {
  const { length, width, height, unit } = dimensions;
  return `${length} × ${width} × ${height} ${unit}`;
}

export function formatWeight(weight: Weight): string {
  if (weight.unit === 'kg') {
    return `${formatNumber(weight.value, 'de-CH', 2)} kg`;
  }
  return `${formatInteger(weight.value)} g`;
}

export function formatVolume(dimensions: Dimensions): string {
  const volume = dimensions.length * dimensions.width * dimensions.height;

  if (dimensions.unit === 'm') {
    return `${formatNumber(volume, 'de-CH', 2)} m³`;
  } else if (dimensions.unit === 'cm') {
    const volumeM3 = volume / 1000000;
    return volumeM3 >= 0.001
      ? `${formatNumber(volumeM3, 'de-CH', 3)} m³`
      : `${formatInteger(volume)} cm³`;
  } else {
    const volumeCm3 = volume / 1000;
    return `${formatInteger(volumeCm3)} cm³`;
  }
}

// ----- Address Formatting -----
export function formatAddress(address: Address, multiline: boolean = true): string {
  const lines = [
    address.street,
    address.streetLine2,
    `${address.postalCode} ${address.city}`,
    address.state,
    address.country,
  ].filter(Boolean);

  return multiline ? lines.join('\n') : lines.join(', ');
}

export function formatAddressOneLine(address: Address): string {
  return formatAddress(address, false);
}

// ----- String Formatting -----
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str.split(' ').map(capitalize).join(' ');
}

export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ----- Phone Formatting -----
export function formatPhone(phone: string): string {
  // Swiss format: +41 XX XXX XX XX
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('41') && cleaned.length === 11) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }

  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
}

// ----- File Size Formatting -----
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, 'en-US', unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

// ----- Duration Formatting -----
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

export function formatDurationLong(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourStr = `${hours} heure${hours > 1 ? 's' : ''}`;

  if (remainingMinutes === 0) {
    return hourStr;
  }

  return `${hourStr} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
}

// ----- Quantity Formatting -----
export function formatQuantity(quantity: number, unit?: string): string {
  const formatted = formatNumber(quantity, 'de-CH', 0);
  return unit ? `${formatted} ${unit}` : formatted;
}
