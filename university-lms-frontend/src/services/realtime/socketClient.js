/**
 * WebSocket Client (LMS Production Realtime Service)
 * ----------------------------------------------------------------------------
 * Provides a global, lightweight pub/sub and send client for all realtime events.
 * - Uses VITE_WS_BASE_URL or falls back to ws://localhost:3000
 * - Exposes connect/close/send helpers, listener registry, and automatic reconnect logic.
 * - No sample/demo code; integrates with any module that imports it.
 *
 * If replaced with Socket.IO or another protocol, keep the interface identical.
 */

const WS_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WS_BASE_URL
  ? import.meta.env.VITE_WS_BASE_URL
  : 'ws://localhost:3000';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 1000; // ms, increases exponentially

// Registry: Map<string, Set<Function>> for event type-based listeners.
const listeners = new Map();

/**
 * Register a handler for a given event type.
 * @param {string} type - Event name, e.g. "notification", "quiz:published"
 * @param {Function} handler - function(payload, event)
 */
export function addListener(type, handler) {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type).add(handler);
}

/**
 * Remove a particular handler for a given event type.
 * @param {string} type
 * @param {Function} handler
 */
export function removeListener(type, handler) {
  const set = listeners.get(type);
  if (!set) return;
  set.delete(handler);
  if (set.size === 0) listeners.delete(type);
}

/**
 * Dispatch an incoming WebSocket message to matching event handlers.
 * @param {MessageEvent} event
 */
function dispatchMessage(event) {
  try {
    const parsed = JSON.parse(event.data);
    const { type, payload } = parsed || {};
    if (!type) return;

    const set = listeners.get(type);
    if (!set) return;
    set.forEach(handler => {
      try {
        handler(payload, event);
      } catch (err) {
        // Avoid crashing all listeners if a handler fails
        // Best practice: centralize logging in a production monitoring system
        // eslint-disable-next-line no-console
        console.error('[socket] listener error', err);
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[socket] failed to parse message', err);
  }
}

/**
 * Initiate the global WebSocket connection (lazily, on first need).
 * @returns {WebSocket}
 */
export function connectSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return socket;
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    reconnectAttempts = 0;
    // eslint-disable-next-line no-console
    console.info('[socket] connected');
  };

  socket.onmessage = dispatchMessage;

  socket.onclose = (event) => {
    // eslint-disable-next-line no-console
    console.warn('[socket] closed', event.reason || event.code);
    attemptReconnect();
  };

  socket.onerror = (err) => {
    // eslint-disable-next-line no-console
    console.error('[socket] error', err);
    // Let onclose handle reconnect (most browsers call both error and close).
  };

  return socket;
}

/**
 * Handles reconnection with exponential backoff, up to a max attempt count.
 */
function attemptReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    // eslint-disable-next-line no-console
    console.error('[socket] max reconnect attempts reached; giving up.');
    return;
  }
  reconnectAttempts += 1;
  const delay = RECONNECT_BASE_DELAY_MS * 2 ** (reconnectAttempts - 1);
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.info(`[socket] reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
    connectSocket();
  }, delay);
}

/**
 * Manually close the socket. No auto-reconnect after manual close.
 */
export function closeSocket() {
  if (socket) {
    socket.onclose = null; // Do not re-trigger reconnect after manual close
    socket.close();
    socket = null;
  }
}

/**
 * Send a message to the server: { type, payload }
 * @param {string} type
 * @param {*} payload
 */
export function sendMessage(type, payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    // eslint-disable-next-line no-console
    console.warn('[socket] cannot send, socket not open');
    return;
  }
  socket.send(JSON.stringify({ type, payload }));
}

/**
 * Get the current readyState of the WebSocket connection.
 * @returns {number|null} WebSocket.readyState or null if not created.
 */
export function getSocketState() {
  return socket ? socket.readyState : null;
}

/**
 * Architecture/Production Notes:
 * - Unified, robust, and can be swapped with alternative implementations if needed.
 * - Designed as a pure singleton global pub/sub socket client for all LMS real-time modules.
 */