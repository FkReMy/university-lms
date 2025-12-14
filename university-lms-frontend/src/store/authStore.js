/**
 * Auth Store (Zustand, Global LMS)
 * ----------------------------------------------------------------------------
 * Production-ready global authentication store using Zustand.
 * - Handles: user, token, login/logout, loading/errors, persistence, hydration.
 * - Hooks into centralized axiosInstance for token management.
 * - Unified state for roles, profile, etc. No demo/sample logic.
 * - Uses localStorage for optional "remember me"/persistence.
 */

import { create } from 'zustand';

import { clearAuthToken, getAuthToken, setAuthToken } from '@/services/api/axiosInstance';

// Persistent storage key for localStorage
const STORAGE_KEY = 'authState';

/**
 * Safely get browser localStorage.
 * @returns {Storage|null}
 */
const safeStorage = () => (typeof window !== 'undefined' ? window.localStorage : null);

/**
 * Load persisted auth state from storage (if available).
 * @returns {object|undefined}
 */
const loadPersistedState = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return undefined;
  try {
    const storage = safeStorage();
    const raw = storage?.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[authStore] failed to load persisted state', err);
    return undefined;
  }
};

/**
 * Save auth state to storage if 'remember' is true.
 * @param {object} state
 * @param {boolean} remember
 */
const savePersistedState = (state, remember = true) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  if (!remember) return;
  try {
    const storage = safeStorage();
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[authStore] failed to persist state', err);
  }
};

// Initial (reset) state shape for clean logout/reset
const initialState = {
  user: null,             // { id, name, email, roles, ... }
  token: null,            // JWT or access token
  isAuthenticated: false,
  loading: false,
  error: null,
  ready: false,
};

/**
 * useAuthStore — global LMS authentication/provider store.
 * Handles all auth business logic, persistence, and rehydration.
 */
export const useAuthStore = create((set, get) => ({
  ...initialState,

  /**
   * Hydrate from persisted storage (call at app startup or after restore).
   */
  hydrate: () => {
    const persisted = loadPersistedState();
    const token = persisted?.token || getAuthToken();
    if (token) setAuthToken(token);
    set({
      ...initialState,
      ...persisted,
      token,
      isAuthenticated: !!(persisted?.user && token),
      ready: true,
      loading: false,
    });
  },

  /**
   * Mark the store as starting authentication.
   */
  startAuth: () => set({ loading: true, error: null }),

  /**
   * Set user/token and full state after a successful login (call with real API data).
   * @param {object} param0 - { user, token }
   * @param {boolean} remember - Remember in storage (default true)
   */
  loginSuccess: ({ user, token }, remember = true) => {
    const next = {
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
      ready: true,
    };
    set(next);
    savePersistedState(next, remember);
    setAuthToken(token);
  },

  /**
   * Handle login failure.
   * @param {any} error
   */
  loginFailure: (error) => set({ loading: false, error, isAuthenticated: false }),

  /**
   * Logout: clear all session state and persistent storage.
   */
  logout: () => {
    set({ ...initialState, ready: true });
    savePersistedState(initialState);
    clearAuthToken();
  },

  /**
   * Update user profile fields (partial).
   * @param {object} partialUser
   */
  updateUser: (partialUser) => {
    const { user, token } = get();
    const nextUser = { ...(user || {}), ...partialUser };
    const next = { ...get(), user: nextUser, isAuthenticated: !!token };
    set(next);
    savePersistedState(next);
  },

  /**
   * Set a new token (e.g., after refresh).
   * @param {string} token
   */
  setToken: (token) => {
    setAuthToken(token);
    const next = { ...get(), token, isAuthenticated: !!token, ready: true };
    set(next);
    savePersistedState(next);
  },

  /**
   * Clear error (after showing user feedback, for example).
   */
  clearError: () => set({ error: null }),

  /**
   * Hard reset: clear all in-memory and persisted state.
   */
  reset: () => {
    set({ ...initialState, ready: true });
    savePersistedState(initialState);
    clearAuthToken();
  }
}));

// -----------------------------------------------------------------------------
// Selectors for convenience: keep components lean and decoupled
// -----------------------------------------------------------------------------
export const selectUser = (state) => state.user;
export const selectToken = (state) => state.token;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectAuthLoading = (state) => state.loading;
export const selectAuthError = (state) => state.error;

/**
 * Production/Architecture Notes:
 * - All state is structed for FastAPI/JWT real-world LMS flows.
 * - No demo/sample logic; ready for plug-and-play with real backend API.
 * - Central authority for all authentication, token, and user role policy.
 */