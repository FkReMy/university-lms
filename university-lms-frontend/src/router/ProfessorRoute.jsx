/**
 * ProfessorRoute (LMS Production Route Guard)
 * ----------------------------------------------------------------------------
 * Route guard for professor/instructor access in LMS routes.
 * - Redirects unauthenticated users to login; non-professor/instructor users to access-denied.
 * - Uses global LMS auth/role hooks and route constants for unified guard logic.
 * - No sample/demo logic or magic strings.
 *
 * Props:
 * - redirectTo (string): Where unauthenticated users are sent (default: login).
 * - children: Rendered if "professor" or "instructor" access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { ROUTES } from '@/lib/constants';

export default function ProfessorRoute({ redirectTo = ROUTES.LOGIN, children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth state hydration before enforcing access
  if (!ready) {
    // Use a global spinner/loading component for unified design (optional)
    return null;
  }

  // Not authenticated: redirect to login (preserve intended route)
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated but not a professor/instructor: redirect to access denied (global constant)
  if (!hasAnyRole(['professor', 'instructor'])) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
  }

  // Authorized: render protected content
  return <>{children}</>;
}

/**
 * Production/Architecture Notes:
 * - All navigation and guards are unified using LMS constants and hooks.
 * - No sample/demo UI. Full consistency for all restricted professor/instructor routes.
 * - Modifications only needed for global role/route policy changes.
 */