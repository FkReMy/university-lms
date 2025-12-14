import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/global.scss'; // Import global SCSS (tokens, reset, theming)
import RouterProvider from '@/router'; // Main router entry (should always use global AppShell/layout)

/**
 * Application Entry Point
 * ---------------------------------------------------------------------------
 * - Boots the React app into #root.
 * - Enforces React.StrictMode (catches unsafe patterns, highlights issues).
 * - Suspense fallback provides unified loading state for all route/page-level lazy loads.
 * - No sample/demo/data; backend integration assumed.
 * - Fails early if #root mount node missing so broken HTML or misconfiguration is caught instantly.
 * - Assumes all global UI components and layouts are used throughout.
 */

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Immediately fail with a clear message if mounting point is not found.
  throw new Error('Root element #root not found in index.html');
}

// Create the root using React 18+ API.
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <Suspense fallback={<div className="app__loading">Loading…</div>}>
      {/* RouterProvider should always be your global provider, with unified layout and global UI components */}
      <RouterProvider />
    </Suspense>
  </StrictMode>
);

/**
 * Architectural/Production Notes:
 * - No inline demo logic or placeholder code: truly production ready.
 * - All UI logic in routes/pages must use global components for Input, Button, Table, etc.
 * - All errors at this root fail fast: improves deployment safety.
 * - The Suspense fallback ensures unified "Loading…" UX in global style.
 * - For robust error handling, wrap RouterProvider with ErrorBoundary for production.
 */