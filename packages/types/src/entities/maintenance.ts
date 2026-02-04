// =====================================================
// MatFlow - Maintenance Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
  Money,
  FileInfo,
} from '../common';
import type {
  MaintenanceType,
  MaintenanceStatus,
  MaintenancePriority,
  ArticleCondition,
} from '../enums';

// ----- Maintenance Task -----
export interface MaintenanceTask extends BaseEntity {
  code: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: MaintenancePriority;

  // Article
  articleId: UUID;
  articleCode: string;
  articleName: string;
  instanceId?: UUID;
  serialNumber?: string;

  // Schedule
  scheduledDate: ISODateString;
  dueDate?: ISODateString;
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  estimatedDuration?: number; // Minutes
  actualDuration?: number;

  // Assignment
  assignedTo?: UUID;
  assignedToName?: string;
  performedBy?: UUID;
  validatedBy?: UUID;

  // Location
  branchId: UUID;
  locationId?: UUID;

  // Details
  title: string;
  description?: string;
  instructions?: string;

  // Checklist
  checklist: MaintenanceChecklistItem[];
  checklistProgress: number;

  // Parts & Costs
  parts: MaintenancePart[];
  laborCost?: Money;
  partsCost?: Money;
  totalCost?: Money;

  // Condition
  conditionBefore?: ArticleCondition;
  conditionAfter?: ArticleCondition;

  // Results
  findings?: string;
  workPerformed?: string;
  recommendations?: string;
  nextMaintenanceDate?: ISODateString;

  // Documents
  photos: FileInfo[];
  documents: FileInfo[];

  // External service
  isExternal: boolean;
  externalVendor?: string;
  externalReference?: string;

  // Related
  triggeredByIncidentId?: UUID;

  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface MaintenanceChecklistItem {
  id: UUID;
  description: string;
  isCompleted: boolean;
  completedAt?: ISODateString;
  completedBy?: UUID;
  notes?: string;
  sortOrder: number;
}

export interface MaintenancePart {
  id: UUID;
  name: string;
  partNumber?: string;
  quantity: number;
  unitCost: Money;
  totalCost: Money;
  supplier?: string;
  isFromStock: boolean;
  articleId?: UUID;
  notes?: string;
}

export interface CreateMaintenanceTaskInput {
  type: MaintenanceType;
  priority?: MaintenancePriority;
  articleId: UUID;
  instanceId?: UUID;
  scheduledDate: ISODateString;
  dueDate?: ISODateString;
  estimatedDuration?: number;
  assignedTo?: UUID;
  branchId: UUID;
  locationId?: UUID;
  title: string;
  description?: string;
  instructions?: string;
  checklist?: Array<{ description: string }>;
  isExternal?: boolean;
  externalVendor?: string;
  triggeredByIncidentId?: UUID;
  notes?: string;
}

export interface UpdateMaintenanceTaskInput {
  type?: MaintenanceType;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  scheduledDate?: ISODateString;
  dueDate?: ISODateString;
  estimatedDuration?: number;
  assignedTo?: UUID;
  locationId?: UUID;
  title?: string;
  description?: string;
  instructions?: string;
  conditionBefore?: ArticleCondition;
  conditionAfter?: ArticleCondition;
  findings?: string;
  workPerformed?: string;
  recommendations?: string;
  nextMaintenanceDate?: ISODateString;
  isExternal?: boolean;
  externalVendor?: string;
  externalReference?: string;
  notes?: string;
}

export interface CompleteMaintenanceInput {
  conditionAfter: ArticleCondition;
  workPerformed: string;
  findings?: string;
  recommendations?: string;
  laborCost?: Money;
  parts?: Array<{
    name: string;
    partNumber?: string;
    quantity: number;
    unitCost: Money;
    supplier?: string;
    isFromStock?: boolean;
    articleId?: UUID;
  }>;
  nextMaintenanceDate?: ISODateString;
  photos?: UUID[];
  documents?: UUID[];
  notes?: string;
}

// ----- Maintenance Schedule -----
export interface MaintenanceSchedule extends BaseEntity {
  name: string;
  type: MaintenanceType;

  // Target
  articleId?: UUID;
  categoryId?: UUID;
  branchId?: UUID;

  // Interval
  intervalType: 'days' | 'weeks' | 'months' | 'usage_hours' | 'usage_count';
  intervalValue: number;

  // Schedule
  isActive: boolean;
  lastGeneratedAt?: ISODateString;
  nextGenerationAt?: ISODateString;

  // Template
  taskTitle: string;
  taskDescription?: string;
  taskInstructions?: string;
  estimatedDuration?: number;
  priority: MaintenancePriority;
  checklist: Array<{ description: string }>;

  // Assignment
  defaultAssignee?: UUID;

  notes?: string;
}

export interface CreateMaintenanceScheduleInput {
  name: string;
  type: MaintenanceType;
  articleId?: UUID;
  categoryId?: UUID;
  branchId?: UUID;
  intervalType: 'days' | 'weeks' | 'months' | 'usage_hours' | 'usage_count';
  intervalValue: number;
  taskTitle: string;
  taskDescription?: string;
  taskInstructions?: string;
  estimatedDuration?: number;
  priority?: MaintenancePriority;
  checklist?: Array<{ description: string }>;
  defaultAssignee?: UUID;
  notes?: string;
}

// ----- Maintenance History -----
export interface MaintenanceHistory {
  articleId: UUID;
  totalTasks: number;
  completedTasks: number;
  totalCost: Money;
  averageCost: Money;
  lastMaintenanceDate?: ISODateString;
  nextScheduledDate?: ISODateString;
  tasks: MaintenanceTaskSummary[];
}

export interface MaintenanceTaskSummary {
  id: UUID;
  code: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  scheduledDate: ISODateString;
  completedAt?: ISODateString;
  totalCost?: Money;
  conditionAfter?: ArticleCondition;
}

// ----- Maintenance Dashboard -----
export interface MaintenanceDashboard {
  branchId?: UUID;
  overdueTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedThisMonth: number;
  totalCostThisMonth: Money;
  upcomingTasks: MaintenanceTaskSummary[];
  recentlyCompleted: MaintenanceTaskSummary[];
  byType: Array<{
    type: MaintenanceType;
    count: number;
    cost: Money;
  }>;
  byPriority: Array<{
    priority: MaintenancePriority;
    count: number;
  }>;
}
