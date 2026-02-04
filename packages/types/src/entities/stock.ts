// =====================================================
// MatFlow - Stock & Location Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  Address,
  Dimensions,
} from '../common';
import type {
  LocationType,
  StockMovementType,
  ArticleStatus,
  CaseStatus,
} from '../enums';

// ----- Location -----
export interface Location extends BaseEntity {
  code: string;
  name: string;
  type: LocationType;
  branchId: UUID;
  parentId?: UUID;
  path: string; // Materialized path
  depth: number;
  description?: string;
  address?: Address;
  capacity?: number;
  currentOccupancy?: number;
  dimensions?: Dimensions;
  isActive: boolean;
  sortOrder: number;
  barcode?: string;
  qrCode?: string;
  children?: Location[];
  metadata?: Record<string, unknown>;
}

export interface CreateLocationInput {
  code?: string;
  name: string;
  type: LocationType;
  branchId: UUID;
  parentId?: UUID;
  description?: string;
  address?: Address;
  capacity?: number;
  dimensions?: Dimensions;
  barcode?: string;
}

export interface UpdateLocationInput {
  code?: string;
  name?: string;
  type?: LocationType;
  parentId?: UUID;
  description?: string;
  address?: Address;
  capacity?: number;
  dimensions?: Dimensions;
  barcode?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// ----- Stock Entry -----
export interface StockEntry extends BaseEntity {
  articleId: UUID;
  instanceId?: UUID;
  locationId: UUID;
  branchId: UUID;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  lastCountDate?: ISODateString;
  lastCountQuantity?: number;
  notes?: string;
}

// ----- Stock Movement -----
export interface StockMovement extends BaseEntity {
  type: StockMovementType;
  articleId: UUID;
  instanceId?: UUID;
  quantity: number;

  // Source
  fromLocationId?: UUID;
  fromBranchId?: UUID;
  fromCaseId?: UUID;

  // Destination
  toLocationId?: UUID;
  toBranchId?: UUID;
  toCaseId?: UUID;

  // Reference
  referenceType?: 'reservation' | 'project' | 'transfer' | 'maintenance' | 'adjustment';
  referenceId?: UUID;

  // Details
  reason?: string;
  notes?: string;
  previousStatus?: ArticleStatus;
  newStatus?: ArticleStatus;
  previousQuantity?: number;
  newQuantity?: number;

  // Validation
  performedBy: UUID;
  performedAt: ISODateString;
  validatedBy?: UUID;
  validatedAt?: ISODateString;
}

export interface CreateStockMovementInput {
  type: StockMovementType;
  articleId: UUID;
  instanceId?: UUID;
  quantity: number;
  fromLocationId?: UUID;
  toLocationId?: UUID;
  referenceType?: string;
  referenceId?: UUID;
  reason?: string;
  notes?: string;
}

// ----- Case (Caisse/Flight Case) -----
export interface Case extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  branchId: UUID;
  locationId?: UUID;
  status: CaseStatus;
  dimensions?: Dimensions;
  weight?: number;
  maxWeight?: number;
  barcode?: string;
  qrCode?: string;
  color?: string;
  isReusable: boolean;

  // Content
  expectedContent: CaseContentItem[];
  actualContent: CaseContentItem[];

  // Tracking
  currentProjectId?: UUID;
  currentReservationId?: UUID;
  lastVerifiedAt?: ISODateString;
  lastVerifiedBy?: UUID;

  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CaseContentItem {
  articleId: UUID;
  articleCode: string;
  articleName: string;
  expectedQuantity: number;
  actualQuantity?: number;
  isVerified: boolean;
  verifiedAt?: ISODateString;
  verifiedBy?: UUID;
  notes?: string;
}

export interface CreateCaseInput {
  code?: string;
  name: string;
  description?: string;
  branchId: UUID;
  locationId?: UUID;
  dimensions?: Dimensions;
  weight?: number;
  maxWeight?: number;
  barcode?: string;
  color?: string;
  isReusable?: boolean;
  expectedContent?: Array<{ articleId: UUID; quantity: number }>;
}

export interface UpdateCaseInput {
  code?: string;
  name?: string;
  description?: string;
  locationId?: UUID;
  status?: CaseStatus;
  dimensions?: Dimensions;
  weight?: number;
  maxWeight?: number;
  barcode?: string;
  color?: string;
  isReusable?: boolean;
  expectedContent?: Array<{ articleId: UUID; quantity: number }>;
  notes?: string;
}

// ----- Inventory Count -----
export interface InventoryCount extends BaseEntity {
  name: string;
  description?: string;
  branchId: UUID;
  locationId?: UUID;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  items: InventoryCountItem[];
  discrepancyCount: number;
  totalItemsCounted: number;
  performedBy?: UUID;
  validatedBy?: UUID;
  notes?: string;
}

export interface InventoryCountItem {
  id: UUID;
  articleId: UUID;
  instanceId?: UUID;
  expectedQuantity: number;
  countedQuantity?: number;
  discrepancy?: number;
  status: 'pending' | 'counted' | 'verified';
  countedBy?: UUID;
  countedAt?: ISODateString;
  notes?: string;
}

export interface CreateInventoryCountInput {
  name: string;
  description?: string;
  branchId: UUID;
  locationId?: UUID;
  articleIds?: UUID[];
  includeAllArticles?: boolean;
}

// ----- Stock Alert -----
export interface StockAlert extends BaseEntity {
  type: 'low_stock' | 'overstock' | 'expiring' | 'maintenance_due';
  articleId: UUID;
  branchId: UUID;
  locationId?: UUID;
  threshold: number;
  currentValue: number;
  message: string;
  isAcknowledged: boolean;
  acknowledgedBy?: UUID;
  acknowledgedAt?: ISODateString;
}

// ----- Stock Summary -----
export interface StockSummary {
  branchId: UUID;
  totalArticles: number;
  totalValue: number;
  totalItems: number;
  availableItems: number;
  reservedItems: number;
  inUseItems: number;
  inMaintenanceItems: number;
  lowStockAlerts: number;
  categoryBreakdown: Array<{
    categoryId: UUID;
    categoryName: string;
    count: number;
    value: number;
  }>;
  statusBreakdown: Array<{
    status: ArticleStatus;
    count: number;
  }>;
}
