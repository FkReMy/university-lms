/**
 * Route configuration tree for University LMS frontend.
 * ----------------------------------------------------------
 * This file exports a plain array of route objects, intended for use with
 * React Router v6+ (for `createBrowserRouter` or similar).
 * 
 * Keeps routes separated from the main RouterProvider for easier code-splitting,
 * static analysis, and testing. Compose in src/router/index.jsx as needed.
 * 
 * Usage:
 *   import routes from './routes'
 *   createBrowserRouter(routes)
 */

import { lazy, Suspense } from 'react';
import App from '@/App';
import { useAuth } from '@/hooks/useAuth';

// Lazy loaded pages for bundle splitting
const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const CoursesPage = lazy(() => import('@/pages/Courses'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetail'));
const AssignmentsPage = lazy(() => import('@/pages/Assignments'));
const QuizzesPage = lazy(() => import('@/pages/Quizzes'));
const GradesPage = lazy(() => import('@/pages/Grades'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Helper component for protecting private routes
function RequireAuth({ children, redirectTo = '/login' }) {
  const { ready, isAuthenticated } = useAuth();
  if (!ready) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

import { Navigate } from 'react-router-dom';

// Routes definition
const routes = [
  {
    element: <App />, // App shell overlays notification center, nav, content, etc
    children: [
      // Public
      {
        path: '/login',
        element: (
          <Suspense fallback={<div>Loading login…</div>}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<div>Loading registration…</div>}>
            <RegisterPage />
          </Suspense>
        ),
      },

      // Protected (requires authentication)
      {
        path: '/',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading dashboard…</div>}>
              <DashboardPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading dashboard…</div>}>
              <DashboardPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/courses',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading courses…</div>}>
              <CoursesPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/courses/:courseId',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading course…</div>}>
              <CourseDetailPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/assignments',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading assignments…</div>}>
              <AssignmentsPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/quizzes',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading quizzes…</div>}>
              <QuizzesPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/grades',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading grades…</div>}>
              <GradesPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/settings',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading settings…</div>}>
              <SettingsPage />
            </Suspense>
          </RequireAuth>
        ),
      },

      // Not found/fallback
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Page not found…</div>}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;