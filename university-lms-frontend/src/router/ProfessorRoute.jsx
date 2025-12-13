/**
 * ProfessorRoute
 * ----------------------------------------------------------
 * Route guard component for LMS routes that require professor/instructor access.
 * Redirects users who are not authenticated or do not have the 'professor' or 'instructor' role.
 *
 * Usage:
 *   <ProfessorRoute>
 *     <ProfessorDashboard />
 *   </ProfessorRoute>
 *
 * Props:
 * - redirectTo (string): path to navigate to if not authorized. Default: '/login'.
 * - children: React node(s) to render if professor/instructor access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function ProfessorRoute({ redirectTo = '/login', children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth state; show spinner or loading indicator
  if (!ready) {
    return <div>Loading…</div>;
  }

  // Not authenticated: redirect to login, preserving current location
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated, but not a professor or instructor: redirect to unauthorized page
  if (!hasAnyRole(['professor', 'instructor'])) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Has required role: render children
  return <>{children}</>;
}