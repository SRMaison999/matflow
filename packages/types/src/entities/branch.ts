// =====================================================
// MatFlow - Branch & Organization Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  SoftDeletableEntity,
  Address,
  ContactInfo,
  FileInfo,
  Money,
  LocalizedString,
} from '../common';
import type {
  BranchType,
  TransferStatus,
  Currency,
  Language,
} from '../enums';

// ----- Organization -----
export interface Organization extends SoftDeletableEntity {
  code: string;
  name: string;
  legalName?: string;
  description?: string;
  logo?: FileInfo;
  favicon?: FileInfo;

  // Legal
  vatNumber?: string;
  registrationNumber?: string;
  legalForm?: string;

  // Address
  address: Address;
  contact: ContactInfo;

  // Settings
  defaultCurrency: Currency;
  defaultLanguage: Language;
  timezone: string;
  fiscalYearStart: { month: number; day: number };

  // Features
  enabledModules: string[];
  settings: OrganizationSettings;

  // Subscription
  subscriptionPlan?: string;
  subscriptionExpiresAt?: ISODateString;
  maxUsers?: number;
  maxBranches?: number;
  maxArticles?: number;

  // Stats
  branchCount: number;
  userCount: number;
  articleCount: number;

  metadata?: Record<string, unknown>;
}

export interface OrganizationSettings {
  // Nomenclature
  articleCodePattern: string;
  reservationCodePattern: string;
  projectCodePattern: string;
  invoiceCodePattern: string;
  quoteCodePattern: string;
  autoGenerateCodes: boolean;

  // Business
  defaultPaymentTermsDays: number;
  defaultTaxRate: number;
  defaultPricingType: string;

  // Operations
  allowNegativeStock: boolean;
  requireReturnVerification: boolean;
  requirePickingVerification: boolean;
  allowPartialReturns: boolean;

  // Notifications
  notificationDefaults: {
    lowStockThreshold: number;
    maintenanceReminderDays: number;
    reservationReminderDays: number;
    invoiceReminderDays: number;
  };

  // Integrations
  enabledIntegrations: string[];

  // RGPD/LPD
  dataRetentionYears: number;
  requireConsentForMarketing: boolean;
}

// ----- Branch -----
export interface Branch extends SoftDeletableEntity {
  code: string;
  name: string;
  nameLocalized?: LocalizedString;
  description?: string;
  type: BranchType;
  organizationId: UUID;

  // Parent (for hierarchical branches)
  parentBranchId?: UUID;

  // Address
  address: Address;
  contact: ContactInfo;

  // Settings
  currency: Currency;
  language: Language;
  timezone: string;

  // Managers
  managerIds: UUID[];

  // Status
  isActive: boolean;
  isHeadquarters: boolean;

  // Stock
  hasLocalStock: boolean;
  canAccessCentralStock: boolean;
  canTransferTo: UUID[];
  canTransferFrom: UUID[];

  // Billing
  separateBilling: boolean;
  internalBillingRate?: number;
  bankDetails?: BankDetails;

  // Working hours
  workingHours?: WorkingHours;

  // Stats
  userCount: number;
  articleCount: number;
  activeProjectCount: number;

  metadata?: Record<string, unknown>;
}

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  iban: string;
  bic?: string;
  reference?: string;
}

export interface WorkingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  holidays: Array<{
    date: ISODateString;
    name: string;
    closed: boolean;
  }>;
}

export interface DayHours {
  isOpen: boolean;
  openTime?: string; // HH:mm
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface CreateBranchInput {
  code?: string;
  name: string;
  description?: string;
  type: BranchType;
  parentBranchId?: UUID;
  address: Address;
  contact: ContactInfo;
  currency?: Currency;
  language?: Language;
  timezone?: string;
  managerIds?: UUID[];
  hasLocalStock?: boolean;
  canAccessCentralStock?: boolean;
  separateBilling?: boolean;
}

export interface UpdateBranchInput {
  code?: string;
  name?: string;
  description?: string;
  type?: BranchType;
  parentBranchId?: UUID;
  address?: Address;
  contact?: ContactInfo;
  currency?: Currency;
  language?: Language;
  timezone?: string;
  managerIds?: UUID[];
  isActive?: boolean;
  hasLocalStock?: boolean;
  canAccessCentralStock?: boolean;
  canTransferTo?: UUID[];
  canTransferFrom?: UUID[];
  separateBilling?: boolean;
  internalBillingRate?: number;
  bankDetails?: BankDetails;
  workingHours?: WorkingHours;
}

// ----- Inter-Branch Transfer -----
export interface BranchTransfer extends BaseEntity {
  code: string;
  status: TransferStatus;

  // Branches
  fromBranchId: UUID;
  fromBranchName: string;
  toBranchId: UUID;
  toBranchName: string;

  // Request
  requestedBy: UUID;
  requestedAt: ISODateString;
  requestReason?: string;
  requestPriority: 'low' | 'normal' | 'high' | 'urgent';

  // Approval
  approvedBy?: UUID;
  approvedAt?: ISODateString;
  rejectedBy?: UUID;
  rejectedAt?: ISODateString;
  rejectionReason?: string;

  // Shipping
  shippedAt?: ISODateString;
  shippedBy?: UUID;
  trackingNumber?: string;
  carrier?: string;
  estimatedArrival?: ISODateString;

  // Receipt
  receivedAt?: ISODateString;
  receivedBy?: UUID;

  // Items
  items: BranchTransferItem[];
  totalItems: number;
  receivedItems: number;

  // Billing (if applicable)
  isBillable: boolean;
  totalValue?: Money;
  invoiceId?: UUID;

  // Documents
  documents: FileInfo[];

  notes?: string;
  internalNotes?: string;

  metadata?: Record<string, unknown>;
}

export interface BranchTransferItem {
  id: UUID;
  transferId: UUID;
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;

  // Quantities
  requestedQuantity: number;
  approvedQuantity?: number;
  shippedQuantity?: number;
  receivedQuantity?: number;

  // Status
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'partial' | 'rejected';

  // Value
  unitValue?: Money;
  totalValue?: Money;

  notes?: string;
}

export interface CreateBranchTransferInput {
  fromBranchId: UUID;
  toBranchId: UUID;
  requestReason?: string;
  requestPriority?: 'low' | 'normal' | 'high' | 'urgent';
  items: Array<{
    articleId: UUID;
    instanceId?: UUID;
    quantity: number;
    notes?: string;
  }>;
  isBillable?: boolean;
  notes?: string;
}

export interface ApproveBranchTransferInput {
  items: Array<{
    itemId: UUID;
    approvedQuantity: number;
  }>;
  notes?: string;
}

export interface ShipBranchTransferInput {
  trackingNumber?: string;
  carrier?: string;
  estimatedArrival?: ISODateString;
  items?: Array<{
    itemId: UUID;
    shippedQuantity: number;
  }>;
  notes?: string;
}

export interface ReceiveBranchTransferInput {
  items: Array<{
    itemId: UUID;
    receivedQuantity: number;
    notes?: string;
  }>;
  notes?: string;
}

// ----- Branch Summary -----
export interface BranchSummary {
  id: UUID;
  code: string;
  name: string;
  type: BranchType;
  isActive: boolean;
  address: Address;
  userCount: number;
  articleCount: number;
  activeProjectCount: number;
}

// ----- Central Stock Access -----
export interface CentralStockAccess {
  branchId: UUID;
  articleId: UUID;
  allocatedQuantity: number;
  usedQuantity: number;
  availableQuantity: number;
  validFrom?: ISODateString;
  validUntil?: ISODateString;
}
