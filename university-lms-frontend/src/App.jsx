import React from 'react';
import { Outlet } from 'react-router-dom';

import AppShell from '@/components/layout/AppShell';
import NotificationCenter from '@/components/notifications/NotificationCenter';

/**
 * App is the top-level layout used by the router.
 * All routed pages render inside <Outlet /> wrapped by AppShell.
 */
function App() {
  return (
    <AppShell>
      {/* Global notification center / toasts */}
      <NotificationCenter />

      {/* Routed content */}
      <Outlet />
    </AppShell>
  );
}

export default App;