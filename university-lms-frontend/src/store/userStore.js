/**
 * User Store (Zustand, Global LMS)
 * ----------------------------------------------------------------------------
 * Centralized production-ready Zustand store for user and profile management.
 * - Tracks current user profile, user list (for admin), loading and error state.
 * - Pure state/actions, no demo/sample logic.
 * - Structured for fast integration with backend, scalable for large user lists.
 */

import { create } from 'zustand';

// Initial/resettable store state
const initialState = {
  currentUser: null, // { id, name, email, roles, avatarUrl, ... }
  users: [],         // All users (for admin-management)
  loading: false,    // Global user-related loading flag
  error: null        // Global user-related error state
};

/**
 * useUserStore — Handles all profile/user state and actions LMS-wide.
 */
export const useUserStore = create((set, get) => ({
  ...initialState,

  // -----------------------------------------------
  // Loading & Error State Helpers
  // -----------------------------------------------
  /** Mark loading, clear error flag. */
  startLoading: () => set({ loading: true, error: null }),

  /** Mark not loading. */
  stopLoading: () => set({ loading: false }),

  /** Set error and unset loading. */
  setError: (error) => set({ error, loading: false }),

  /** Clear error state. */
  clearError: () => set({ error: null }),

  // -----------------------------------------------
  // Current User Actions
  // -----------------------------------------------
  /**
   * Set the current user (after login/profile load).
   * @param {object} user
   */
  setCurrentUser: (user) => set({ currentUser: user, loading: false, error: null }),

  /**
   * Partially update currentUser's fields (inline patch).
   * @param {object} partial
   */
  updateCurrentUser: (partial) => {
    const next = { ...(get().currentUser || {}), ...partial };
    set({ currentUser: next });
  },

  /**
   * Clear current user information (logout, cleanup).
   */
  clearCurrentUser: () => set({ currentUser: null }),

  // -----------------------------------------------
  // User List Actions (admin / staff functionality)
  // -----------------------------------------------
  /**
   * Set user list for management/admin purposes.
   * @param {Array} users
   */
  setUsers: (users) => set({ users, loading: false, error: null }),

  /**
   * Add a user to the list.
   * @param {object} user
   */
  addUser: (user) => set({ users: [...get().users, user] }),

  /**
   * Update a user in the user list (and currentUser if matching).
   * @param {string|number} userId
   * @param {object} partial
   */
  updateUser: (userId, partial) =>
    set({
      users: get().users.map((u) => (u.id === userId ? { ...u, ...partial } : u)),
      currentUser:
        get().currentUser?.id === userId
          ? { ...get().currentUser, ...partial }
          : get().currentUser
    }),

  /**
   * Remove a user from the user list (and clear currentUser if deleted).
   * @param {string|number} userId
   */
  removeUser: (userId) =>
    set({
      users: get().users.filter((u) => u.id !== userId),
      currentUser: get().currentUser?.id === userId ? null : get().currentUser
    }),

  // -----------------------------------------------
  // Reset State
  // -----------------------------------------------
  /**
   * Reset state to initial blank.
   */
  reset: () => set({ ...initialState }),
}));

// -----------------------------------------------
// Convenience selectors for strongly typed hooks
// -----------------------------------------------
export const selectCurrentUser  = (state) => state.currentUser;
export const selectUsers        = (state) => state.users;
export const selectUserLoading  = (state) => state.loading;
export const selectUserError    = (state) => state.error;

/**
 * Production/Architecture Notes:
 * - Robust, pure actions for all user management patterns in a modern LMS.
 * - Safe for concurrency, scalable to any user payloads.
 * - No demo/sample logic; only integrates with real backend/user management flows.
 */