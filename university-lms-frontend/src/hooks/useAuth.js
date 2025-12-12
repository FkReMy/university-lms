/**
 * Auth hook for the LMS frontend.
 * ----------------------------------------------------------
 * Responsibilities:
 * - expose the current user, auth status, and token (if stored)
 * - provide login / logout helpers
 * - persist session to localStorage (lightweight client-side state)
 * - offer a ready flag to gate UI while hydrating from storage
 *
 * Notes:
 * - This is a client-side helper only; secure tokens on the server.
 * - Replace fetch implementations with your API client as needed.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'lms.auth.v1';

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  try {
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // noop: storage failures (e.g., quota) are non-fatal
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const isAuthenticated = !!user && !!token;

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const stored = readStoredSession();
    if (stored?.user && stored?.token) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setReady(true);
  }, []);

  /**
   * Example login implementation.
   * Replace the fetch call with your real API client.
   */
  const login = useCallback(async (credentials) => {
    // Sample payload; adjust to your backend contract.
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || 'Login failed');
    }

    const { user: nextUser, token: nextToken } = await res.json();
    setUser(nextUser);
    setToken(nextToken);
    writeStoredSession({ user: nextUser, token: nextToken });
    return nextUser;
  }, []);

  /**
   * Logout clears state and storage. Optionally notify the server.
   */
  const logout = useCallback(async () => {
    try {
      // Optionally call your backend to revoke the session.
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      writeStoredSession(null);
    }
  }, []);

  /**
   * Convenience helper to update the cached user profile
   * (e.g., after profile edits) without re-authenticating.
   */
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      writeStoredSession(next && token ? { user: next, token } : null);
      return next;
    });
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [user, token, ready, isAuthenticated, login, logout, updateUser]
  );

  return value;
}