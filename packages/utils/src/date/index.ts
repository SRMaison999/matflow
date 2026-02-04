// =====================================================
// MatFlow - Date Utilities
// =====================================================

import {
  format,
  parseISO,
  isValid,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isWithinInterval,
  areIntervalsOverlapping,
  isBefore,
  isAfter,
  isSameDay,
  formatDistanceToNow,
} from 'date-fns';
import { fr, de, enUS, it } from 'date-fns/locale';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

import type { DateRange } from '@matflow/types';

// ----- Locale Map -----
const locales = {
  fr,
  de,
  en: enUS,
  it,
};

type LocaleKey = keyof typeof locales;

// ----- Parse & Validate -----
export function parseDate(dateString: string): Date | null {
  const date = parseISO(dateString);
  return isValid(date) ? date : null;
}

export function isValidDate(date: Date | string): boolean {
  if (typeof date === 'string') {
    const parsed = parseISO(date);
    return isValid(parsed);
  }
  return isValid(date);
}

// ----- Format -----
export function formatDate(
  date: Date | string,
  formatStr: string = 'dd.MM.yyyy',
  locale: LocaleKey = 'fr'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: locales[locale] });
}

export function formatDateTime(
  date: Date | string,
  locale: LocaleKey = 'fr'
): string {
  return formatDate(date, 'dd.MM.yyyy HH:mm', locale);
}

export function formatTime(date: Date | string): string {
  return formatDate(date, 'HH:mm');
}

export function formatRelative(
  date: Date | string,
  locale: LocaleKey = 'fr'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: locales[locale] });
}

// ----- Timezone -----
export function formatInTimezone(
  date: Date | string,
  timezone: string,
  formatStr: string = 'dd.MM.yyyy HH:mm'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(d, timezone, formatStr);
}

export function toTimezone(date: Date | string, timezone: string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(d, timezone);
}

export function fromTimezone(date: Date, timezone: string): Date {
  return fromZonedTime(date, timezone);
}

// ----- Date Arithmetic -----
export { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths };

// ----- Date Boundaries -----
export { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth };

// ----- Date Comparison -----
export { isBefore, isAfter, isSameDay };

export function isDateInRange(date: Date | string, range: DateRange): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isWithinInterval(d, {
    start: parseISO(range.start),
    end: parseISO(range.end),
  });
}

export function doRangesOverlap(range1: DateRange, range2: DateRange): boolean {
  return areIntervalsOverlapping(
    { start: parseISO(range1.start), end: parseISO(range1.end) },
    { start: parseISO(range2.start), end: parseISO(range2.end) }
  );
}

// ----- Duration -----
export function getDaysBetween(start: Date | string, end: Date | string): number {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(endDate, startDate);
}

export function getHoursBetween(start: Date | string, end: Date | string): number {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  return differenceInHours(endDate, startDate);
}

export function getMinutesBetween(start: Date | string, end: Date | string): number {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  return differenceInMinutes(endDate, startDate);
}

// ----- Rental Days Calculation -----
export function calculateRentalDays(
  start: Date | string,
  end: Date | string,
  minimumDays: number = 1
): number {
  const days = getDaysBetween(start, end);
  return Math.max(days, minimumDays);
}

// ----- ISO String -----
export function toISOString(date: Date): string {
  return date.toISOString();
}

export function nowISO(): string {
  return new Date().toISOString();
}

// ----- Date Range Helpers -----
export function createDateRange(start: Date | string, end: Date | string): DateRange {
  const startDate = typeof start === 'string' ? start : toISOString(start);
  const endDate = typeof end === 'string' ? end : toISOString(end);
  return { start: startDate, end: endDate };
}

export function expandDateRange(range: DateRange, days: number): DateRange {
  const start = parseISO(range.start);
  const end = parseISO(range.end);
  return {
    start: toISOString(subDays(start, days)),
    end: toISOString(addDays(end, days)),
  };
}
