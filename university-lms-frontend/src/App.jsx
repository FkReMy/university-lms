import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import AppShell from '@/components/layout/AppShell';
import NotificationCenter from '@/components/notifications/NotificationCenter';

/*
 * App
 * ---------------------------------------------------------------------------
 * Top-level layout used by the router. Responsibilities:
 * - Wrap all routed pages with AppShell (header/sidebar/etc.).
 * - Provide a global notification center (toasts).
 * - Include a skip link for keyboard/screen-reader users.
 * - Wrap routed content in Suspense to support lazy-loaded routes.
 */
function App() {
  return (
    <AppShell>
      {/* Accessible skip link to jump past chrome to main content */}
      <a href="#main-content" className="visually-hidden focusable">
        Skip to main content
      </a>

      {/* Global notification center / toasts */}
      <NotificationCenter />

      {/* Routed content with a simple suspense fallback */}
      <Suspense fallback={<div className="app__loading">Loading…</div>}>
        <main id="main-content">
          <Outlet />
        </main>
      </Suspense>
    </AppShell>
  );
}

export default App;