// =====================================================
// MatFlow - Common Types
// =====================================================

import type { Language, Currency } from '../enums';

// ----- Base Types -----
export type UUID = string;
export type ISODateString = string;
export type Timestamp = number;

// ----- Pagination -----
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: {
    cursor: string | null;
    hasMore: boolean;
  };
}

// ----- Sorting -----
export type SortOrder = 'asc' | 'desc';

export interface SortParams<T extends string = string> {
  field: T;
  order: SortOrder;
}

// ----- Filtering -----
export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'between'
  | 'isNull'
  | 'isNotNull';

export interface FilterCondition<T = unknown> {
  field: string;
  operator: FilterOperator;
  value: T;
}

// ----- Date Range -----
export interface DateRange {
  start: ISODateString;
  end: ISODateString;
}

// ----- Address -----
export interface Address {
  street: string;
  streetLine2?: string;
  city: string;
  postalCode: string;
  state?: string;
  country: string;
  countryCode: string;
}

// ----- Contact -----
export interface ContactInfo {
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
}

// ----- Dimensions -----
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'mm' | 'cm' | 'm';
}

export interface Weight {
  value: number;
  unit: 'g' | 'kg';
}

// ----- Money -----
export interface Money {
  amount: number;
  currency: Currency;
}

// ----- Localization -----
export interface LocalizedString {
  [key: string]: string;
  fr: string;
  de?: string;
  en?: string;
  it?: string;
}

export interface LocalizationContext {
  language: Language;
  currency: Currency;
  timezone: string;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
  };
}

// ----- File -----
export interface FileInfo {
  id: UUID;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: ISODateString;
  uploadedBy: UUID;
}

// ----- Audit Fields -----
export interface AuditFields {
  createdAt: ISODateString;
  createdBy: UUID;
  updatedAt: ISODateString;
  updatedBy: UUID;
}

export interface SoftDeleteFields {
  deletedAt?: ISODateString | null;
  deletedBy?: UUID | null;
}

// ----- Base Entity -----
export interface BaseEntity extends AuditFields {
  id: UUID;
}

export interface SoftDeletableEntity extends BaseEntity, SoftDeleteFields {}

// ----- Result Types -----
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}

// ----- Events -----
export interface DomainEvent<T = unknown> {
  id: UUID;
  type: string;
  aggregateId: UUID;
  aggregateType: string;
  payload: T;
  occurredAt: ISODateString;
  userId?: UUID;
  metadata?: Record<string, unknown>;
}

// ----- Search -----
export interface SearchParams {
  query: string;
  fields?: string[];
  filters?: FilterCondition[];
  pagination?: PaginationParams;
  sort?: SortParams[];
}

export interface SearchResult<T> extends PaginatedResult<T> {
  query: string;
  took: number; // milliseconds
  highlights?: Record<string, string[]>;
}

// ----- Permissions -----
export type Permission = string;

export interface PermissionSet {
  module: string;
  permissions: Permission[];
}

// ----- Configuration -----
export type ConfigValue = string | number | boolean | null | ConfigValue[] | { [key: string]: ConfigValue };

export interface ConfigEntry {
  key: string;
  value: ConfigValue;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic: boolean;
}
