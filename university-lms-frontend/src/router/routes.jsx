/**
 * Route configuration tree for University LMS frontend.
 */

import { lazy, Suspense } from 'react';

import App from '@/App';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '@/lib/constants';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

const StudentDashboardPage = lazy(() => import('@/pages/dashboards/StudentDashboard'));
const ProfessorDashboardPage = lazy(() => import('@/pages/dashboards/ProfessorDashboard'));
const AdminDashboardPage = lazy(() => import('@/pages/dashboards/AdminDashboard'));
const AssociateDashboardPage = lazy(() => import('@/pages/dashboards/AssociateDashboard'));

const CoursesPage = lazy(() => import('@/pages/courses/CourseOfferingsPage'));
const CourseDetailPage = lazy(() => import('@/pages/courses/CourseOfferingDetailPage'));
const AssignmentsPage = lazy(() => import('@/pages/assignments/AssignmentListPage'));
const AssignmentSubmissionPage = lazy(() => import('@/pages/assignments/AssignmentSubmissionPage'));
const QuizzesPage = lazy(() => import('@/pages/quizzes/QuizListPage'));
const QuizTakingPage = lazy(() => import('@/pages/quizzes/QuizTakingPage'));
const GradesPage = lazy(() => import('@/pages/grading/GradebookPage'));
const SettingsPage = lazy(() => import('@/pages/profile/ProfileSettingsPage'));
const FileLibraryPage = lazy(() => import('@/pages/files/FileLibraryPage'));
const UserManagementPage = lazy(() => import('@/pages/users/UserManagementPage'));
const UserDetailPage = lazy(() => import('@/pages/users/UserDetailPage'));
const DepartmentsPage = lazy(() => import('@/pages/departments/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('@/pages/departments/DepartmentDetailPage'));
const SectionAssignmentPage = lazy(() => import('@/pages/sections/StudentSectionAssignmentPage'));
const SectionGroupsPage = lazy(() => import('@/pages/sections/SectionGroupsPage'));

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const AccessDeniedPage = lazy(() => import('@/pages/errors/AccessDeniedPage'));

const withSuspense = (node, fallback = 'Loading…') => (
  <Suspense fallback={<div>{fallback}</div>}>{node}</Suspense>
);

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(<LandingPage />, 'Loading home…') },
      {
        path: ROUTES.LOGIN,
        element: withSuspense(<LoginPage />, 'Loading login…'),
      },
      {
        path: ROUTES.REGISTER,
        element: withSuspense(<RegisterPage />, 'Loading registration…'),
      },
      {
        path: ROUTES.ACCESS_DENIED,
        element: withSuspense(<AccessDeniedPage />, 'Loading…'),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            {withSuspense(<StudentDashboardPage />, 'Loading dashboard…')}
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/professor',
        element: (
          <ProtectedRoute>
            {withSuspense(<ProfessorDashboardPage />, 'Loading dashboard…')}
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/admin',
        element: (
          <ProtectedRoute>
            {withSuspense(<AdminDashboardPage />, 'Loading dashboard…')}
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/associate',
        element: (
          <ProtectedRoute>
            {withSuspense(<AssociateDashboardPage />, 'Loading dashboard…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.COURSES,
        element: (
          <ProtectedRoute>
            {withSuspense(<CoursesPage />, 'Loading courses…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.COURSE_DETAIL(),
        element: (
          <ProtectedRoute>
            {withSuspense(<CourseDetailPage />, 'Loading course…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ASSIGNMENTS,
        element: (
          <ProtectedRoute>
            {withSuspense(<AssignmentsPage />, 'Loading assignments…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ASSIGNMENT_SUBMIT(),
        element: (
          <ProtectedRoute>
            {withSuspense(<AssignmentSubmissionPage />, 'Loading submission…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QUIZZES,
        element: (
          <ProtectedRoute>
            {withSuspense(<QuizzesPage />, 'Loading quizzes…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QUIZ_TAKE(),
        element: (
          <ProtectedRoute>
            {withSuspense(<QuizTakingPage />, 'Loading quiz…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.GRADES,
        element: (
          <ProtectedRoute>
            {withSuspense(<GradesPage />, 'Loading grades…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute>
            {withSuspense(<SettingsPage />, 'Loading settings…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.FILE_LIBRARY,
        element: (
          <ProtectedRoute>
            {withSuspense(<FileLibraryPage />, 'Loading files…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USERS,
        element: (
          <ProtectedRoute>
            {withSuspense(<UserManagementPage />, 'Loading users…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USER_DETAIL(),
        element: (
          <ProtectedRoute>
            {withSuspense(<UserDetailPage />, 'Loading user…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DEPARTMENTS,
        element: (
          <ProtectedRoute>
            {withSuspense(<DepartmentsPage />, 'Loading departments…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DEPARTMENT_DETAIL(),
        element: (
          <ProtectedRoute>
            {withSuspense(<DepartmentDetailPage />, 'Loading department…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SECTIONS,
        element: (
          <ProtectedRoute>
            {withSuspense(<SectionAssignmentPage />, 'Loading sections…')}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SECTION_GROUPS(),
        element: (
          <ProtectedRoute>
            {withSuspense(<SectionGroupsPage />, 'Loading section…')}
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />, 'Page not found…'),
      },
    ],
  },
];

export default routes;
