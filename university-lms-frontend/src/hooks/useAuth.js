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

import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const {
    user,
    token,
    ready,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUser,
    hydrate,
  } = useAuthStore(useShallow((state) => ({
    user: state.user,
    token: state.token,
    ready: state.ready,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
    hydrate: state.hydrate,
  })));

  useEffect(() => {
    if (!ready) {
      hydrate();
    }
  }, [hydrate, ready]);

  return useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      updateUser,
    }),
    [user, token, ready, isAuthenticated, loading, error, login, logout, updateUser]
  );
}
