/**
 * ProtectedRoute (LMS Production Route Guard)
 * ----------------------------------------------------------------------------
 * Guards LMS routes that require authentication and (optionally) specific roles.
 * - Redirects unauthenticated to login (default or custom path).
 * - Restricts access by role via allowedRoles, using global hooks/constants.
 * - No sample/demo logic; ready for global spinner injection.
 *
 * Usage:
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   <ProtectedRoute allowedRoles={['admin', 'instructor']}><AdminPanel /></ProtectedRoute>
 *
 * Props:
 * - allowedRoles?: string[] — Require user to have at least one matching role.
 * - redirectTo?: string — Path for unauthenticated/unauthorized users (default: ROUTES.LOGIN).
 * - children: ReactNode — Content rendered if access granted.
 */

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { ROUTES } from '@/lib/constants';

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
  children,
}) {
  const { ready, isAuthenticated } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  const location = useLocation();

  // Wait until global auth state is ready; insert global <Spinner/> if desired
  if (!ready) {
    return null;
  }

  // Not authenticated: redirect to login preserving intended location
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // If roles required, check for at least one allowed role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
    }
  }

  // Authorized: render route contents
  return <>{children}</>;
}

/**
 * Production/Architecture Notes:
 * - All redirects and states unified using global LMS constants and hooks.
 * - Demo/sample UI and magic strings removed; ready for production and scaling.
 * - For global loading, inject Spinner as desired when !ready.
 */