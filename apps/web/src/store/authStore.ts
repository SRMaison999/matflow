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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

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
