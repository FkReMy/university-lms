/**
 * useNotificationFeed
 * ----------------------------------------------------------
 * Manages fetching, state, and actions for user's notification feed in the LMS.
 *
 * Responsibilities:
 * - Fetch the user's notification list from the API.
 * - Track read/unread state (client-side, and optionally send updates to the server).
 * - Provide helpers for marking notifications as read, unread, or deleting them.
 * - Expose loading/error state for UI feedback.
 *
 * Notes:
 * - Replace fetch calls with your real API client if needed.
 * - Assumes notifications have { id, message, read, createdAt, ... } shape.
 */

import { useCallback, useEffect, useState } from 'react';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export function useNotificationFeed() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch notifications from API.
   */
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/notifications', { method: 'GET' });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to fetch notifications');
      }
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : data.notifications || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mark a single notification as read (client and server).
   */
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
      });
    } catch {
      // Ignore error; will be refetched on next load
    }
  }, []);

  /**
   * Mark a single notification as unread (client and optionally server).
   */
  const markAsUnread = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
    try {
      await fetch(`/api/notifications/${id}/unread`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
      });
    } catch {
      // Ignore error for now
    }
  }, []);

  /**
   * Delete a notification (client and server).
   */
  const deleteNotification = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: DEFAULT_HEADERS,
      });
    } catch {
      // Ignore error
    }
  }, []);

  /**
   * Mark all notifications as read (client and server).
   */
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    try {
      await fetch('/api/notifications/readall', {
        method: 'POST',
        headers: DEFAULT_HEADERS,
      });
    } catch {
      // Ignore error, server will sync next time
    }
  }, []);

  // Automatically fetch on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,      // array of notifications
    loading,            // boolean, true while fetching
    error,              // error object (or null)
    unreadCount,        // number of unread notifications
    reload: loadNotifications, // function to re-fetch the list

    // mutating actions
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
  };
}