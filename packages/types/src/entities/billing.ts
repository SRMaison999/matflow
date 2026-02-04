// =====================================================
// MatFlow - Billing Entity Types (Quotes, Invoices)
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  SoftDeletableEntity,
  Money,
  Address,
  FileInfo,
} from '../common';
import type {
  QuoteStatus,
  InvoiceStatus,
  PaymentMethod,
  PricingType,
  Currency,
} from '../enums';

// ----- Quote -----
export interface Quote extends SoftDeletableEntity {
  code: string;
  version: number;
  status: QuoteStatus;

  // Client
  clientId: UUID;
  clientName: string;
  clientAddress: Address;
  clientVatNumber?: string;

  // References
  projectId?: UUID;
  reservationIds: UUID[];
  branchId: UUID;

  // Dates
  issueDate: ISODateString;
  validUntil: ISODateString;
  acceptedAt?: ISODateString;
  rejectedAt?: ISODateString;

  // Items
  items: QuoteItem[];
  sections: QuoteSection[];

  // Totals
  subtotal: Money;
  discountAmount?: Money;
  discountRate?: number;
  taxRate: number;
  taxAmount: Money;
  total: Money;

  // Terms
  paymentTerms?: string;
  paymentTermsDays?: number;
  conditions?: string;
  notes?: string;
  internalNotes?: string;

  // Generated document
  documentUrl?: string;
  documentGeneratedAt?: ISODateString;

  // Converted invoice
  convertedToInvoiceId?: UUID;

  metadata?: Record<string, unknown>;
}

export interface QuoteSection {
  id: UUID;
  name: string;
  description?: string;
  subtotal: Money;
  sortOrder: number;
}

export interface QuoteItem {
  id: UUID;
  quoteId: UUID;
  sectionId?: UUID;

  // Reference
  articleId?: UUID;
  kitId?: UUID;

  // Details
  code: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;

  // Pricing
  pricingType: PricingType;
  unitPrice: Money;
  days?: number;
  discount?: Money;
  discountRate?: number;
  totalPrice: Money;

  notes?: string;
  sortOrder: number;
}

export interface CreateQuoteInput {
  clientId: UUID;
  projectId?: UUID;
  reservationIds?: UUID[];
  branchId: UUID;
  validUntil?: ISODateString;
  items?: CreateQuoteItemInput[];
  discountRate?: number;
  taxRate?: number;
  paymentTermsDays?: number;
  conditions?: string;
  notes?: string;
}

export interface CreateQuoteItemInput {
  sectionId?: UUID;
  articleId?: UUID;
  kitId?: UUID;
  code?: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  pricingType?: PricingType;
  unitPrice: Money;
  days?: number;
  discountRate?: number;
  notes?: string;
}

export interface UpdateQuoteInput {
  status?: QuoteStatus;
  validUntil?: ISODateString;
  discountRate?: number;
  taxRate?: number;
  paymentTermsDays?: number;
  conditions?: string;
  notes?: string;
  internalNotes?: string;
}

// ----- Invoice -----
export interface Invoice extends SoftDeletableEntity {
  code: string;
  invoiceNumber: string;
  status: InvoiceStatus;

  // Client
  clientId: UUID;
  clientName: string;
  clientAddress: Address;
  clientVatNumber?: string;

  // References
  quoteId?: UUID;
  projectId?: UUID;
  reservationIds: UUID[];
  branchId: UUID;

  // Dates
  issueDate: ISODateString;
  dueDate: ISODateString;
  paidAt?: ISODateString;

  // Items
  items: InvoiceItem[];

  // Totals
  subtotal: Money;
  discountAmount?: Money;
  discountRate?: number;
  taxRate: number;
  taxAmount: Money;
  total: Money;
  amountPaid: Money;
  amountDue: Money;

  // Payments
  payments: Payment[];

  // Terms
  paymentTerms?: string;
  notes?: string;
  internalNotes?: string;

  // Generated document
  documentUrl?: string;
  documentGeneratedAt?: ISODateString;

  // Reminders
  reminderSentAt?: ISODateString;
  reminderCount: number;

  // Credit notes
  creditNoteIds: UUID[];
  creditedAmount?: Money;

  metadata?: Record<string, unknown>;
}

export interface InvoiceItem {
  id: UUID;
  invoiceId: UUID;

  // Reference
  articleId?: UUID;
  kitId?: UUID;
  quoteItemId?: UUID;

  // Details
  code: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;

  // Pricing
  pricingType: PricingType;
  unitPrice: Money;
  days?: number;
  discount?: Money;
  discountRate?: number;
  totalPrice: Money;
  taxRate?: number;

  notes?: string;
  sortOrder: number;
}

export interface CreateInvoiceInput {
  clientId: UUID;
  quoteId?: UUID;
  projectId?: UUID;
  reservationIds?: UUID[];
  branchId: UUID;
  dueDate?: ISODateString;
  items?: CreateInvoiceItemInput[];
  discountRate?: number;
  taxRate?: number;
  notes?: string;
}

export interface CreateInvoiceItemInput {
  articleId?: UUID;
  kitId?: UUID;
  code?: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  pricingType?: PricingType;
  unitPrice: Money;
  days?: number;
  discountRate?: number;
  notes?: string;
}

// ----- Payment -----
export interface Payment extends BaseEntity {
  invoiceId: UUID;
  amount: Money;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  paidAt: ISODateString;
  notes?: string;
  receiptUrl?: string;
  recordedBy: UUID;
}

export interface RecordPaymentInput {
  invoiceId: UUID;
  amount: Money;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  paidAt?: ISODateString;
  notes?: string;
}

// ----- Credit Note -----
export interface CreditNote extends BaseEntity {
  code: string;
  invoiceId: UUID;
  status: 'draft' | 'issued' | 'applied' | 'cancelled';

  // Client
  clientId: UUID;
  clientName: string;

  // Items
  items: CreditNoteItem[];

  // Totals
  subtotal: Money;
  taxAmount: Money;
  total: Money;

  // Dates
  issueDate: ISODateString;
  appliedAt?: ISODateString;

  reason: string;
  notes?: string;

  documentUrl?: string;
}

export interface CreditNoteItem {
  id: UUID;
  invoiceItemId?: UUID;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

// ----- Pricing Configuration -----
export interface PricingRule extends BaseEntity {
  name: string;
  type: PricingType;
  branchId?: UUID;

  // Target
  articleId?: UUID;
  categoryId?: UUID;
  clientId?: UUID;

  // Pricing
  basePrice: Money;
  currency: Currency;

  // Degressive pricing
  degressiveRates?: Array<{
    fromDay: number;
    toDay?: number;
    rate: number; // Percentage of base price
  }>;

  // Validity
  validFrom?: ISODateString;
  validUntil?: ISODateString;
  isActive: boolean;

  priority: number;
  notes?: string;
}

// ----- Billing Summary -----
export interface BillingSummary {
  branchId?: UUID;
  period: { start: ISODateString; end: ISODateString };

  quotes: {
    total: number;
    pending: number;
    accepted: number;
    totalValue: Money;
    acceptedValue: Money;
  };

  invoices: {
    total: number;
    paid: number;
    overdue: number;
    totalValue: Money;
    paidValue: Money;
    overdueValue: Money;
  };

  payments: {
    total: number;
    totalAmount: Money;
    byMethod: Array<{
      method: PaymentMethod;
      count: number;
      amount: Money;
    }>;
  };

  topClients: Array<{
    clientId: UUID;
    clientName: string;
    invoiceCount: number;
    totalValue: Money;
  }>;
}
