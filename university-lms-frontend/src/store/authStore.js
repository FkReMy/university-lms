// Redux-style auth store using Zustand (actions grouped like a reducer dispatch).
// If you prefer real Redux Toolkit, you can adapt this shape to a slice easily.

import { create } from 'zustand';

// Helpers for persistence (optional)
// You can swap this for sessionStorage or remove entirely.
const STORAGE_KEY = 'authState';

const loadPersistedState = () => {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return undefined;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[authStore] failed to load persisted state', err);
    return undefined;
  }
};

const savePersistedState = (state) => {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[authStore] failed to persist state', err);
  }
};

// Initial state shape (Redux-like)
const initialState = {
  user: null,       // { id, name, email, roles, ... }
  token: null,      // access token / JWT
  isAuthenticated: false,
  loading: false,
  error: null
};

export const useAuthStore = create((set, get) => ({
  ...initialState,
  ...loadPersistedState(),

  // ---------------------------------------------------------------------------
  // Actions (Redux-style: pure-ish updates grouped here)
  // ---------------------------------------------------------------------------

  // Begin an auth-related async operation
  startAuth: () => set({ loading: true, error: null }),

  // Set user/token after successful login/refresh
  loginSuccess: ({ user, token }) => {
    const next = {
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null
    };
    set(next);
    savePersistedState(next);
  },

  // Handle login failure
  loginFailure: (error) => set({ loading: false, error, isAuthenticated: false }),

  // Clear auth state (logout)
  logout: () => {
    set({ ...initialState });
    savePersistedState(initialState);
  },

  // Update user profile fields without touching token
  updateUser: (partialUser) => {
    const { user } = get();
    const nextUser = { ...(user || {}), ...partialUser };
    const next = { ...get(), user: nextUser };
    set(next);
    savePersistedState(next);
  },

  // Set a new token (e.g., refresh)
  setToken: (token) => {
    const next = { ...get(), token, isAuthenticated: !!token };
    set(next);
    savePersistedState(next);
  },

  // Clear error (e.g., after showing a toast)
  clearError: () => set({ error: null }),

  // Hard reset (if you need to wipe everything, including persistence)
  reset: () => {
    set({ ...initialState });
    savePersistedState(initialState);
  }
}));

// Optional selectors (helps keep components lean)
export const selectUser = (state) => state.user;
export const selectToken = (state) => state.token;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectAuthLoading = (state) => state.loading;
export const selectAuthError = (state) => state.error;