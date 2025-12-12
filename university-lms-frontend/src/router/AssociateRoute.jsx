/**
 * AssociateRoute
 * ----------------------------------------------------------
 * Route guard component for LMS routes that require associate/T.A. access.
 * Redirects users who are not authenticated or do not have the 'associate' or 'ta' role.
 *
 * Usage:
 *   <AssociateRoute>
 *     <TAResources />
 *   </AssociateRoute>
 *
 * Props:
 * - redirectTo (string): path to navigate to if not authorized. Default: '/login'.
 * - children: React node(s) to render if associate/T.A. access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function AssociateRoute({ redirectTo = '/login', children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth state to hydrate
  if (!ready) {
    return <div>Loading…</div>;
  }

  // User not authenticated: redirect to login (preserve from-URL)
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated, but not associate or T.A.: redirect to unauthorized page
  if (!hasAnyRole(['associate', 'ta'])) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Has required role: render children
  return <>{children}</>;
}