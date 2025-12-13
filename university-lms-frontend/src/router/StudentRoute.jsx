/**
 * StudentRoute
 * ----------------------------------------------------------
 * Route guard component for LMS routes that require student access.
 * Redirects users who are not authenticated or do not have the 'student' role.
 *
 * Usage:
 *   <StudentRoute>
 *     <StudentDashboard />
 *   </StudentRoute>
 *
 * Props:
 * - redirectTo (string): path to navigate to if not authorized. Default: '/login'.
 * - children: React node(s) to render if student access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function StudentRoute({ redirectTo = '/login', children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth state to hydrate
  if (!ready) {
    return <div>Loading…</div>;
  }

  // Not authenticated: redirect to login, preserve original location for redirect-after-login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated but not a student: redirect to unauthorized
  if (!hasRole('student')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Has required role: render child components
  return <>{children}</>;
}