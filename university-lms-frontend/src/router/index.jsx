/**
 * Main Router Provider (index.jsx)
 * ----------------------------------------------------------
 * This module sets up and provides the app-wide router using React Router v6+.
 * - Imports the route tree from routes.jsx for maintainability and code splitting.
 * - Instantiates and exports a component to inject into your main entry (main.jsx).
 * - Keeps all routing logic, route guards, context, and suspense fallback in one place.
 * 
 * Usage:
 *   <RouterProvider /> at the root of your app.
 */

import { Suspense } from 'react';
import { RouterProvider as RRRouterProvider, createBrowserRouter } from 'react-router-dom';

// Centralized route definitions (array of route objects)
// Must export from ./routes.jsx
import routes from './routes';

// Create a browser router from the route config array
const router = createBrowserRouter(routes);

/**
 * Main router provider component.
 * This wraps your app in React Router context.
 * Handles suspense fallback for lazy routes and components.
 */
export default function RouterProvider() {
  return (
    // Suspense ensures lazy route children work everywhere
    <Suspense fallback={<div>Loading app…</div>}>
      <RRRouterProvider router={router} />
    </Suspense>
  );
}