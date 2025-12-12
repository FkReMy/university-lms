/**
 * AdminRoute
 * ----------------------------------------------------------
 * Route guard component for LMS routes that require admin access.
 * Redirects users who are not authenticated or do not have the 'admin' role.
 *
 * Usage:
 *   <AdminRoute>
 *     <AdminDashboard />
 *   </AdminRoute>
 *
 * Props:
 * - redirectTo (string): path to navigate to if not authorized. Default: '/login'.
 * - children: React node(s) to render if admin access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function AdminRoute({ redirectTo = '/login', children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth state hydration
  if (!ready) {
    return <div>Loading…</div>;
  }

  // User not authenticated: redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // User authenticated but not admin: redirect to unauthorized page (optionally customize)
  if (!hasRole('admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is admin: render children
  return <>{children}</>;
}