import React, { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/global.scss';
import RouterProvider from '@/router';

/*
 * Application entry point
 * ---------------------------------------------------------------------------
 * - Boots the React app into #root.
 * - Uses React.StrictMode for highlighting potential problems in dev.
 * - Wraps the router in Suspense so route-level lazy loading can show a fallback.
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