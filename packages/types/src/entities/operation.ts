// =====================================================
// MatFlow - Operation Entity Types (Picking, Return, etc.)
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  FileInfo,
} from '../common';
import type {
  PickingStatus,
  ReturnCheckStatus,
  IncidentType,
  IncidentStatus,
  ArticleCondition,
} from '../enums';

// ----- Picking List -----
export interface PickingList extends BaseEntity {
  code: string;
  reservationId: UUID;
  reservationCode: string;
  projectId: UUID;
  projectName: string;
  branchId: UUID;
  status: PickingStatus;

  // Dates
  dueDate: ISODateString;
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  verifiedAt?: ISODateString;

  // Assignment
  assignedTo?: UUID;
  assignedToName?: string;
  verifiedBy?: UUID;

  // Items
  items: PickingItem[];
  totalItems: number;
  pickedItems: number;

  // Priority
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Notes
  notes?: string;
  pickingNotes?: string;

  metadata?: Record<string, unknown>;
}

export interface PickingItem {
  id: UUID;
  pickingListId: UUID;
  reservationItemId: UUID;
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;
  locationId?: UUID;
  locationPath?: string;
  caseId?: UUID;
  caseName?: string;

  // Quantities
  requestedQuantity: number;
  pickedQuantity: number;

  // Status
  status: 'pending' | 'partial' | 'picked' | 'not_found' | 'substituted';
  condition?: ArticleCondition;

  // Substitution
  isSubstitute: boolean;
  originalArticleId?: UUID;
  substituteReason?: string;

  // Scanning
  scannedAt?: ISODateString;
  scannedBy?: UUID;
  scanCode?: string;

  notes?: string;
  sortOrder: number;
}

export interface CreatePickingListInput {
  reservationId: UUID;
  dueDate?: ISODateString;
  assignedTo?: UUID;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
}

export interface PickItemInput {
  pickingItemId: UUID;
  quantity: number;
  instanceId?: UUID;
  serialNumber?: string;
  condition?: ArticleCondition;
  caseId?: UUID;
  isSubstitute?: boolean;
  substituteArticleId?: UUID;
  substituteReason?: string;
  scanCode?: string;
  notes?: string;
}

// ----- Return Check -----
export interface ReturnCheck extends BaseEntity {
  code: string;
  reservationId: UUID;
  reservationCode: string;
  projectId: UUID;
  projectName: string;
  branchId: UUID;
  status: ReturnCheckStatus;

  // Dates
  expectedDate: ISODateString;
  actualDate?: ISODateString;
  startedAt?: ISODateString;
  completedAt?: ISODateString;

  // Assignment
  checkedBy?: UUID;
  checkedByName?: string;
  validatedBy?: UUID;

  // Items
  items: ReturnCheckItem[];
  totalItems: number;
  returnedItems: number;
  discrepancyItems: number;

  // Incidents
  incidents: Incident[];
  incidentCount: number;

  // Location
  returnLocationId?: UUID;

  // Notes
  notes?: string;

  metadata?: Record<string, unknown>;
}

export interface ReturnCheckItem {
  id: UUID;
  returnCheckId: UUID;
  reservationItemId: UUID;
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;

  // Quantities
  expectedQuantity: number;
  returnedQuantity: number;
  missingQuantity: number;
  damagedQuantity: number;

  // Condition
  conditionOut: ArticleCondition;
  conditionIn?: ArticleCondition;
  conditionNotes?: string;

  // Status
  status: 'pending' | 'returned' | 'partial' | 'missing' | 'damaged';
  hasDiscrepancy: boolean;

  // Location
  returnedToLocationId?: UUID;
  returnedToCaseId?: UUID;

  // Scanning
  scannedAt?: ISODateString;
  scannedBy?: UUID;

  // Photos
  photos: FileInfo[];

  // Linked incident
  incidentId?: UUID;

  notes?: string;
}

export interface CreateReturnCheckInput {
  reservationId: UUID;
  expectedDate?: ISODateString;
  returnLocationId?: UUID;
  notes?: string;
}

export interface ReturnItemInput {
  returnCheckItemId: UUID;
  quantity: number;
  condition: ArticleCondition;
  conditionNotes?: string;
  returnedToLocationId?: UUID;
  returnedToCaseId?: UUID;
  photos?: UUID[];
  scanCode?: string;
  notes?: string;
}

// ----- Incident -----
export interface Incident extends BaseEntity {
  code: string;
  type: IncidentType;
  status: IncidentStatus;

  // References
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;
  reservationId?: UUID;
  projectId?: UUID;
  returnCheckId?: UUID;

  // Details
  title: string;
  description: string;
  quantity: number;
  severity: 'low' | 'medium' | 'high' | 'critical';

  // Financial
  estimatedCost?: number;
  actualCost?: number;
  chargedToClient: boolean;
  chargedAmount?: number;
  insuranceClaimed: boolean;
  insuranceClaimId?: string;

  // Resolution
  resolution?: string;
  resolvedAt?: ISODateString;
  resolvedBy?: UUID;

  // Assignment
  assignedTo?: UUID;
  branchId: UUID;

  // Evidence
  photos: FileInfo[];
  documents: FileInfo[];

  // Audit
  reportedBy: UUID;
  reportedAt: ISODateString;

  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateIncidentInput {
  type: IncidentType;
  articleId: UUID;
  instanceId?: UUID;
  reservationId?: UUID;
  projectId?: UUID;
  returnCheckId?: UUID;
  title: string;
  description: string;
  quantity?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
  branchId: UUID;
  assignedTo?: UUID;
  photos?: UUID[];
  notes?: string;
}

export interface UpdateIncidentInput {
  type?: IncidentType;
  status?: IncidentStatus;
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
  actualCost?: number;
  chargedToClient?: boolean;
  chargedAmount?: number;
  insuranceClaimed?: boolean;
  insuranceClaimId?: string;
  resolution?: string;
  assignedTo?: UUID;
  photos?: UUID[];
  documents?: UUID[];
  notes?: string;
}

// ----- Scan Log -----
export interface ScanLog extends BaseEntity {
  scanCode: string;
  scanType: 'qr' | 'barcode' | 'nfc';
  entityType: 'article' | 'case' | 'kit' | 'location';
  entityId: UUID;
  action: 'pick' | 'return' | 'verify' | 'move' | 'count' | 'info';

  // Context
  operationType?: 'picking' | 'return_check' | 'inventory' | 'transfer';
  operationId?: UUID;
  reservationId?: UUID;
  projectId?: UUID;

  // Result
  success: boolean;
  errorCode?: string;
  errorMessage?: string;

  // Device
  deviceId?: string;
  deviceType?: string;

  // User & Location
  scannedBy: UUID;
  branchId: UUID;
  locationId?: UUID;

  // Geolocation
  latitude?: number;
  longitude?: number;

  timestamp: ISODateString;
}
