// =====================================================
// MatFlow - Auth Store
// =====================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@matflow/types';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  branchId: string;
  branchName: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
}

// Dev mode mock user for testing mockups
const DEV_MODE = import.meta.env.DEV;
const MOCK_USER: User = {
  id: 'dev-user-1',
  email: 'admin@matflow.ch',
  displayName: 'Admin Dev',
  role: 'admin' as UserRole,
  branchId: 'branch-1',
  branchName: 'Lausanne',
  permissions: ['*'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEV_MODE ? MOCK_USER : null,
      accessToken: DEV_MODE ? 'dev-token' : null,
      refreshToken: DEV_MODE ? 'dev-refresh-token' : null,
      isAuthenticated: DEV_MODE,

      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      setUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: 'matflow-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // In dev mode, always use mock auth (ignore persisted state)
      merge: (persistedState, currentState) => {
        if (DEV_MODE) {
          return {
            ...currentState,
            user: MOCK_USER,
            accessToken: 'dev-token',
            refreshToken: 'dev-refresh-token',
            isAuthenticated: true,
          };
        }
        return { ...currentState, ...(persistedState as Partial<AuthState>) };
      },
    }
  )
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUserRole = (state: AuthState) => state.user?.role;
export const selectUserPermissions = (state: AuthState) => state.user?.permissions || [];

// Permission check helper
export function hasPermission(permissions: string[], required: string | string[]): boolean {
  if (permissions.includes('*')) return true;

  const requiredPerms = Array.isArray(required) ? required : [required];
  return requiredPerms.some((perm) => permissions.includes(perm));
}

// Role check helper
export function hasRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
