// =====================================================
// MatFlow - Document & Import Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  FileInfo,
} from '../common';
import type {
  DocumentType,
  DocumentAccessLevel,
  ImportStatus,
} from '../enums';

// ----- Document -----
export interface Document extends BaseEntity {
  // File info
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;

  // Metadata
  type: DocumentType;
  title: string;
  description?: string;
  accessLevel: DocumentAccessLevel;

  // References
  entityType?: 'article' | 'project' | 'reservation' | 'client' | 'maintenance' | 'incident';
  entityId?: UUID;
  branchId: UUID;

  // Versioning
  version: number;
  previousVersionId?: UUID;
  isLatestVersion: boolean;

  // Tags
  tags: string[];

  // Offline
  availableOffline: boolean;
  offlineSyncedAt?: ISODateString;

  // Expiry
  expiresAt?: ISODateString;

  // Access
  viewCount: number;
  lastViewedAt?: ISODateString;
  lastViewedBy?: UUID;

  metadata?: Record<string, unknown>;
}

export interface CreateDocumentInput {
  file: File | Blob;
  type: DocumentType;
  title: string;
  description?: string;
  accessLevel?: DocumentAccessLevel;
  entityType?: string;
  entityId?: UUID;
  branchId: UUID;
  tags?: string[];
  availableOffline?: boolean;
  expiresAt?: ISODateString;
}

export interface UpdateDocumentInput {
  type?: DocumentType;
  title?: string;
  description?: string;
  accessLevel?: DocumentAccessLevel;
  tags?: string[];
  availableOffline?: boolean;
  expiresAt?: ISODateString;
}

// ----- Import Job -----
export interface ImportJob extends BaseEntity {
  type: 'articles' | 'clients' | 'categories' | 'locations' | 'users';
  status: ImportStatus;
  branchId: UUID;

  // File
  fileId: UUID;
  filename: string;
  fileSize: number;

  // Configuration
  mapping: ImportMapping;
  options: ImportOptions;

  // Progress
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  progress: number; // Percentage

  // Results
  errors: ImportError[];
  warnings: ImportWarning[];

  // Timing
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  duration?: number; // Milliseconds

  // Rollback
  canRollback: boolean;
  rolledBackAt?: ISODateString;
  rolledBackBy?: UUID;

  // Created records
  createdIds: UUID[];
  updatedIds: UUID[];

  metadata?: Record<string, unknown>;
}

export interface ImportMapping {
  columns: Array<{
    sourceColumn: string;
    targetField: string;
    transform?: string;
    defaultValue?: unknown;
  }>;
  skipFirstRow: boolean;
  delimiter?: string;
  encoding?: string;
}

export interface ImportOptions {
  updateExisting: boolean;
  skipErrors: boolean;
  dryRun: boolean;
  notifyOnComplete: boolean;
  validateOnly: boolean;
}

export interface ImportError {
  row: number;
  column?: string;
  value?: string;
  code: string;
  message: string;
}

export interface ImportWarning {
  row: number;
  column?: string;
  code: string;
  message: string;
}

export interface CreateImportJobInput {
  type: 'articles' | 'clients' | 'categories' | 'locations' | 'users';
  fileId: UUID;
  branchId: UUID;
  mapping: ImportMapping;
  options?: Partial<ImportOptions>;
}

// ----- Export Job -----
export interface ExportJob extends BaseEntity {
  type: 'articles' | 'reservations' | 'projects' | 'invoices' | 'reports';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  branchId?: UUID;

  // Configuration
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  filters?: Record<string, unknown>;
  columns?: string[];
  includeRelated?: boolean;

  // Result
  fileUrl?: string;
  fileSize?: number;
  rowCount?: number;

  // Timing
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  expiresAt?: ISODateString;

  error?: string;

  metadata?: Record<string, unknown>;
}

export interface CreateExportJobInput {
  type: 'articles' | 'reservations' | 'projects' | 'invoices' | 'reports';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  branchId?: UUID;
  filters?: Record<string, unknown>;
  columns?: string[];
  includeRelated?: boolean;
}

// ----- Audit Log -----
export interface AuditLog extends BaseEntity {
  action: string;
  entityType: string;
  entityId: UUID;
  userId: UUID;
  userName: string;
  branchId?: UUID;

  // Changes
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    diff?: Array<{
      field: string;
      oldValue: unknown;
      newValue: unknown;
    }>;
  };

  // Context
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;

  // Request
  requestId?: string;
  requestMethod?: string;
  requestPath?: string;

  timestamp: ISODateString;

  metadata?: Record<string, unknown>;
}

export interface AuditLogQuery {
  entityType?: string;
  entityId?: UUID;
  userId?: UUID;
  branchId?: UUID;
  action?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
}

// ----- RGPD/Data Privacy -----
export interface DataExportRequest extends BaseEntity {
  userId: UUID;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: ISODateString;
  completedAt?: ISODateString;
  downloadUrl?: string;
  downloadExpiresAt?: ISODateString;
  format: 'json' | 'csv';
  includeTypes: string[];
}

export interface DataDeletionRequest extends BaseEntity {
  userId: UUID;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  requestedAt: ISODateString;
  reason?: string;
  approvedBy?: UUID;
  approvedAt?: ISODateString;
  completedAt?: ISODateString;
  rejectedBy?: UUID;
  rejectedAt?: ISODateString;
  rejectionReason?: string;
  deletedDataTypes: string[];
  retainedDataTypes: string[];
  retentionReason?: string;
}
