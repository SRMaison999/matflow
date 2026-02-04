// =====================================================
// MatFlow - Kit Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  Money,
  FileInfo,
  LocalizedString,
} from '../common';
import type { KitStatus, ArticleCondition } from '../enums';

// ----- Kit Template -----
export interface KitTemplate extends BaseEntity {
  code: string;
  name: string;
  nameLocalized?: LocalizedString;
  description?: string;
  descriptionLocalized?: LocalizedString;
  categoryId?: UUID;
  branchId: UUID;

  // Components
  components: KitTemplateComponent[];
  totalComponents: number;

  // Pricing
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  assemblyTime?: number; // Minutes
  disassemblyTime?: number;

  // Media
  images: FileInfo[];
  primaryImageId?: UUID;
  documents: FileInfo[];

  // Configuration
  isActive: boolean;
  allowPartial: boolean; // Allow partial assembly
  requireVerification: boolean;

  notes?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface KitTemplateComponent {
  id: UUID;
  articleId: UUID;
  articleCode: string;
  articleName: string;
  quantity: number;
  isRequired: boolean;
  isSubstitutable: boolean;
  substitutes?: UUID[]; // Alternative article IDs
  notes?: string;
  sortOrder: number;
}

export interface CreateKitTemplateInput {
  code?: string;
  name: string;
  description?: string;
  categoryId?: UUID;
  branchId: UUID;
  components: Array<{
    articleId: UUID;
    quantity: number;
    isRequired?: boolean;
    isSubstitutable?: boolean;
    substitutes?: UUID[];
    notes?: string;
  }>;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  assemblyTime?: number;
  disassemblyTime?: number;
  allowPartial?: boolean;
  requireVerification?: boolean;
  notes?: string;
  tags?: string[];
}

export interface UpdateKitTemplateInput {
  code?: string;
  name?: string;
  description?: string;
  categoryId?: UUID;
  components?: Array<{
    articleId: UUID;
    quantity: number;
    isRequired?: boolean;
    isSubstitutable?: boolean;
    substitutes?: UUID[];
    notes?: string;
  }>;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  assemblyTime?: number;
  disassemblyTime?: number;
  allowPartial?: boolean;
  requireVerification?: boolean;
  isActive?: boolean;
  notes?: string;
  tags?: string[];
}

// ----- Kit Instance -----
export interface Kit extends BaseEntity {
  code: string;
  name: string;
  templateId?: UUID;
  template?: KitTemplate;
  status: KitStatus;
  branchId: UUID;
  locationId?: UUID;
  caseId?: UUID;

  // Components
  components: KitComponent[];
  totalComponents: number;
  assembledComponents: number;

  // Assembly
  assembledAt?: ISODateString;
  assembledBy?: UUID;
  verifiedAt?: ISODateString;
  verifiedBy?: UUID;
  dismantledAt?: ISODateString;
  dismantledBy?: UUID;

  // Current usage
  currentReservationId?: UUID;
  currentProjectId?: UUID;

  // Pricing (override)
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;

  // QR Code
  qrCode?: string;
  qrCodeUrl?: string;

  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface KitComponent {
  id: UUID;
  kitId: UUID;
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;
  expectedQuantity: number;
  actualQuantity: number;
  condition?: ArticleCondition;
  isSubstitute: boolean;
  originalArticleId?: UUID;
  status: 'pending' | 'added' | 'verified' | 'missing' | 'damaged';
  addedAt?: ISODateString;
  addedBy?: UUID;
  notes?: string;
}

export interface CreateKitInput {
  code?: string;
  name?: string;
  templateId: UUID;
  branchId: UUID;
  locationId?: UUID;
  caseId?: UUID;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  notes?: string;
}

export interface UpdateKitInput {
  name?: string;
  status?: KitStatus;
  locationId?: UUID;
  caseId?: UUID;
  rentalPriceDaily?: Money;
  rentalPriceWeekly?: Money;
  notes?: string;
}

// ----- Kit Assembly -----
export interface KitAssemblyInput {
  kitId: UUID;
  components: Array<{
    articleId: UUID;
    instanceId?: UUID;
    quantity: number;
    isSubstitute?: boolean;
    originalArticleId?: UUID;
    notes?: string;
  }>;
  locationId?: UUID;
  caseId?: UUID;
  notes?: string;
}

export interface KitVerificationResult {
  kitId: UUID;
  isComplete: boolean;
  isValid: boolean;
  components: Array<{
    articleId: UUID;
    articleName: string;
    expectedQuantity: number;
    actualQuantity: number;
    isVerified: boolean;
    condition?: ArticleCondition;
    issues?: string[];
  }>;
  issues: string[];
  verifiedAt: ISODateString;
  verifiedBy: UUID;
}

// ----- Kit Summary -----
export interface KitSummary {
  id: UUID;
  code: string;
  name: string;
  templateName?: string;
  status: KitStatus;
  branchId: UUID;
  totalComponents: number;
  assembledComponents: number;
  currentProjectName?: string;
  rentalPriceDaily?: Money;
}
