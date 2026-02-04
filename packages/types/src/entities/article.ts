// =====================================================
// MatFlow - Article Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  SoftDeletableEntity,
  Money,
  Dimensions,
  Weight,
  FileInfo,
  LocalizedString,
} from '../common';
import type {
  ArticleType,
  ArticleStatus,
  ArticleCondition,
  Currency,
} from '../enums';

// ----- Category -----
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: UUID;
  path: string; // Materialized path: "root/parent/current"
  depth: number;
  sortOrder: number;
  icon?: string;
  color?: string;
  isActive: boolean;
  articleCount: number;
  children?: Category[];
  customAttributes: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: UUID;
  name: string;
  key: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect';
  options?: string[];
  unit?: string;
  isRequired: boolean;
  isFilterable: boolean;
  isSearchable: boolean;
  sortOrder: number;
}

// ----- Article -----
export interface Article extends SoftDeletableEntity {
  // Identification
  code: string; // Internal reference code
  barcode?: string;
  serialNumber?: string;
  name: string;
  nameLocalized?: LocalizedString;
  description?: string;
  descriptionLocalized?: LocalizedString;

  // Classification
  type: ArticleType;
  categoryId: UUID;
  category?: Category;
  tags: string[];
  brand?: string;
  model?: string;
  manufacturer?: string;

  // Status & Condition
  status: ArticleStatus;
  condition: ArticleCondition;
  conditionNotes?: string;
  isActive: boolean;

  // Physical properties
  dimensions?: Dimensions;
  weight?: Weight;
  color?: string;

  // Financial
  purchasePrice?: Money;
  purchaseDate?: ISODateString;
  currentValue?: Money;
  replacementValue?: Money;
  insuranceValue?: Money;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  depreciationRate?: number; // Percentage per year

  // Stock
  branchId: UUID;
  locationId?: UUID;
  caseId?: UUID;
  kitId?: UUID;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;

  // For BATCH type articles
  quantity?: number;
  unit?: string;
  lotNumber?: string;

  // Maintenance
  lastMaintenanceDate?: ISODateString;
  nextMaintenanceDate?: ISODateString;
  maintenanceIntervalDays?: number;
  totalUsageHours?: number;
  warrantyExpiresAt?: ISODateString;

  // Documents & Media
  images: FileInfo[];
  primaryImageId?: UUID;
  documents: FileInfo[];
  technicalSpecsUrl?: string;
  manualUrl?: string;

  // Custom attributes (from category)
  customAttributes: Record<string, unknown>;

  // QR Code
  qrCode?: string;
  qrCodeUrl?: string;

  // Tracking
  acquisitionSource?: string;
  disposalDate?: ISODateString;
  disposalReason?: string;
  disposalNotes?: string;

  // Statistics (computed)
  reservationCount?: number;
  lastReservationDate?: ISODateString;
  totalRentalDays?: number;
  totalRevenue?: Money;
  utilizationRate?: number; // Percentage
}

// ----- Article Instance (for serialized articles) -----
export interface ArticleInstance extends BaseEntity {
  articleId: UUID;
  serialNumber: string;
  status: ArticleStatus;
  condition: ArticleCondition;
  conditionNotes?: string;
  locationId?: UUID;
  caseId?: UUID;
  kitId?: UUID;
  purchaseDate?: ISODateString;
  purchasePrice?: Money;
  warrantyExpiresAt?: ISODateString;
  lastMaintenanceDate?: ISODateString;
  nextMaintenanceDate?: ISODateString;
  notes?: string;
  customAttributes: Record<string, unknown>;
}

// ----- Article Creation & Update -----
export interface CreateArticleInput {
  code?: string; // Auto-generated if not provided
  barcode?: string;
  serialNumber?: string;
  name: string;
  description?: string;
  type: ArticleType;
  categoryId: UUID;
  tags?: string[];
  brand?: string;
  model?: string;
  manufacturer?: string;
  condition?: ArticleCondition;
  dimensions?: Dimensions;
  weight?: Weight;
  color?: string;
  purchasePrice?: Money;
  purchaseDate?: ISODateString;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  branchId: UUID;
  locationId?: UUID;
  quantity?: number;
  unit?: string;
  minStock?: number;
  warrantyExpiresAt?: ISODateString;
  maintenanceIntervalDays?: number;
  customAttributes?: Record<string, unknown>;
}

export interface UpdateArticleInput {
  code?: string;
  barcode?: string;
  serialNumber?: string;
  name?: string;
  description?: string;
  categoryId?: UUID;
  tags?: string[];
  brand?: string;
  model?: string;
  manufacturer?: string;
  status?: ArticleStatus;
  condition?: ArticleCondition;
  conditionNotes?: string;
  dimensions?: Dimensions;
  weight?: Weight;
  color?: string;
  purchasePrice?: Money;
  currentValue?: Money;
  replacementValue?: Money;
  insuranceValue?: Money;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  locationId?: UUID;
  minStock?: number;
  maxStock?: number;
  warrantyExpiresAt?: ISODateString;
  maintenanceIntervalDays?: number;
  customAttributes?: Record<string, unknown>;
  isActive?: boolean;
}

// ----- Article Summary -----
export interface ArticleSummary {
  id: UUID;
  code: string;
  name: string;
  type: ArticleType;
  status: ArticleStatus;
  condition: ArticleCondition;
  categoryId: UUID;
  categoryName: string;
  branchId: UUID;
  primaryImageUrl?: string;
  rentalPriceDaily?: Money;
  quantity?: number;
  availableQuantity?: number;
}

// ----- Article Availability -----
export interface ArticleAvailability {
  articleId: UUID;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  inUseQuantity: number;
  inMaintenanceQuantity: number;
  reservations: ArticleReservationPeriod[];
}

export interface ArticleReservationPeriod {
  reservationId: UUID;
  projectId?: UUID;
  projectName?: string;
  startDate: ISODateString;
  endDate: ISODateString;
  quantity: number;
}

// ----- Bulk Operations -----
export interface BulkArticleUpdate {
  articleIds: UUID[];
  updates: Partial<UpdateArticleInput>;
}

export interface BulkArticleMove {
  articleIds: UUID[];
  targetLocationId: UUID;
  targetBranchId?: UUID;
}
