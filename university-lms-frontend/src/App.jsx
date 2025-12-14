import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import ErrorBoundary from '@/components/common/ErrorBoundary';     // Global error boundary for all routes
import AppShell from '@/components/layout/AppShell';               // Global, unified app layout (sidebar, topbar, etc.)
import { ROUTES } from '@/lib/constants';                          // Centralized route constants (no magic strings)

/**
 * Production-ready global loading fallback using standardized components/styles.
 */
function LoadingFallback() {
  return (
    <div className="app__loading" role="status" aria-busy="true">
      Loading…
    </div>
  );
}

/**
 * App
 * ---------------------------------------------------------------------------
 * Root of the UI tree. Handles:
 *   - Route-level error boundaries (never let uncaught errors crash the app)
 *   - Global AppShell/layout for all protected/private content
 *   - Minimal wrapper for public/landing-only pages (login, register, access denied, etc.)
 *   - Centralization of Suspense/lazy fallback UI using design system
 *   - Absolutely no demo/sample logic anywhere
 *
 * Assumptions:
 *   - All global components (ErrorBoundary, AppShell, Input, Button, etc.) are available and used throughout.
 *   - Router handles protected/public checks; publicPaths are explicit.
 */
function App() {
  const location = useLocation();

  // Define public-only routes (should match backend/public endpoints)
  const publicPaths = ['/', ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.ACCESS_DENIED];
  const isPublicPage = publicPaths.includes(location.pathname);

  // Public/landing/login/register/access-denied page: just render outlet with error boundary.
  if (isPublicPage) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // All other (protected) pages get global AppShell layout
  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}

export default App;

/**
 * Architectural Notes:
 * - No direct route/page logic or sample data here—only unified routing/layout concerns.
 * - All shared/global UI logic goes in AppShell, ErrorBoundary, and global folder structure.
 * - Loading and fallback states use production-class design or accessible patterns.
 * - Any uncaught error is visually isolated so users do not see blank screens.
 */