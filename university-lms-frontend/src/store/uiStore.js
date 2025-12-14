/**
 * UI Store (Zustand, Global LMS)
 * ----------------------------------------------------------------------------
 * Production global UI state management.
 * - Tracks: sidebar, theme, toasts, modal stack, loading, and global UI errors.
 * - Unified state/actions, safe for SSR/FastAPI apps.
 * - Persists theme/sidebar (others are session-only).
 * - No demo/sample logic; all code is scalable, robust, and suitable for real use.
 */

import { create } from 'zustand';

// Persistent storage key
const STORAGE_KEY = 'uiState';

/**
 * Load persisted UI state for theme/sidebar.
 * Only runs client-side for SSR/App safety.
 */
const loadPersistedState = () => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return undefined;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[uiStore] failed to load persisted state', err);
    return undefined;
  }
};

/**
 * Save theme/sidebar (only persistent UI state).
 * @param {object} state
 */
const savePersistedState = (state) => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const { theme, sidebarOpen } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, sidebarOpen }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[uiStore] failed to persist state', err);
  }
};

// Default UI state
const initialState = {
  sidebarOpen: true,
  theme: 'light',          // 'light' | 'dark' | 'system'
  toasts: [],              // [{ id, type, message, timeoutMs }]
  modals: [],              // Stack of modal descriptors
  loading: false,
  error: null,
};

// Internal counter for unique toast IDs
let toastIdCounter = 0;

/**
 * useUiStore — Central global UI state for the LMS.
 */
export const useUiStore = create((set, get) => ({
  ...initialState,
  ...loadPersistedState(),

  // ------------------------------
  // Sidebar State
  // ------------------------------
  openSidebar: () => {
    const next = { ...get(), sidebarOpen: true };
    set(next);
    savePersistedState(next);
  },

  closeSidebar: () => {
    const next = { ...get(), sidebarOpen: false };
    set(next);
    savePersistedState(next);
  },

  toggleSidebar: () => {
    const next = { ...get(), sidebarOpen: !get().sidebarOpen };
    set(next);
    savePersistedState(next);
  },

  // ------------------------------
  // Theme
  // ------------------------------
  setTheme: (theme) => {
    const next = { ...get(), theme };
    set(next);
    savePersistedState(next);
  },

  // ------------------------------
  // Loading & Error
  // ------------------------------
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: () => set({ loading: false }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // ------------------------------
  // Toasts (global notifications)
  // ------------------------------
  addToast: ({ type = 'info', message, timeoutMs = 4000 }) => {
    if (!message) return;
    const id = ++toastIdCounter;
    const nextToasts = [...get().toasts, { id, type, message, timeoutMs }];
    set({ toasts: nextToasts });

    // Auto-remove after timeout
    if (timeoutMs > 0) {
      setTimeout(() => {
        const remaining = get().toasts.filter((t) => t.id !== id);
        set({ toasts: remaining });
      }, timeoutMs);
    }
    return id;
  },
  removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  clearToasts: () => set({ toasts: [] }),

  // ------------------------------
  // Modal Stack
  // ------------------------------
  openModal: (modal) => {
    // Each modal: { id, type, props }
    const m = modal.id ? modal : { ...modal, id: crypto.randomUUID?.() ?? Date.now().toString() };
    set({ modals: [...get().modals, m] });
    return m.id;
  },
  closeModal: (id) => {
    if (!id) return;
    set({ modals: get().modals.filter((m) => m.id !== id) });
  },
  closeAllModals: () => set({ modals: [] }),

  // ------------------------------
  // Reset UI state to initial
  // ------------------------------
  reset: () => {
    set({ ...initialState });
    savePersistedState(initialState);
  },
}));

// ------------------------------
// Selectors (scalable for UI hooks)
// ------------------------------
export const selectSidebarOpen   = (state) => state.sidebarOpen;
export const selectTheme         = (state) => state.theme;
export const selectToasts        = (state) => state.toasts;
export const selectModals        = (state) => state.modals;
export const selectUiLoading     = (state) => state.loading;
export const selectUiError       = (state) => state.error;

/**
 * Production/Architecture Notes:
 * - Unified pattern for all LMS global UI concerns.
 * - Uses safe SSR-aware persist/load.
 * - No demo/sample UI code; all logic is extensible for large scale production apps.
 */