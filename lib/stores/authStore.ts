/*
lib/stores/authStore.ts

Authentication Store with Zustand + Persist
*/
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/lib/types';

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
      // Spread initial state
      ...initialState,

      // Actions
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
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
      
      // Persist only auth data, not loading states
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        // isLoading is excluded (ephemeral state)
      }),

      // Optional: Use sessionStorage for more security
      // storage: createJSONStorage(() => sessionStorage),
      
      // Optional: Version for migration
      version: 1,
      
      // Optional: Migrate old data
      // migrate: (persistedState, version) => {
      //   if (version === 0) {
      //     // Migrate from version 0 to 1
      //     return { ...persistedState, newField: 'value' };
      //   }
      //   return persistedState as AuthStore;
      // },
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