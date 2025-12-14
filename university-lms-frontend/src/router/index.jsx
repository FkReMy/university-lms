/**
 * Main Router Provider (LMS Production Routing)
 * ----------------------------------------------------------------------------
 * Global entry for React Router v6+ using the design system routing tree.
 * - Centralizes all routing, context, guards, and suspense fallback.
 * - No sample/demo code; fallback can be replaced with a global Spinner.
 *
 * Usage:
 *   <RouterProvider /> at the app root (entry point).
 */

import { Suspense } from 'react';
import { RouterProvider as RRRouterProvider, createBrowserRouter } from 'react-router-dom';

// Import global LMS route definitions (array form)
import routes from './routes';

// Build the browser router once globally from the route config
const router = createBrowserRouter(routes);

/**
 * Main RouterProvider component, exported as default.
 * Wrap in root layout for all navigation and context.
 */
export default function RouterProvider() {
  return (
    // Optionally replace with a global <Spinner /> for unified loading UX
    <Suspense fallback={null}>
      <RRRouterProvider router={router} />
    </Suspense>
  );
}

/**
 * Production/Architecture Notes:
 * - All routing is unified under this provider; edit only in one place.
 * - Suspense fallback should use global Spinner/Loader for full-app loading feedback.
 * - No demo/sample fallback; safe for async lazy imports and SSR/SPA hybrid routing.
 */