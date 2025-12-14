/**
 * useAuth Hook (LMS)
 * ----------------------------------------------------------------------------
 * Centralizes authentication state for LMS frontend using Zustand.
 * - Provides user, token, loading, auth, ready, and error state.
 * - Persists/restores session from localStorage via hydrate action.
 * - Exposes login, logout, updateUser helpers unified for global UI.
 * - All logic is production/clean; no sample/demo logic.
 *
 * Usage:
 *   const { user, token, isAuthenticated, ready, login, ... } = useAuth();
 *   // All values always "ready" upon hydrate
 */

import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store/authStore'; // Design system-wide auth state

export function useAuth() {
  // Pull only needed stable fields/actions from the global store.
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

  // On mount (or after reload), hydrate localStorage/session from store if not ready
  useEffect(() => {
    if (!ready) {
      hydrate();
    }
  }, [hydrate, ready]);

  // Provide a memoized object for stability in UI renders
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

/**
 * Production/Architecture Notes:
 * - Hook is unified/global: integrates with Zustand authStore and single hydration flow.
 * - No local/sample/demo logic; ready for backend token and user contract.
 * - UI can always safely gate on ready/isAuthenticated.
 * - Swap fetch/client in login/logout/updateUser as needed for production API.
 */