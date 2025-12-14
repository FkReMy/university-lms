/**
 * NotificationChannel (LMS Production Real-Time Notifications)
 * ----------------------------------------------------------------------------
 * Provides pub/sub helpers over global WebSocket for all notification events.
 * - Subscribes to 'notification' event type; backend must emit properly shaped objects.
 * - Exposes unified handlers for: subscribe, acknowledge, and (optionally) mark-as-read.
 * - All code is unified, scalable, and production-ready (no sample/demo logic).
 *
 * Usage:
 *   import { connectSocket } from './socketClient';
 *   import { onNotification, sendNotificationAck, markNotificationRead } from './notificationChannel';
 *   connectSocket();
 *   const unsubscribe = onNotification(notification => {
 *      // handle notification
 *      sendNotificationAck(notification.id);
 *   });
 *   // Later: unsubscribe();
 */

import { addListener, removeListener, sendMessage } from './socketClient';

const CHANNEL_TYPE = 'notification';

/**
 * Subscribe to new notification messages.
 * @param {(notification: object) => void} handler - Notification event callback
 * @returns {() => void} Unsubscribe function
 */
export function onNotification(handler) {
  addListener(CHANNEL_TYPE, handler);
  return () => removeListener(CHANNEL_TYPE, handler);
}

/**
 * Send an acknowledgment for a notification (to inform server it was received).
 * @param {string|number} notificationId
 */
export function sendNotificationAck(notificationId) {
  if (!notificationId) return;
  sendMessage('notification:ack', { notificationId });
}

/**
 * Mark a notification as read (contract depends on backend).
 * @param {string|number} notificationId
 */
export function markNotificationRead(notificationId) {
  if (!notificationId) return;
  sendMessage('notification:read', { notificationId });
}

/**
 * Production/Architecture Notes:
 * - All usage is via global WebSocket event names and message shapes.
 * - All functions are idempotent and safe for real-time operation at scale.
 */