/**
 * useAuthGuard Hook (LMS)
 * ----------------------------------------------------------------------------
 * Global/production route guard for React Router, authenticated LMS flows.
 * - Redirects unauthenticated users (optionally role-restricted) to a login or custom route using navigate.
 * - Tracks both authentication and roles (including user.role and user.roles[] patterns).
 * - All logic is scalable, backend-ready – no sample/demo code.
 *
 * Usage:
 *   const { ready, isAllowed } = useAuthGuard();
 *   if (!ready) return <Spinner />;
 *   if (!isAllowed) return null; // or an access-fallback
 *
 *   // Role-based:
 *   useAuthGuard({ allowedRoles: ["admin"] });
 */

import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from './useAuth';

import { ROUTES } from '@/lib/constants';

/**
 * @param {Object} options
 * @param {boolean} [options.requireAuth=true]   - Redirect when not authenticated (default: true)
 * @param {string} [options.redirectTo=ROUTES.LOGIN] - Destination for unauthenticated users
 * @param {string[]} [options.allowedRoles]      - Restrict route to one or more allowed roles
 */
export function useAuthGuard({
  requireAuth = true,
  redirectTo = ROUTES.LOGIN,
  allowedRoles,
} = {}) {
  const { ready, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role check: supports both user.role (string) and user.roles (array)
  const hasAllowedRole = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) return true; // no restriction
    if (!user) return false;
    const { role, roles = [] } = user;
    return allowedRoles.some(
      (allowed) => role === allowed || roles.includes(allowed)
    );
  }, [allowedRoles, user]);

  // Can user access route? (auth + role)
  const isAllowed = useMemo(() => {
    if (!requireAuth) return true;
    return isAuthenticated && hasAllowedRole;
  }, [requireAuth, isAuthenticated, hasAllowedRole]);

  // Redirect user if not allowed (wait for hydration)
  useEffect(() => {
    if (!ready) return;
    if (requireAuth && !isAllowed) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location }, // for post-login intent redirect
      });
    }
  }, [ready, requireAuth, isAllowed, navigate, redirectTo, location]);

  return {
    ready,             // Hydration status (true after store loads)
    isAuthenticated,   // Boolean auth status
    isAllowed,         // Boolean auth+role status
    hasAllowedRole,    // Boolean role-match status
    user,              // Current user object, may be null
  };
}

/**
 * Production/Architecture Notes:
 * - No local/sample/demo logic; ready for all dynamic routes and auth flows.
 * - Works with global design system auth store via useAuth.
 * - Can guard both open/public and strict role-locked routes with no code duplication.
 */