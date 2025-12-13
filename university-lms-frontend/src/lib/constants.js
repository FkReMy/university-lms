// Application-wide constants and helpers.
// This refactor preserves the original exports while adding inline documentation
// and a few convenience helpers for consistency.

export const APP_NAME = 'University LMS';

// Centralized route definitions for use across the app (navigation, links, guards).
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  // Use a function so we can easily build specific course detail URLs.
  COURSE_DETAIL: (courseId = ':courseId') => `/courses/${courseId}`,
  GRADES: '/grades',
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_SUBMIT: (assignmentId = ':assignmentId') => `/assignments/${assignmentId}/submit`,
  QUIZZES: '/quizzes',
  QUIZ_TAKE: (quizId = ':quizId') => `/quizzes/${quizId}/take`,
  SETTINGS: '/settings',
  FILE_LIBRARY: '/files',
  USERS: '/users',
  USER_DETAIL: (userId = ':userId') => `/users/${userId}`,
  DEPARTMENTS: '/departments',
  DEPARTMENT_DETAIL: (deptId = ':deptId') => `/departments/${deptId}`,
  SECTIONS: '/sections',
  SECTION_GROUPS: (sectionId = ':sectionId') => `/sections/${sectionId}/groups`,
  ACCESS_DENIED: '/access-denied',
};

// Export a frozen copy for safer imports (optional usage).
export const ROUTES_FROZEN = Object.freeze({ ...ROUTES });

// API base URL falls back to localhost for local development.
// Keep this consistent with your Vite env variable naming.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper to prefix API routes consistently.
export const apiPath = (path = '') =>
  `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
