/**
 * Notification Store (Zustand, Global LMS)
 * ----------------------------------------------------------------------------
 * Production Zustand store for notifications:
 * - Manages global notifications list, unread count, loading/error states.
 * - Exposes mutation actions for CRUD and "read/unread/ack" pattern.
 * - Unified, robust, and ready for FastAPI/PostgreSQL real backend APIs.
 * - No demo/sample logic.
 */

import { create } from 'zustand';

// Initial state for resetting or clearAll operations
const initialState = {
  notifications: [],   // Array of notification objects: { id, title, body, ..., read }
  unreadCount: 0,
  loading: false,
  error: null,
};

/**
 * useNotificationStore — main LMS notification state/actions.
 */
export const useNotificationStore = create((set, get) => ({
  ...initialState,

  // -----------------------------------------------
  // Loading/Error State
  // -----------------------------------------------
  /** Set loading true and clear error. */
  startLoading: () => set({ loading: true, error: null }),

  /** Unset loading flag. */
  stopLoading: () => set({ loading: false }),

  /** Set error and stop loading. */
  setError: (error) => set({ error, loading: false }),

  /** Clear error only. */
  clearError: () => set({ error: null }),

  // -----------------------------------------------
  // Notification List Actions
  // -----------------------------------------------

  /**
   * Replace all notifications and update unreadCount.
   * @param {Array} notifications
   */
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount, loading: false, error: null });
  },

  /**
   * Add new notification to the front (most recent first).
   * @param {Object} notification
   */
  addNotification: (notification) => {
    const next = [notification, ...get().notifications];
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  /**
   * Update a single notification object (by id, partial).
   * @param {string|number} id
   * @param {Object} partial
   */
  updateNotification: (id, partial) => {
    const next = get().notifications.map((n) =>
      n.id === id ? { ...n, ...partial } : n
    );
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  /**
   * Remove a notification (by id).
   * @param {string|number} id
   */
  removeNotification: (id) => {
    const next = get().notifications.filter((n) => n.id !== id);
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  /**
   * Clear all notifications and reset state.
   */
  clearAll: () => set({ ...initialState }),

  // -----------------------------------------------
  // Read/Unread Helpers
  // -----------------------------------------------

  /**
   * Mark a notification as read by id.
   * @param {string|number} id
   */
  markRead: (id) => {
    const next = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  /**
   * Mark a notification as unread by id.
   * @param {string|number} id
   */
  markUnread: (id) => {
    const next = get().notifications.map((n) =>
      n.id === id ? { ...n, read: false } : n
    );
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  /**
   * Mark all notifications as read.
   */
  markAllRead: () => {
    const next = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: next, unreadCount: 0 });
  },
}));

// -----------------------------------------------
// Selectors for UI hooks
// -----------------------------------------------
export const selectNotifications = (state) => state.notifications;
export const selectUnreadCount = (state) => state.unreadCount;
export const selectNotificationLoading = (state) => state.loading;
export const selectNotificationError = (state) => state.error;

/**
 * Production/Architecture Notes:
 * - All notification state/actions are robust and prepared for backend integration.
 * - No demo/sample logic; fully scalable for real LMS event-driven production.
 */