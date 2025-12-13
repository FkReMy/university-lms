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
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

// -------------------------------
// Lazy loaded pages for bundle splitting
// (Update paths to match src/pages file structure!)
// -------------------------------

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// Dashboard pages (pick desired default)
const StudentDashboardPage = lazy(() => import('@/pages/dashboards/StudentDashboard'));
// Or use one dashboard as the default for /
const DashboardPage = StudentDashboardPage; // Change as needed

// Course pages (catalog and detail)
const CoursesPage = lazy(() => import('@/pages/courses/CourseOfferingsPage'));
const CourseDetailPage = lazy(() => import('@/pages/courses/CourseOfferingDetailPage'));

// Assignments and quizzes pages
const AssignmentsPage = lazy(() => import('@/pages/assignments/AssignmentListPage'));
const QuizzesPage = lazy(() => import('@/pages/quizzes/QuizListPage'));

// Grades and profile/settings
const GradesPage = lazy(() => import('@/pages/grading/GradebookPage'));
const SettingsPage = lazy(() => import('@/pages/profile/ProfileSettingsPage'));

// Errors & fallback
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

// -------------------------------
// Helper component for protecting private routes
// Uses authStore for centralized authentication state
// -------------------------------
function RequireAuth({ children, redirectTo = '/login' }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  
  // Show loading state while auth is being checked
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

// -------------------------------
// Routes definition
// -------------------------------
const routes = [
  // -------------------------------------
  // PUBLIC ROUTES
  // -------------------------------------
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
  // -------------------------------------
  // PROTECTED ROUTES (requires authentication)
  // -------------------------------------
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
  // -------------------------------------
  // NOT FOUND / FALLBACK
  // -------------------------------------
  {
    path: '*',
    element: (
      <Suspense fallback={<div>Page not found…</div>}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

export default routes;