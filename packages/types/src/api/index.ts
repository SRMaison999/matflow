// =====================================================
// MatFlow - API Types
// =====================================================

import type {
  UUID,
  ISODateString,
  PaginationParams,
  PaginatedResult,
  SortParams,
  FilterCondition,
  ValidationError,
} from '../common';

// ----- API Response Wrapper -----
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
  stack?: string; // Only in development
}

export interface ApiMeta {
  requestId: string;
  timestamp: ISODateString;
  version: string;
  processingTime?: number; // Milliseconds
}

// ----- Pagination -----
export interface ApiPaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ----- List Query Parameters -----
export interface ListQueryParams extends PaginationParams {
  sort?: string; // field:asc or field:desc
  filter?: string; // JSON encoded filters
  search?: string;
  include?: string; // Comma-separated relations
  fields?: string; // Comma-separated fields to include
}

// ----- Batch Operations -----
export interface BatchRequest<T> {
  operations: Array<{
    method: 'create' | 'update' | 'delete';
    id?: UUID;
    data?: T;
  }>;
  options?: {
    stopOnError?: boolean;
    transaction?: boolean;
  };
}

export interface BatchResponse<T> {
  results: Array<{
    success: boolean;
    index: number;
    method: string;
    id?: UUID;
    data?: T;
    error?: ApiError;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

// ----- Auth Endpoints -----
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface LoginResponse {
  user: {
    id: UUID;
    email: string;
    displayName: string;
    role: string;
    branchId: UUID;
    permissions: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ----- Availability Check -----
export interface AvailabilityCheckRequest {
  articleIds: UUID[];
  startDate: ISODateString;
  endDate: ISODateString;
  branchId: UUID;
  excludeReservationId?: UUID;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  items: Array<{
    articleId: UUID;
    available: boolean;
    requestedQuantity: number;
    availableQuantity: number;
    conflicts: Array<{
      reservationId: UUID;
      projectName: string;
      startDate: ISODateString;
      endDate: ISODateString;
      quantity: number;
    }>;
  }>;
}

// ----- Search -----
export interface GlobalSearchRequest {
  query: string;
  types?: Array<'articles' | 'projects' | 'reservations' | 'clients' | 'kits'>;
  branchId?: UUID;
  limit?: number;
}

export interface GlobalSearchResponse {
  results: Array<{
    type: string;
    id: UUID;
    title: string;
    subtitle?: string;
    url: string;
    score: number;
    highlight?: string;
  }>;
  total: number;
  took: number;
}

// ----- Dashboard -----
export interface DashboardStatsRequest {
  branchId?: UUID;
  period?: 'today' | 'week' | 'month' | 'year';
}

export interface DashboardStatsResponse {
  articles: {
    total: number;
    available: number;
    reserved: number;
    inUse: number;
    inMaintenance: number;
  };
  reservations: {
    activeCount: number;
    preparingCount: number;
    returningCount: number;
    overdueCount: number;
  };
  projects: {
    activeCount: number;
    completedThisPeriod: number;
    revenue: number;
  };
  alerts: {
    lowStock: number;
    maintenanceDue: number;
    overdueReturns: number;
    overdueInvoices: number;
  };
  recentActivity: Array<{
    id: UUID;
    type: string;
    message: string;
    timestamp: ISODateString;
    userId: UUID;
    userName: string;
  }>;
}

// ----- Webhook -----
export interface WebhookPayload<T = unknown> {
  id: UUID;
  event: string;
  timestamp: ISODateString;
  data: T;
  signature: string;
}

export interface WebhookRegistration {
  id: UUID;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: ISODateString;
  lastDeliveryAt?: ISODateString;
  lastDeliveryStatus?: 'success' | 'failed';
}

export interface CreateWebhookRequest {
  url: string;
  events: string[];
}

// ----- File Upload -----
export interface FileUploadRequest {
  file: File;
  type?: string;
  entityType?: string;
  entityId?: UUID;
}

export interface FileUploadResponse {
  id: UUID;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

// ----- Scan -----
export interface ScanRequest {
  code: string;
  type: 'qr' | 'barcode' | 'nfc';
  action?: 'pick' | 'return' | 'verify' | 'move' | 'info';
  operationId?: UUID;
  locationId?: UUID;
}

export interface ScanResponse {
  success: boolean;
  entityType: 'article' | 'case' | 'kit' | 'location';
  entity: {
    id: UUID;
    code: string;
    name: string;
    status: string;
    [key: string]: unknown;
  };
  actions: Array<{
    action: string;
    label: string;
    available: boolean;
    reason?: string;
  }>;
}

// ----- Report -----
export interface ReportRequest {
  type: string;
  branchId?: UUID;
  startDate?: ISODateString;
  endDate?: ISODateString;
  filters?: Record<string, unknown>;
  format?: 'json' | 'csv' | 'pdf' | 'xlsx';
}

export interface ReportResponse<T = unknown> {
  type: string;
  generatedAt: ISODateString;
  period?: {
    start: ISODateString;
    end: ISODateString;
  };
  data: T;
  downloadUrl?: string;
}

// ----- Calendar -----
export interface CalendarEventsRequest {
  startDate: ISODateString;
  endDate: ISODateString;
  branchId?: UUID;
  types?: Array<'reservation' | 'project' | 'maintenance'>;
}

export interface CalendarEvent {
  id: UUID;
  type: 'reservation' | 'project' | 'maintenance';
  title: string;
  start: ISODateString;
  end: ISODateString;
  allDay: boolean;
  color?: string;
  resourceId?: UUID;
  data: Record<string, unknown>;
}

// ----- Integration -----
export interface IntegrationStatus {
  name: string;
  isConnected: boolean;
  connectedAt?: ISODateString;
  lastSyncAt?: ISODateString;
  lastError?: string;
  settings?: Record<string, unknown>;
}

export interface IntegrationConnectRequest {
  integration: string;
  credentials?: Record<string, string>;
  settings?: Record<string, unknown>;
}
