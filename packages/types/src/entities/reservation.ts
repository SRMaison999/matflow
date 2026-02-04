// =====================================================
// MatFlow - Reservation & Project Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  SoftDeletableEntity,
  Address,
  ContactInfo,
  Money,
  DateRange,
  FileInfo,
} from '../common';
import type {
  ReservationStatus,
  ProjectStatus,
  ProjectType,
  ArticleCondition,
} from '../enums';

// ----- Client -----
export interface Client extends SoftDeletableEntity {
  code: string;
  type: 'company' | 'individual';
  name: string;
  legalName?: string;
  vatNumber?: string;
  registrationNumber?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  contact: ContactInfo;
  primaryContactId?: UUID;
  contacts: ClientContact[];
  paymentTerms?: number; // Days
  creditLimit?: Money;
  currentBalance?: Money;
  discountRate?: number;
  notes?: string;
  tags: string[];
  isActive: boolean;
  branchId: UUID;
  metadata?: Record<string, unknown>;
}

export interface ClientContact {
  id: UUID;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  isPrimary: boolean;
  notes?: string;
}

export interface CreateClientInput {
  code?: string;
  type: 'company' | 'individual';
  name: string;
  legalName?: string;
  vatNumber?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  contact: ContactInfo;
  paymentTerms?: number;
  discountRate?: number;
  branchId: UUID;
  notes?: string;
  tags?: string[];
}

// ----- Project -----
export interface Project extends SoftDeletableEntity {
  code: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  clientId?: UUID;
  client?: Client;
  branchId: UUID;
  branchIds: UUID[]; // Multi-branch projects
  managerId: UUID;
  teamMemberIds: UUID[];

  // Dates
  startDate: ISODateString;
  endDate: ISODateString;
  setupDate?: ISODateString;
  teardownDate?: ISODateString;

  // Location
  venueAddress?: Address;
  venueName?: string;
  venueContact?: ContactInfo;

  // Budget
  estimatedBudget?: Money;
  actualCost?: Money;

  // Reservations
  reservations?: Reservation[];
  reservationCount: number;

  // Documents
  documents: FileInfo[];

  // Billing
  quoteId?: UUID;
  invoiceIds: UUID[];

  // Notes
  notes?: string;
  internalNotes?: string;

  // Tags & Metadata
  tags: string[];
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateProjectInput {
  code?: string;
  name: string;
  description?: string;
  type: ProjectType;
  clientId?: UUID;
  branchId: UUID;
  branchIds?: UUID[];
  managerId: UUID;
  teamMemberIds?: UUID[];
  startDate: ISODateString;
  endDate: ISODateString;
  setupDate?: ISODateString;
  teardownDate?: ISODateString;
  venueAddress?: Address;
  venueName?: string;
  estimatedBudget?: Money;
  notes?: string;
  tags?: string[];
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  clientId?: UUID;
  branchIds?: UUID[];
  managerId?: UUID;
  teamMemberIds?: UUID[];
  startDate?: ISODateString;
  endDate?: ISODateString;
  setupDate?: ISODateString;
  teardownDate?: ISODateString;
  venueAddress?: Address;
  venueName?: string;
  venueContact?: ContactInfo;
  estimatedBudget?: Money;
  actualCost?: Money;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  color?: string;
}

// ----- Reservation -----
export interface Reservation extends SoftDeletableEntity {
  code: string;
  name?: string;
  status: ReservationStatus;
  projectId: UUID;
  project?: Project;
  branchId: UUID;

  // Dates
  startDate: ISODateString;
  endDate: ISODateString;
  pickupDate?: ISODateString;
  returnDate?: ISODateString;
  actualPickupDate?: ISODateString;
  actualReturnDate?: ISODateString;

  // Items
  items: ReservationItem[];
  totalItems: number;
  pickedItems: number;
  returnedItems: number;

  // Addresses
  deliveryAddress?: Address;
  pickupAddress?: Address;

  // Pricing
  subtotal: Money;
  discount?: Money;
  discountRate?: number;
  taxes?: Money;
  total: Money;

  // Workflow
  preparedBy?: UUID;
  preparedAt?: ISODateString;
  verifiedBy?: UUID;
  verifiedAt?: ISODateString;
  dispatchedBy?: UUID;
  dispatchedAt?: ISODateString;
  receivedBy?: UUID;
  receivedAt?: ISODateString;

  // Notes
  notes?: string;
  internalNotes?: string;
  pickingNotes?: string;
  returnNotes?: string;

  // Related
  parentReservationId?: UUID; // For split reservations
  transferFromId?: UUID; // For direct transfers

  metadata?: Record<string, unknown>;
}

export interface ReservationItem {
  id: UUID;
  reservationId: UUID;
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;
  quantity: number;
  pickedQuantity: number;
  returnedQuantity: number;
  unitPrice: Money;
  totalPrice: Money;
  discount?: Money;

  // Status
  status: 'pending' | 'picked' | 'dispatched' | 'in_use' | 'returned' | 'lost' | 'damaged';
  conditionOut?: ArticleCondition;
  conditionIn?: ArticleCondition;

  // Substitution
  isSubstitute: boolean;
  originalArticleId?: UUID;

  // Notes
  notes?: string;
  returnNotes?: string;

  // Case assignment
  caseId?: UUID;
}

export interface CreateReservationInput {
  code?: string;
  name?: string;
  projectId: UUID;
  branchId: UUID;
  startDate: ISODateString;
  endDate: ISODateString;
  pickupDate?: ISODateString;
  returnDate?: ISODateString;
  deliveryAddress?: Address;
  pickupAddress?: Address;
  items: CreateReservationItemInput[];
  notes?: string;
  internalNotes?: string;
}

export interface CreateReservationItemInput {
  articleId: UUID;
  instanceId?: UUID;
  quantity: number;
  unitPrice?: Money;
  discount?: Money;
  notes?: string;
}

export interface UpdateReservationInput {
  name?: string;
  status?: ReservationStatus;
  startDate?: ISODateString;
  endDate?: ISODateString;
  pickupDate?: ISODateString;
  returnDate?: ISODateString;
  deliveryAddress?: Address;
  pickupAddress?: Address;
  discountRate?: number;
  notes?: string;
  internalNotes?: string;
  pickingNotes?: string;
}

// ----- Reservation Conflict -----
export interface ReservationConflict {
  articleId: UUID;
  articleCode: string;
  articleName: string;
  requestedQuantity: number;
  availableQuantity: number;
  conflictingReservations: Array<{
    reservationId: UUID;
    reservationCode: string;
    projectName: string;
    dateRange: DateRange;
    quantity: number;
  }>;
  suggestions: Array<{
    type: 'substitute' | 'reduce' | 'split' | 'transfer';
    description: string;
    articleId?: UUID;
    articleName?: string;
    availableQuantity?: number;
  }>;
}

// ----- Project Summary -----
export interface ProjectSummary {
  id: UUID;
  code: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  clientName?: string;
  startDate: ISODateString;
  endDate: ISODateString;
  reservationCount: number;
  totalValue: Money;
  color?: string;
}

// ----- Reservation Summary -----
export interface ReservationSummary {
  id: UUID;
  code: string;
  name?: string;
  status: ReservationStatus;
  projectId: UUID;
  projectName: string;
  startDate: ISODateString;
  endDate: ISODateString;
  totalItems: number;
  total: Money;
}
