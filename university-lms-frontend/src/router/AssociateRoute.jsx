/**
 * AssociateRoute (LMS Production Route Guard)
 * ----------------------------------------------------------------------------
 * Route guard for associate/T.A. access in global LMS routes.
 * - Redirects unauthenticated to login; non-associate/TAs to /access-denied.
 * - Globally unified: uses design system hooks/constants for all checks and redirects.
 * - No sample/demo UI logic.
 *
 * Props:
 * - redirectTo (string): Path for unauthenticated users (default: login route).
 * - children: ReactNode(s) rendered for allowed users.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { ROUTES } from '@/lib/constants';

export default function AssociateRoute({ redirectTo = ROUTES.LOGIN, children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  const location = useLocation();

  // Wait for global auth state to hydrate before enforcing roles
  if (!ready) {
    // Optionally: return null or global <Spinner /> for consistent UX
    return null;
  }

  // Not logged in: redirect to login (preserve redirect intent)
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in but not associate or TA: redirect to standard access-denied route
  if (!hasAnyRole(['associate', 'ta'])) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
  }

  // Allowed: render protected content
  return <>{children}</>;
}

/**
 * Production/Architecture Notes:
 * - All role and navigation logic is global/no sample code, always using LMS hooks/constants.
 * - Ready for any back-end user/role model (role change safe).
 * - Global access-denied consistency across LMS routing.
 */