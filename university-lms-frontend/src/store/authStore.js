import { create } from 'zustand';

import { clearAuthToken, getAuthToken, setAuthToken } from '@/services/api/axiosInstance';

// Helpers for persistence (optional)
const STORAGE_KEY = 'authState';

const safeStorage = () => {
  if (typeof window === 'undefined') return null;
  return window?.localStorage ?? null;
};

const loadPersistedState = () => {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return undefined;
  }
  try {
    const storage = safeStorage();
    if (!storage) return undefined;
    const raw = storage.getItem(STORAGE_KEY);
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
const savePersistedState = (state, remember = true) => {
  try {
    if (!remember) return;
    const storage = safeStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[authStore] failed to persist state', err);
  }
};

// Initial state shape
const initialState = {
  user: null,       // { id, name, email, roles, ... }
  token: null,      // access token / JWT
  isAuthenticated: false,
  loading: false,
  error: null,
  ready: false,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  // Hydrate from storage when the app starts (explicitly triggered).
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

  // Begin an auth-related async operation
  startAuth: () => set({ loading: true, error: null }),

  // Demo login implementation (replace with real API call)
  login: async ({ username, password, remember = true }) => {
    set({ loading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!username || !password) {
      const error = 'Username and password are required';
      set({ loading: false, error });
      throw new Error(error);
    }

    // Simple role mapping for demo purposes
    const role = username === 'admin' ? 'admin' : 'student';
    const user = {
      id: username,
      name: username,
      email: `${username}@university.edu`,
      role,
    };
    const token = `demo-token-${username}`;

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
    return user;
  },

  // Set user/token after successful login/refresh
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

  // Handle login failure
  loginFailure: (error) => set({ loading: false, error, isAuthenticated: false }),

  // Clear auth state (logout)
  logout: () => {
    set({ ...initialState, ready: true });
    savePersistedState(initialState);
    clearAuthToken();
  },

  // Update user profile fields without touching token
  updateUser: (partialUser) => {
    const { user, token } = get();
    const nextUser = { ...(user || {}), ...partialUser };
    const next = { ...get(), user: nextUser, isAuthenticated: !!token };
    set(next);
    savePersistedState(next);
  },

  // Set a new token (e.g., refresh)
  setToken: (token) => {
    setAuthToken(token);
    const next = { ...get(), token, isAuthenticated: !!token, ready: true };
    set(next);
    savePersistedState(next);
  },

  // Clear error (e.g., after showing a toast)
  clearError: () => set({ error: null }),

  // Hard reset (if you need to wipe everything, including persistence)
  reset: () => {
    set({ ...initialState, ready: true });
    savePersistedState(initialState);
    clearAuthToken();
  }
}));

// Optional selectors (helps keep components lean)
export const selectUser = (state) => state.user;
export const selectToken = (state) => state.token;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectAuthLoading = (state) => state.loading;
export const selectAuthError = (state) => state.error;
