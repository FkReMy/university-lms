/**
 * useWebSocket
 * ----------------------------------------------------------
 * React hook for managing a WebSocket connection with auto-reconnect.
 *
 * Responsibilities:
 * - Initiate, close, and auto-reconnect a WebSocket connection.
 * - Expose message, send, and error state for use in components.
 * - Support dependency-based re-connection (URL or options change).
 *
 * Usage:
 *   const { send, lastMessage, readyState, error, close } = useWebSocket(wsUrl, options);
 *
 * Notes:
 * - `wsUrl`: WebSocket endpoint (ws:// or wss://).
 * - `options`: {
 *      onMessage?: (msg) => void,
 *      onOpen?: (ev) => void,
 *      onClose?: (ev) => void,
 *      onError?: (err) => void,
 *      protocols?: string | string[],
 *      autoReconnect?: boolean,
 *      reconnectInterval?: number (ms),
 *   }
 * - Default: auto-reconnect enabled with 2s backoff.
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

  // Use refs for stable instance vars
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnect = useRef(autoReconnect);
  const latestUrl = useRef(wsUrl); // For closures
  const latestOptions = useRef({ protocols });

  // Helper: open a new connection
  const connect = useCallback(() => {
    if (!wsUrl) return;
    if (wsRef.current) {
      wsRef.current.close();
    }
    setError(null);
    setLastMessage(null);

    // Create WebSocket; handle protocols if provided
    const ws = protocols
      ? new window.WebSocket(wsUrl, protocols)
      : new window.WebSocket(wsUrl);
    wsRef.current = ws;
    setReadyState(WebSocket.CONNECTING);

    ws.onopen = (event) => {
      setReadyState(WebSocket.OPEN);
      onOpen && onOpen(event);
    };

    ws.onmessage = (event) => {
      setLastMessage(event.data);
      onMessage && onMessage(event.data, event);
    };

    ws.onerror = (event) => {
      setError(event);
      onError && onError(event);
    };

    ws.onclose = (event) => {
      setReadyState(WebSocket.CLOSED);
      onClose && onClose(event);
      // Auto-reconnect logic
      if (shouldReconnect.current && autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
      }
    };
  }, [wsUrl, protocols, onMessage, onOpen, onClose, onError, autoReconnect, reconnectInterval]);

  // On mount/url/options change: connect
  useEffect(() => {
    shouldReconnect.current = autoReconnect;
    latestUrl.current = wsUrl;
    latestOptions.current = { protocols };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, JSON.stringify(protocols)]);

  // Send a message if socket is open
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

  // Manual close (and cancel auto-reconnect)
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
    send,             // function to send string/buffer data to server
    lastMessage,      // last received message (string/buffer)
    readyState,       // socket state (CONNECTING, OPEN, CLOSING, CLOSED)
    error,            // last error (if any)
    close,            // close the connection and disable auto-reconnect
    reconnecting: readyState === WebSocket.CONNECTING, // boolean
  };
}