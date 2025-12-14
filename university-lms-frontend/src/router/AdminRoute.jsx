/**
 * AdminRoute (LMS Production Route Guard)
 * ----------------------------------------------------------------------------
 * Unified route guard for routes requiring "admin" access.
 * - Redirects unauthenticated to login (or other route), and non-admins to /unauthorized.
 * - Uses global auth and role access hooks for consistency.
 * - No sample/demo logic.
 *
 * Props:
 * - redirectTo (string): Path to navigate if not authorized. Default '/login'.
 * - children: ReactNode(s) to render when admin access is granted.
 */

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { ROUTES } from '@/lib/constants';

export default function AdminRoute({ redirectTo = ROUTES.LOGIN, children }) {
  const { ready, isAuthenticated } = useAuth();
  const { hasRole } = useRoleAccess();
  const location = useLocation();

  // Wait for auth state hydration before rendering/checking roles.
  if (!ready) {
    // Optionally use a global Spinner/Loader for unified UX
    return null;
  }

  // If not authenticated, redirect to login (or custom route)
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  // If authenticated but not admin, redirect to unauthorized.
  if (!hasRole('admin')) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
  }

  // Authorized as admin: render children.
  return <>{children}</>;
}

/**
 * Production/Architecture Notes:
 * - Uses centralized hooks and global route constants. No usage of demo/sample logic.
 * - Unified allowed/denied UX throughout all LMS admin routing.
 * - All redirects and checks are type-safe and globally refactorable.
 */