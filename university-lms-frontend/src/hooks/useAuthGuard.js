/**
 * Route guard hook for the LMS frontend.
 * ----------------------------------------------------------
 * Responsibilities:
 * - Redirect unauthenticated users to a login (or custom) route.
 * - Optionally gate routes by allowed roles.
 * - Expose booleans so components can conditionally render while the guard settles.
 *
 * Usage examples:
 *   const { ready, isAllowed } = useAuthGuard();
 *   if (!ready) return <Spinner />;
 *   if (!isAllowed) return null; // or a fallback
 *
 *   // Role-restricted route:
 *   useAuthGuard({ allowedRoles: ['admin', 'instructor'] });
 */

import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '@/lib/constants';

/**
 * @param {Object} options
 * @param {boolean} [options.requireAuth=true]   - If true, redirect when not authenticated.
 * @param {string}  [options.redirectTo=ROUTES.LOGIN] - Path to send unauthenticated users.
 * @param {string[]} [options.allowedRoles]      - If provided, require user role to match.
 */
export function useAuthGuard({
  requireAuth = true,
  redirectTo = ROUTES.LOGIN,
  allowedRoles,
} = {}) {
  const { ready, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role check supports either `user.role` or `user.roles` array.
  const hasAllowedRole = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!user) return false;
    const { role, roles = [] } = user;
    return allowedRoles.some(
      (allowed) => role === allowed || roles.includes(allowed)
    );
  }, [allowedRoles, user]);

  const isAllowed = useMemo(() => {
    if (!requireAuth) return true; // public route
    return isAuthenticated && hasAllowedRole;
  }, [requireAuth, isAuthenticated, hasAllowedRole]);

  useEffect(() => {
    if (!ready) return; // wait for hydration
    if (requireAuth && !isAllowed) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location }, // preserve intent for post-login redirect
      });
    }
  }, [ready, requireAuth, isAllowed, navigate, redirectTo, location]);

  return {
    ready,           // whether auth state is hydrated
    isAuthenticated, // boolean
    isAllowed,       // boolean (auth + role)
    hasAllowedRole,  // boolean (role-only)
    user,            // current user (may be null)
  };
}