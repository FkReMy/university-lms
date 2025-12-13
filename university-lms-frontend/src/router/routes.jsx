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

import App from '@/App';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

// -------------------------------
// Lazy loaded pages for bundle splitting
// (Update paths to match src/pages file structure!)
// -------------------------------

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// Dashboard pages (pick desired default)
const StudentDashboardPage = lazy(() => import('@/pages/dashboards/StudentDashboard'));
const ProfessorDashboardPage = lazy(() => import('@/pages/dashboards/ProfessorDashboard'));
const AdminDashboardPage = lazy(() => import('@/pages/dashboards/AdminDashboard'));
// Or use one dashboard as the default for /
const DashboardPage = StudentDashboardPage; // Change as needed

// Course pages (catalog and detail)
const CoursesPage = lazy(() => import('@/pages/courses/CourseOfferingsPage'));
const CourseDetailPage = lazy(() => import('@/pages/courses/CourseOfferingDetailPage'));

// Assignments and quizzes pages
const AssignmentsPage = lazy(() => import('@/pages/assignments/AssignmentListPage'));
const AssignmentSubmissionPage = lazy(() => import('@/pages/assignments/AssignmentSubmissionPage'));
const QuizzesPage = lazy(() => import('@/pages/quizzes/QuizListPage'));
const QuizTakingPage = lazy(() => import('@/pages/quizzes/QuizTakingPage'));

// Grades and profile/settings
const GradesPage = lazy(() => import('@/pages/grading/GradebookPage'));
const SettingsPage = lazy(() => import('@/pages/profile/ProfileSettingsPage'));
const FileLibraryPage = lazy(() => import('@/pages/files/FileLibraryPage'));
const UserManagementPage = lazy(() => import('@/pages/users/UserManagementPage'));
const UserDetailPage = lazy(() => import('@/pages/users/UserDetailPage'));
const DepartmentsPage = lazy(() => import('@/pages/departments/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('@/pages/departments/DepartmentDetailPage'));
const SectionGroupsPage = lazy(() => import('@/pages/sections/SectionGroupsPage'));

// Errors & fallback
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const AccessDeniedPage = lazy(() => import('@/pages/errors/AccessDeniedPage'));

// -------------------------------
// Helper component for protecting private routes
// -------------------------------
function RequireAuth({ children, redirectTo = ROUTES.LOGIN }) {
  const { ready, isAuthenticated } = useAuth();
  if (!ready) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

// -------------------------------
// Routes definition
// -------------------------------
const routes = [
  {
    element: <App />, // App shell overlays notification center, nav, content, etc
    children: [
      // -------------------------------------
      // PUBLIC ROUTES
      // -------------------------------------
      {
        path: ROUTES.LOGIN,
        element: (
          <Suspense fallback={<div>Loading login…</div>}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <Suspense fallback={<div>Loading registration…</div>}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ACCESS_DENIED,
        element: (
          <Suspense fallback={<div>Loading…</div>}>
            <AccessDeniedPage />
          </Suspense>
        ),
      },
      // -------------------------------------
      // PROTECTED ROUTES (requires authentication)
      // -------------------------------------
      {
        index: true,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading dashboard…</div>}>
              <DashboardPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading dashboard…</div>}>
              <DashboardPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/dashboard/professor',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading dashboard…</div>}>
              <ProfessorDashboardPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/dashboard/admin',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading dashboard…</div>}>
              <AdminDashboardPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.COURSES,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading courses…</div>}>
              <CoursesPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.COURSE_DETAIL(),
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading course…</div>}>
              <CourseDetailPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.ASSIGNMENTS,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading assignments…</div>}>
              <AssignmentsPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.ASSIGNMENT_SUBMIT(),
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading submission…</div>}>
              <AssignmentSubmissionPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.QUIZZES,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading quizzes…</div>}>
              <QuizzesPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.QUIZ_TAKE(),
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading quiz…</div>}>
              <QuizTakingPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.GRADES,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading grades…</div>}>
              <GradesPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading settings…</div>}>
              <SettingsPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.FILE_LIBRARY,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading files…</div>}>
              <FileLibraryPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.USERS,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading users…</div>}>
              <UserManagementPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.USER_DETAIL(),
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading user…</div>}>
              <UserDetailPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.DEPARTMENTS,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading departments…</div>}>
              <DepartmentsPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.DEPARTMENT_DETAIL(),
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading department…</div>}>
              <DepartmentDetailPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.SECTIONS,
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading sections…</div>}>
              <SectionGroupsPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.SECTION_GROUPS(),
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading section…</div>}>
              <SectionGroupsPage />
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
    ],
  },
];

export default routes;
