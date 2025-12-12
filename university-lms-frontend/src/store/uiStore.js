// UI state store (lightweight, Redux-style actions) using Zustand.
// Manages common UI concerns: sidebar open/closed, theme, toasts, modals, loading flags.

import { create } from 'zustand';

// Helpers for optional persistence (only theme/sidebar in this example)
const STORAGE_KEY = 'uiState';

const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[uiStore] failed to load persisted state', err);
    return undefined;
  }
};

const savePersistedState = (state) => {
  try {
    // Persist only the small subset we care about across sessions
    const { theme, sidebarOpen } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, sidebarOpen }));
  } catch (err) {
    console.warn('[uiStore] failed to persist state', err);
  }
};

// Initial shape
const initialState = {
  sidebarOpen: true,
  theme: 'light', // 'light' | 'dark' | 'system'
  toasts: [],     // [{ id, type, message, timeoutMs }]
  modals: [],     // stack of modal descriptors
  loading: false,
  error: null
};

let toastIdCounter = 0;

export const useUiStore = create((set, get) => ({
  ...initialState,
  ...loadPersistedState(),

  // ---------------------------------------------------------------------------
  // Sidebar
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Theme
  // ---------------------------------------------------------------------------
  setTheme: (theme) => {
    const next = { ...get(), theme };
    set(next);
    savePersistedState(next);
  },

  // ---------------------------------------------------------------------------
  // Loading & error
  // ---------------------------------------------------------------------------
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: () => set({ loading: false }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // ---------------------------------------------------------------------------
  // Toasts
  // ---------------------------------------------------------------------------
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
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
  clearToasts: () => set({ toasts: [] }),

  // ---------------------------------------------------------------------------
  // Modals (simple stack)
  // ---------------------------------------------------------------------------
  openModal: (modal) => {
    // modal can be { id?, type, props }
    const m = modal.id ? modal : { ...modal, id: crypto.randomUUID?.() ?? Date.now().toString() };
    set({ modals: [...get().modals, m] });
    return m.id;
  },
  closeModal: (id) => {
    if (!id) return;
    set({ modals: get().modals.filter((m) => m.id !== id) });
  },
  closeAllModals: () => set({ modals: [] }),

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------
  reset: () => {
    set({ ...initialState });
    savePersistedState(initialState);
  }
}));

// Selectors (optional convenience)
export const selectSidebarOpen = (s) => s.sidebarOpen;
export const selectTheme = (s) => s.theme;
export const selectToasts = (s) => s.toasts;
export const selectModals = (s) => s.modals;
export const selectUiLoading = (s) => s.loading;
export const selectUiError = (s) => s.error;