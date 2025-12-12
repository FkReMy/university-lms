/* eslint-disable no-console */
/**
 * Lightweight WebSocket client wrapper for realtime features (notifications, quizzes, etc.).
 *
 * - Uses the Vite env `VITE_WS_BASE_URL` with a sensible fallback.
 * - Exposes connect/close/send helpers.
 * - Provides a simple pub/sub (add/remove listener) for messages.
 * - Handles basic auto-reconnect with backoff (tweak as needed).
 *
 * If you adopt Socket.IO or another client, replace the implementation below
 * but keep the same exported surface so the rest of the app stays unchanged.
 */

const WS_URL = import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:3000';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 1000; // exponential backoff base

// Listener registry keyed by event "type" (string).
const listeners = new Map();

/**
 * Register a handler for a given event type.
 * @param {string} type - e.g., "notification", "quizUpdated"
 * @param {(payload: any, event: MessageEvent) => void} handler
 */
export function addListener(type, handler) {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type).add(handler);
}

/**
 * Remove a handler for an event type.
 */
export function removeListener(type, handler) {
  const set = listeners.get(type);
  if (!set) return;
  set.delete(handler);
  if (set.size === 0) listeners.delete(type);
}

/**
 * Dispatch an incoming message to registered handlers.
 */
function dispatchMessage(event) {
  try {
    const parsed = JSON.parse(event.data);
    const { type, payload } = parsed || {};
    if (!type) return;

    const set = listeners.get(type);
    if (!set) return;

    set.forEach((handler) => {
      try {
        handler(payload, event);
      } catch (err) {
        console.error('[socket] listener error', err);
      }
    });
  } catch (err) {
    console.warn('[socket] failed to parse message', err);
  }
}

/**
 * Create and connect the WebSocket.
 */
export function connectSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return socket;
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    reconnectAttempts = 0;
    console.info('[socket] connected');
  };

  socket.onmessage = dispatchMessage;

  socket.onclose = (event) => {
    console.warn('[socket] closed', event.reason || event.code);
    attemptReconnect();
  };

  socket.onerror = (err) => {
    console.error('[socket] error', err);
    // Let onclose handle reconnect; some browsers call both error and close.
  };

  return socket;
}

/**
 * Attempt to reconnect with exponential backoff.
 */
function attemptReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('[socket] max reconnect attempts reached; giving up.');
    return;
  }
  reconnectAttempts += 1;
  const delay = RECONNECT_BASE_DELAY_MS * 2 ** (reconnectAttempts - 1);
  setTimeout(() => {
    console.info(`[socket] reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
    connectSocket();
  }, delay);
}

/**
 * Close the socket intentionally (no auto-reconnect after manual close).
 */
export function closeSocket() {
  if (socket) {
    socket.onclose = null; // prevent auto-reconnect on manual close
    socket.close();
    socket = null;
  }
}

/**
 * Send a message with a standardized envelope: { type, payload }.
 * @param {string} type
 * @param {any} payload
 */
export function sendMessage(type, payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('[socket] cannot send, socket not open');
    return;
  }
  socket.send(JSON.stringify({ type, payload }));
}

/**
 * Get the current readyState of the socket (or null if not created).
 * @returns {number|null} WebSocket readyState enum or null.
 */
export function getSocketState() {
  return socket ? socket.readyState : null;
}

// Optional: auto-connect on import if you prefer.
// connectSocket();