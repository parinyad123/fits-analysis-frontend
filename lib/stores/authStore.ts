/*
lib/stores/authStore.ts

Authentication Store with Zustand + Persist
*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';
import { apiClient } from '@/lib/api/client'; 

// ==========================================
// Interface Definitions
// ==========================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

// ==========================================
// Initial State
// ==========================================

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

// ==========================================
// Store Creation
// ==========================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async () => {  // ✅ Make async
        console.log('🔓 Logging out...');
        
        try {
          // ✅ Call logout API (will send both Bearer token AND cookie)
          await apiClient.post('/api/v1/auth/logout');
          console.log('✅ Server cookie cleared');
        } catch (err: any) {
          // ✅ Only log warning if not 401 (401 is expected if token expired)
          if (err.response?.status !== 401) {
            console.error('⚠️ Logout API error:', err);
          }
        }
        
        // ✅ Clear local state
        set(initialState);
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
    }
  )
);

// ==========================================
// Selectors (Optional, for performance)
// ==========================================

export const selectUser = (state: AuthStore) => state.user;
export const selectToken = (state: AuthStore) => state.token;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;