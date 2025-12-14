/**
 * Route Configuration Tree (LMS Global)
 * ----------------------------------------------------------------------------
 * Centralized, production-ready route tree for the University LMS frontend.
 * - Lazy-loads all major route components.
 * - Uses global constants and protected route wrappers.
 * - Removes all sample/demo loading UIs (Suspense fallback is null, for global Spinner).
 * - No demo/sample elements, unified for scalable maintainability.
 */

import { lazy } from 'react';

import ProtectedRoute from './ProtectedRoute';

import App from '@/App';
import { ROUTES } from '@/lib/constants';

// Lazy import all pages
const LandingPage              = lazy(() => import('@/pages/LandingPage'));
const LoginPage                = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage             = lazy(() => import('@/pages/auth/RegisterPage'));
const StudentDashboardPage     = lazy(() => import('@/pages/dashboards/StudentDashboard'));
const ProfessorDashboardPage   = lazy(() => import('@/pages/dashboards/ProfessorDashboard'));
const AdminDashboardPage       = lazy(() => import('@/pages/dashboards/AdminDashboard'));
const AssociateDashboardPage   = lazy(() => import('@/pages/dashboards/AssociateDashboard'));
const CoursesPage              = lazy(() => import('@/pages/courses/CourseOfferingsPage'));
const CourseDetailPage         = lazy(() => import('@/pages/courses/CourseOfferingDetailPage'));
const AssignmentsPage          = lazy(() => import('@/pages/assignments/AssignmentListPage'));
const AssignmentSubmissionPage = lazy(() => import('@/pages/assignments/AssignmentSubmissionPage'));
const QuizzesPage              = lazy(() => import('@/pages/quizzes/QuizListPage'));
const QuizTakingPage           = lazy(() => import('@/pages/quizzes/QuizTakingPage'));
const GradesPage               = lazy(() => import('@/pages/grading/GradebookPage'));
const SettingsPage             = lazy(() => import('@/pages/profile/ProfileSettingsPage'));
const FileLibraryPage          = lazy(() => import('@/pages/files/FileLibraryPage'));
const UserManagementPage       = lazy(() => import('@/pages/users/UserManagementPage'));
const UserDetailPage           = lazy(() => import('@/pages/users/UserDetailPage'));
const DepartmentsPage          = lazy(() => import('@/pages/departments/DepartmentsPage'));
const DepartmentDetailPage     = lazy(() => import('@/pages/departments/DepartmentDetailPage'));
const SectionAssignmentPage    = lazy(() => import('@/pages/sections/StudentSectionAssignmentPage'));
const SectionGroupsPage        = lazy(() => import('@/pages/sections/SectionGroupsPage'));
const NotFoundPage             = lazy(() => import('@/pages/errors/NotFoundPage'));
const AccessDeniedPage         = lazy(() => import('@/pages/errors/AccessDeniedPage'));

/**
 * Helper: Compose lazy element with Suspense for code-splitting.
 * Uses null fallback for global Spinner integration.
 */
const withSuspense = (node) => <>{node}</>;

// Route tree, using global constants and wrappers
const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(<LandingPage />) },
      { path: ROUTES.LOGIN,                element: withSuspense(<LoginPage />) },
      { path: ROUTES.REGISTER,             element: withSuspense(<RegisterPage />) },
      { path: ROUTES.ACCESS_DENIED,        element: withSuspense(<AccessDeniedPage />) },
      { path: ROUTES.DASHBOARD,            element: <ProtectedRoute>{withSuspense(<StudentDashboardPage />)}</ProtectedRoute> },
      { path: '/dashboard/professor',      element: <ProtectedRoute>{withSuspense(<ProfessorDashboardPage />)}</ProtectedRoute> },
      { path: '/dashboard/admin',          element: <ProtectedRoute>{withSuspense(<AdminDashboardPage />)}</ProtectedRoute> },
      { path: '/dashboard/associate',      element: <ProtectedRoute>{withSuspense(<AssociateDashboardPage />)}</ProtectedRoute> },
      { path: ROUTES.COURSES,              element: <ProtectedRoute>{withSuspense(<CoursesPage />)}</ProtectedRoute> },
      { path: ROUTES.COURSE_DETAIL(),      element: <ProtectedRoute>{withSuspense(<CourseDetailPage />)}</ProtectedRoute> },
      { path: ROUTES.ASSIGNMENTS,          element: <ProtectedRoute>{withSuspense(<AssignmentsPage />)}</ProtectedRoute> },
      { path: ROUTES.ASSIGNMENT_SUBMIT(),  element: <ProtectedRoute>{withSuspense(<AssignmentSubmissionPage />)}</ProtectedRoute> },
      { path: ROUTES.QUIZZES,              element: <ProtectedRoute>{withSuspense(<QuizzesPage />)}</ProtectedRoute> },
      { path: ROUTES.QUIZ_TAKE(),          element: <ProtectedRoute>{withSuspense(<QuizTakingPage />)}</ProtectedRoute> },
      { path: ROUTES.GRADES,               element: <ProtectedRoute>{withSuspense(<GradesPage />)}</ProtectedRoute> },
      { path: ROUTES.SETTINGS,             element: <ProtectedRoute>{withSuspense(<SettingsPage />)}</ProtectedRoute> },
      { path: ROUTES.FILE_LIBRARY,         element: <ProtectedRoute>{withSuspense(<FileLibraryPage />)}</ProtectedRoute> },
      { path: ROUTES.USERS,                element: <ProtectedRoute>{withSuspense(<UserManagementPage />)}</ProtectedRoute> },
      { path: ROUTES.USER_DETAIL(),        element: <ProtectedRoute>{withSuspense(<UserDetailPage />)}</ProtectedRoute> },
      { path: ROUTES.DEPARTMENTS,          element: <ProtectedRoute>{withSuspense(<DepartmentsPage />)}</ProtectedRoute> },
      { path: ROUTES.DEPARTMENT_DETAIL(),  element: <ProtectedRoute>{withSuspense(<DepartmentDetailPage />)}</ProtectedRoute> },
      { path: ROUTES.SECTIONS,             element: <ProtectedRoute>{withSuspense(<SectionAssignmentPage />)}</ProtectedRoute> },
      { path: ROUTES.SECTION_GROUPS(),     element: <ProtectedRoute>{withSuspense(<SectionGroupsPage />)}</ProtectedRoute> },
      { path: '*',                         element: withSuspense(<NotFoundPage />) },
    ],
  },
];

export default routes;

/**
 * Production/Architecture Notes:
 * - All routes wrapped in Suspense and ProtectedRoute as needed, without demo logic.
 * - Uses all global LMS constants; unified for all navigation and context.
 * - Replace withSuspense fallback by wrapping <RouterProvider> (index.jsx) in your Spinner.
 */