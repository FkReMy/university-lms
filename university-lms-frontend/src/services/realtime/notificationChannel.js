/**
 * Notification channel helper built on top of the WebSocket client.
 *
 * Responsibilities:
 * - Subscribe to "notification" events from the server.
 * - Provide a simple `onNotification` subscription helper.
 * - Provide a `sendNotificationAck` (optional) to acknowledge receipt.
 *
 * Assumptions:
 * - Server sends messages shaped like: { type: "notification", payload: {...} }
 * - The payload can include { id, title, body, level, createdAt, read } etc.
 * - If you need per-user scoping, the backend should authenticate the socket
 *   connection (e.g., via token in headers/query when upgrading).
 *
 * Usage:
 *   import { connectSocket } from './socketClient';
 *   import { onNotification, sendNotificationAck } from './notificationChannel';
 *
 *   connectSocket();
 *   const unsubscribe = onNotification((note) => {
 *     console.log('New notification', note);
 *     sendNotificationAck(note.id);
 *   });
 *
 *   // later
 *   unsubscribe();
 */

import { addListener, removeListener, sendMessage } from './socketClient';

const CHANNEL_TYPE = 'notification';

/**
 * Subscribe to notifications.
 * @param {(notification: any) => void} handler
 * @returns {() => void} unsubscribe function
 */
export function onNotification(handler) {
  addListener(CHANNEL_TYPE, handler);
  return () => removeListener(CHANNEL_TYPE, handler);
}

/**
 * Optional: send an acknowledgment back to the server for a notification.
 * @param {string|number} notificationId
 */
export function sendNotificationAck(notificationId) {
  if (!notificationId) return;
  sendMessage('notification:ack', { notificationId });
}

/**
 * Optional: mark notification as read (depends on backend contract).
 * @param {string|number} notificationId
 */
export function markNotificationRead(notificationId) {
  if (!notificationId) return;
  sendMessage('notification:read', { notificationId });
}