/**
 * useWebSocket (LMS Production Hook)
 * ----------------------------------------------------------------------------
 * Hook for managing (and auto-reconnecting) a WebSocket connection in LMS UI.
 * - Supports dependency-driven reconnection, error/close/open events, and protocol negotiation.
 * - Exposes `.send`, `.close`, `.lastMessage`, `.error`, `.readyState` for unified component logic.
 * - No sample/demo code; all logic production-grade.
 *
 * Usage:
 *   const { send, lastMessage, readyState, error, close, reconnecting } = useWebSocket(wsUrl, options);
 *
 * wsUrl: string (ws:// or wss://)
 * options: {
 *   onMessage?: (msg, event) => void,
 *   onOpen?: (ev) => void,
 *   onClose?: (ev) => void,
 *   onError?: (err) => void,
 *   protocols?: string | string[],
 *   autoReconnect?: boolean,
 *   reconnectInterval?: number,
 * }
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_RECONNECT_INTERVAL = 2000;

export function useWebSocket(
  wsUrl,
  {
    onMessage,
    onOpen,
    onClose,
    onError,
    protocols,
    autoReconnect = true,
    reconnectInterval = DEFAULT_RECONNECT_INTERVAL,
  } = {}
) {
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [error, setError] = useState(null);

  // Refs for stable variables across renders
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnect = useRef(autoReconnect);

  /**
   * Open a WebSocket connection; assign handlers (auto-reconnect if enabled).
   */
  const connect = useCallback(() => {
    if (!wsUrl) return;
    if (wsRef.current) {
      wsRef.current.close();
    }
    setError(null);
    setLastMessage(null);

    // Instantiate WebSocket with protocols if provided
    const ws = protocols
      ? new window.WebSocket(wsUrl, protocols)
      : new window.WebSocket(wsUrl);
    wsRef.current = ws;
    setReadyState(WebSocket.CONNECTING);

    ws.onopen = (event) => {
      setReadyState(WebSocket.OPEN);
      if (onOpen) onOpen(event);
    };

    ws.onmessage = (event) => {
      setLastMessage(event.data);
      if (onMessage) onMessage(event.data, event);
    };

    ws.onerror = (event) => {
      setError(event);
      if (onError) onError(event);
    };

    ws.onclose = (event) => {
      setReadyState(WebSocket.CLOSED);
      if (onClose) onClose(event);
      // Auto-reconnect, unless intentionally closed
      if (shouldReconnect.current && autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
      }
    };
  }, [wsUrl, protocols, onMessage, onOpen, onClose, onError, autoReconnect, reconnectInterval]);

  /**
   * Open connection on mount or wsUrl/protocol change; cleanup on unmount.
   */
  useEffect(() => {
    shouldReconnect.current = autoReconnect;
    connect();

    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
    // Only refire if wsUrl, protocols, or core handlers change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, JSON.stringify(protocols), connect, autoReconnect, reconnectInterval]);

  /**
   * Send data if the socket is open.
   */
  const send = useCallback(
    (data) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(data);
      } else {
        throw new Error('WebSocket is not open');
      }
    },
    []
  );

  /**
   * Close connection (and prevent auto-reconnect).
   */
  const close = useCallback(() => {
    shouldReconnect.current = false;
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  return {
    send,                    // function: send data to server
    lastMessage,             // last received event.data (string or buffer)
    readyState,              // socket state (CONNECTING, OPEN, CLOSING, CLOSED)
    error,                   // error event, if any
    close,                   // close connection, cancel reconnects
    reconnecting: readyState === WebSocket.CONNECTING, // is attempting (re)connect?
  };
}

/**
 * Production/Architecture Notes:
 * - No local/sample/demonstrative code; simply wrap for backend-driven/async UI.
 * - All protocols, handlers, and error/close semantics are global-utility ready.
 * - Handles auto-reconnect (default: 2s), or opt-out for critical UI flows.
 */