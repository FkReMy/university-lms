import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/global.scss';
import RouterProvider from '@/router';

/*
 * Application entry point
 * ---------------------------------------------------------------------------
 * - Boots the React app into #root.
 * - Uses React.StrictMode for highlighting potential problems in dev.
 * - Wraps the router (RouterProvider) in Suspense so route-level lazy loading can show a fallback.
 * - Assumes that all route imports in routes.jsx are correct; otherwise the app will crash on mount.
 */

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Fail fast with a clear error if the mount point is missing.
  throw new Error('Root element #root not found in index.html');
}

// Create the root (React 18+ API).
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <Suspense fallback={<div className="app__loading">Loading…</div>}>
      <RouterProvider />
    </Suspense>
  </StrictMode>
);

/**
 * NOTES:
 * - This entrypoint assumes that '@/router' exports a valid RouterProvider (e.g., from react-router or your own wrapper).
 * - If your routes.jsx contains unresolved import errors, the app will fail to render on startup and a stack trace will be shown in the console.
 * - Fix all import errors in routes.jsx (see previous diagnostics) to ensure this file works without app-breaking issues.
 * - The Suspense fallback is globally shown only while route-level code/lazy chunks are loaded.
 */