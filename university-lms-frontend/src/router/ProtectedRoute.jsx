/**
 * ProtectedRoute
 * ----------------------------------------------------------
 * Component for protecting routes in the LMS frontend that require authentication.
 * Optionally supports restricting access by allowed roles.
 *
 * Usage:
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 *
 *   <ProtectedRoute allowedRoles={['admin', 'instructor']}>
 *     <AdminPanel />
 *   </ProtectedRoute>
 *
 * Props:
 * - allowedRoles (array): Only allow users with at least one matching role.
 * - redirectTo (string): Path to send unauthenticated or unauthorized users to. Default: '/login'.
 * - children: The content to render if auth (and role, if present) passes.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/login',
  children,
}) {
  const { ready, isAuthenticated, user } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  const location = useLocation();

  // Wait until auth state is initialized
  if (!ready) {
    return <div>Loading…</div>;
  }

  // Not logged in: redirect to login, preserve path for redirect after login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // If allowedRoles prop provided, check for authorized role(s)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      // Unauthorized: you may want to redirect elsewhere
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Auth + role passes: render contents
  return <>{children}</>;
}