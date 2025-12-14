/**
 * StudentRoute (LMS Production Route Guard)
 * ----------------------------------------------------------------------------
 * Route guard for student-specific routes in the LMS.
 * - Redirects unauthenticated users to login.
 * - Restricts access to users with the 'student' role, otherwise redirects to a global access denied route.
 * - Uses unified global hooks and constants. No sample/demo logic.
 *
 * Props:
 * - redirectTo (string): Path for unauthenticated users (default: login).
 * - children: Rendered if student access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { ROUTES } from '@/lib/constants';

export default function StudentRoute({ redirectTo = ROUTES.LOGIN, children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth (hydration) before enforcing access
  if (!ready) {
    // Optionally insert global spinner/loading indicator
    return null;
  }

  // Not authenticated: redirect to login (preserve original location)
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated but not a student: redirect to access denied
  if (!hasRole('student')) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
  }

  // Student authorized: render children
  return <>{children}</>;
}

/**
 * Production/Architecture Notes:
 * - Uses all global LMS hooks/constants and no magic strings.
 * - No sample/demo UI, ready for global loading or access denied integration.
 * - Safe for scaling to all real production role-based policies.
 */