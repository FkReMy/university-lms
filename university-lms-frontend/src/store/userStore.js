// User store (Redux-style actions) using Zustand.
// Manages current user profile, user list (optional for admin views), loading/error flags.

import { create } from 'zustand';

const initialState = {
  currentUser: null, // { id, name, email, roles, avatarUrl, ... }
  users: [],         // list of users (for admin/management views)
  loading: false,
  error: null
};

export const useUserStore = create((set, get) => ({
  ...initialState,

  // ---------------------------------------------------------------------------
  // Loading & error helpers
  // ---------------------------------------------------------------------------
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: () => set({ loading: false }),
  setError: (error) => set({ error, loading: false }),
  clearError: () => set({ error: null }),

  // ---------------------------------------------------------------------------
  // Current user
  // ---------------------------------------------------------------------------
  setCurrentUser: (user) => set({ currentUser: user, loading: false, error: null }),
  updateCurrentUser: (partial) => {
    const next = { ...(get().currentUser || {}), ...partial };
    set({ currentUser: next });
  },
  clearCurrentUser: () => set({ currentUser: null }),

  // ---------------------------------------------------------------------------
  // Users list (admin/staff views)
  // ---------------------------------------------------------------------------
  setUsers: (users) => set({ users, loading: false, error: null }),
  addUser: (user) => set({ users: [...get().users, user] }),
  updateUser: (userId, partial) =>
    set({
      users: get().users.map((u) => (u.id === userId ? { ...u, ...partial } : u)),
      currentUser:
        get().currentUser?.id === userId
          ? { ...get().currentUser, ...partial }
          : get().currentUser
    }),
  removeUser: (userId) =>
    set({
      users: get().users.filter((u) => u.id !== userId),
      currentUser: get().currentUser?.id === userId ? null : get().currentUser
    }),

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------
  reset: () => set({ ...initialState })
}));

// Selectors (optional convenience)
export const selectCurrentUser = (s) => s.currentUser;
export const selectUsers = (s) => s.users;
export const selectUserLoading = (s) => s.loading;
export const selectUserError = (s) => s.error;