import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api';
import type { User, AuthTokens } from '@matflow/types';

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const tokensString = await SecureStore.getItemAsync(TOKEN_KEY);
      const userString = await SecureStore.getItemAsync(USER_KEY);

      if (tokensString && userString) {
        const tokens = JSON.parse(tokensString) as AuthTokens;
        const user = JSON.parse(userString) as User;

        // Check if token is expired
        const tokenPayload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (isExpired) {
          // Try to refresh
          const newTokens = await get().refreshToken();
          if (!newTokens) {
            await get().logout();
            return;
          }
        } else {
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
          set({ user, tokens, isAuthenticated: true });
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data;

      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

      set({ user, tokens, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const tokens = get().tokens;
      if (tokens) {
        await api.post('/auth/logout', { refreshToken: tokens.refreshToken }).catch(() => {});
      }
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      delete api.defaults.headers.common['Authorization'];
      set({ user: null, tokens: null, isAuthenticated: false });
    }
  },

  refreshToken: async () => {
    try {
      const tokens = get().tokens;
      if (!tokens?.refreshToken) return null;

      const response = await api.post('/auth/refresh', {
        refreshToken: tokens.refreshToken,
      });

      const newTokens = response.data;

      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(newTokens));
      api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;

      set({ tokens: newTokens, isAuthenticated: true });
      return newTokens.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      await get().logout();
      return null;
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    }
  },
}));
