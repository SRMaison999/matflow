// =====================================================
// MatFlow - Enumerations
// =====================================================

// ----- User & Authentication -----
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  VIEWER = 'VIEWER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

// ----- Articles -----
export enum ArticleType {
  SERIALIZED = 'SERIALIZED', // Article avec numéro de série unique
  BATCH = 'BATCH', // Article géré par quantité
  CONSUMABLE = 'CONSUMABLE', // Consommable
}

export enum ArticleStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  IN_USE = 'IN_USE',
  IN_TRANSIT = 'IN_TRANSIT',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  LOST = 'LOST',
  SOLD = 'SOLD',
}

export enum ArticleCondition {
  NEW = 'NEW',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  DAMAGED = 'DAMAGED',
}

// ----- Stock & Locations -----
export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  ZONE = 'ZONE',
  SHELF = 'SHELF',
  BIN = 'BIN',
  CASE = 'CASE',
  VEHICLE = 'VEHICLE',
  PROJECT_SITE = 'PROJECT_SITE',
}

export enum StockMovementType {
  RECEPTION = 'RECEPTION',
  EXPEDITION = 'EXPEDITION',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT_POSITIVE = 'ADJUSTMENT_POSITIVE',
  ADJUSTMENT_NEGATIVE = 'ADJUSTMENT_NEGATIVE',
  RETURN = 'RETURN',
  LOSS = 'LOSS',
  CONSUMPTION = 'CONSUMPTION',
}

// ----- Reservations & Projects -----
export enum ReservationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DISPATCHED = 'DISPATCHED',
  IN_USE = 'IN_USE',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectType {
  RENTAL = 'RENTAL',
  INTERNAL = 'INTERNAL',
  SERVICE = 'SERVICE',
  MAINTENANCE = 'MAINTENANCE',
}

// ----- Kits & Cases -----
export enum KitStatus {
  DRAFT = 'DRAFT',
  ASSEMBLED = 'ASSEMBLED',
  VERIFIED = 'VERIFIED',
  IN_USE = 'IN_USE',
  DISMANTLED = 'DISMANTLED',
}

export enum CaseStatus {
  EMPTY = 'EMPTY',
  PARTIAL = 'PARTIAL',
  COMPLETE = 'COMPLETE',
  SEALED = 'SEALED',
  IN_TRANSIT = 'IN_TRANSIT',
}

// ----- Operations -----
export enum PickingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CANCELLED = 'CANCELLED',
}

export enum ReturnCheckStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DISCREPANCY = 'DISCREPANCY',
}

export enum IncidentType {
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS',
  THEFT = 'THEFT',
  MALFUNCTION = 'MALFUNCTION',
  MISSING_ACCESSORY = 'MISSING_ACCESSORY',
  WRONG_ITEM = 'WRONG_ITEM',
  OTHER = 'OTHER',
}

export enum IncidentStatus {
  REPORTED = 'REPORTED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CHARGED = 'CHARGED',
  CLOSED = 'CLOSED',
}

// ----- Maintenance -----
export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  INSPECTION = 'INSPECTION',
  CALIBRATION = 'CALIBRATION',
  CLEANING = 'CLEANING',
  UPGRADE = 'UPGRADE',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_PARTS = 'WAITING_PARTS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ----- Billing -----
export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  CHECK = 'CHECK',
  PAYPAL = 'PAYPAL',
  OTHER = 'OTHER',
}

export enum PricingType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  FLAT = 'FLAT',
  DEGRESSIVE = 'DEGRESSIVE',
  CUSTOM = 'CUSTOM',
}

// ----- Documents -----
export enum DocumentType {
  CONTRACT = 'CONTRACT',
  RIDER = 'RIDER',
  TECHNICAL_SHEET = 'TECHNICAL_SHEET',
  PLAN = 'PLAN',
  PHOTO = 'PHOTO',
  INVOICE = 'INVOICE',
  QUOTE = 'QUOTE',
  DELIVERY_NOTE = 'DELIVERY_NOTE',
  RETURN_NOTE = 'RETURN_NOTE',
  INSURANCE_CERT = 'INSURANCE_CERT',
  OTHER = 'OTHER',
}

export enum DocumentAccessLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL',
}

// ----- Notifications -----
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

export enum NotificationCategory {
  RESERVATION = 'RESERVATION',
  PROJECT = 'PROJECT',
  STOCK = 'STOCK',
  MAINTENANCE = 'MAINTENANCE',
  BILLING = 'BILLING',
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

// ----- Multi-Branch -----
export enum BranchType {
  HEADQUARTERS = 'HEADQUARTERS',
  BRANCH = 'BRANCH',
  WAREHOUSE = 'WAREHOUSE',
  PARTNER = 'PARTNER',
}

export enum TransferStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

// ----- Import -----
export enum ImportStatus {
  PENDING = 'PENDING',
  VALIDATING = 'VALIDATING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

// ----- Audit -----
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

// ----- Language -----
export enum Language {
  FR = 'fr',
  DE = 'de',
  EN = 'en',
  IT = 'it',
}

// ----- Currency -----
export enum Currency {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}
