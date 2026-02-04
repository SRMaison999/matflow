// =====================================================
// MatFlow - User Entity Types
// =====================================================

import type { UUID, ISODateString, BaseEntity, Address, ContactInfo, FileInfo, LocalizedString } from '../common';
import type { UserRole, UserStatus, Language, NotificationChannel } from '../enums';

// ----- User -----
export interface User extends BaseEntity {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: FileInfo;
  role: UserRole;
  status: UserStatus;
  branchId: UUID;
  branchIds: UUID[]; // Branches accessible
  language: Language;
  timezone: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  lastLoginAt?: ISODateString;
  lastActivityAt?: ISODateString;
  emailVerifiedAt?: ISODateString;
  passwordChangedAt?: ISODateString;
  twoFactorEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  permissions: string[];
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  channels: NotificationChannel[];
  categories: {
    reservation: boolean;
    project: boolean;
    stock: boolean;
    maintenance: boolean;
    billing: boolean;
    system: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string;
    timezone: string;
  };
  dailyDigest: boolean;
  weeklyReport: boolean;
}

export interface UserPreferences {
  language: Language;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 0 | 1 | 6; // Sunday, Monday, Saturday
  dashboardLayout: DashboardWidget[];
  defaultBranchId?: UUID;
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  tableRowsPerPage: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: Record<string, unknown>;
}

// ----- User Creation & Update -----
export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branchId: UUID;
  branchIds?: UUID[];
  language?: Language;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  branchId?: UUID;
  branchIds?: UUID[];
  language?: Language;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  notificationPreferences?: Partial<NotificationPreferences>;
}

// ----- Authentication -----
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthSession {
  id: UUID;
  userId: UUID;
  userAgent: string;
  ipAddress: string;
  createdAt: ISODateString;
  expiresAt: ISODateString;
  lastActivityAt: ISODateString;
  isCurrentSession: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

// ----- User Summary (for lists) -----
export interface UserSummary {
  id: UUID;
  email: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  branchId: UUID;
}
