// Notification store (Redux-style actions) using Zustand.
// Manages notifications list, unread counts, loading/error flags, and helpers to mark read/ack/remove.

import { create } from 'zustand';

const initialState = {
  notifications: [],   // [{ id, title, body, level, createdAt, read, ... }]
  unreadCount: 0,
  loading: false,
  error: null
};

export const useNotificationStore = create((set, get) => ({
  ...initialState,

  // ---------------------------------------------------------------------------
  // Loading & error helpers
  // ---------------------------------------------------------------------------
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: () => set({ loading: false }),
  setError: (error) => set({ error, loading: false }),
  clearError: () => set({ error: null }),

  // ---------------------------------------------------------------------------
  // List operations
  // ---------------------------------------------------------------------------
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount, loading: false, error: null });
  },

  addNotification: (notification) => {
    const next = [notification, ...get().notifications]; // prepend newest
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  updateNotification: (id, partial) => {
    const next = get().notifications.map((n) => (n.id === id ? { ...n, ...partial } : n));
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  removeNotification: (id) => {
    const next = get().notifications.filter((n) => n.id !== id);
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  clearAll: () => set({ ...initialState }),

  // ---------------------------------------------------------------------------
  // Read / unread helpers
  // ---------------------------------------------------------------------------
  markRead: (id) => {
    const next = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  markUnread: (id) => {
    const next = get().notifications.map((n) => (n.id === id ? { ...n, read: false } : n));
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  markAllRead: () => {
    const next = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: next, unreadCount: 0 });
  }
}));

// Selectors (optional convenience)
export const selectNotifications = (s) => s.notifications;
export const selectUnreadCount = (s) => s.unreadCount;
export const selectNotificationLoading = (s) => s.loading;
export const selectNotificationError = (s) => s.error;