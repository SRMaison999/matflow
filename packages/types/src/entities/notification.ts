// =====================================================
// MatFlow - Notification Entity Types
// =====================================================

import type {
  UUID,
  ISODateString,
  BaseEntity,
} from '../common';
import type {
  NotificationType,
  NotificationChannel,
  NotificationCategory,
} from '../enums';

// ----- Notification -----
export interface Notification extends BaseEntity {
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;

  // Recipient
  userId: UUID;
  branchId?: UUID;

  // Content
  title: string;
  message: string;
  data?: Record<string, unknown>;

  // Link
  actionUrl?: string;
  actionLabel?: string;

  // Reference
  referenceType?: string;
  referenceId?: UUID;

  // Status
  isRead: boolean;
  readAt?: ISODateString;
  isArchived: boolean;
  archivedAt?: ISODateString;

  // Delivery
  deliveredAt?: ISODateString;
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed';
  deliveryError?: string;

  // Expiry
  expiresAt?: ISODateString;

  metadata?: Record<string, unknown>;
}

export interface CreateNotificationInput {
  type: NotificationType;
  category: NotificationCategory;
  channels: NotificationChannel[];
  userIds: UUID[];
  branchId?: UUID;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  actionLabel?: string;
  referenceType?: string;
  referenceId?: UUID;
  expiresAt?: ISODateString;
}

// ----- Notification Template -----
export interface NotificationTemplate extends BaseEntity {
  code: string;
  name: string;
  category: NotificationCategory;
  channels: NotificationChannel[];

  // Content
  titleTemplate: string;
  messageTemplate: string;
  emailSubjectTemplate?: string;
  emailBodyTemplate?: string;
  pushTitleTemplate?: string;
  pushBodyTemplate?: string;

  // Variables
  variables: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;

  isActive: boolean;
  isSystem: boolean;

  notes?: string;
}

// ----- Alert Configuration -----
export interface AlertConfiguration extends BaseEntity {
  name: string;
  description?: string;
  category: NotificationCategory;
  eventType: string;
  isActive: boolean;

  // Conditions
  conditions: AlertCondition[];

  // Actions
  channels: NotificationChannel[];
  templateId?: UUID;
  recipientType: 'user' | 'role' | 'branch' | 'custom';
  recipientIds?: UUID[];
  recipientRoles?: string[];

  // Throttling
  throttleMinutes?: number;
  maxPerDay?: number;

  branchId?: UUID;
  metadata?: Record<string, unknown>;
}

export interface AlertCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains';
  value: unknown;
}

// ----- Notification Event Types -----
export type NotificationEventType =
  // Reservation events
  | 'reservation.created'
  | 'reservation.confirmed'
  | 'reservation.preparing'
  | 'reservation.ready'
  | 'reservation.dispatched'
  | 'reservation.returned'
  | 'reservation.cancelled'
  | 'reservation.conflict'
  // Project events
  | 'project.created'
  | 'project.started'
  | 'project.completed'
  | 'project.cancelled'
  // Stock events
  | 'stock.low'
  | 'stock.out'
  | 'stock.received'
  | 'stock.adjusted'
  // Maintenance events
  | 'maintenance.scheduled'
  | 'maintenance.due'
  | 'maintenance.overdue'
  | 'maintenance.completed'
  // Billing events
  | 'quote.sent'
  | 'quote.accepted'
  | 'quote.rejected'
  | 'quote.expired'
  | 'invoice.sent'
  | 'invoice.paid'
  | 'invoice.overdue'
  // Incident events
  | 'incident.reported'
  | 'incident.assigned'
  | 'incident.resolved'
  // Transfer events
  | 'transfer.requested'
  | 'transfer.approved'
  | 'transfer.shipped'
  | 'transfer.received'
  // User events
  | 'user.assigned'
  | 'user.mentioned'
  | 'user.password_expiring'
  // System events
  | 'system.backup_completed'
  | 'system.import_completed'
  | 'system.error';

// ----- Notification Payload -----
export interface NotificationPayload<T = Record<string, unknown>> {
  eventType: NotificationEventType;
  timestamp: ISODateString;
  branchId?: UUID;
  userId?: UUID;
  data: T;
}

// ----- Notification Preferences -----
export interface NotificationPreferencesUpdate {
  channels?: NotificationChannel[];
  categories?: {
    reservation?: boolean;
    project?: boolean;
    stock?: boolean;
    maintenance?: boolean;
    billing?: boolean;
    system?: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  dailyDigest?: boolean;
  weeklyReport?: boolean;
}

// ----- Notification Stats -----
export interface NotificationStats {
  userId: UUID;
  unreadCount: number;
  unreadByCategory: Record<NotificationCategory, number>;
  lastReadAt?: ISODateString;
}

// ----- Push Subscription -----
export interface PushSubscription extends BaseEntity {
  userId: UUID;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  deviceInfo?: {
    type: string;
    os: string;
    browser?: string;
  };
  isActive: boolean;
  lastUsedAt?: ISODateString;
}
