/**
 * Global Application Constants and Helpers (LMS)
 * ----------------------------------------------------------------------------
 * Centralized, production-ready constants, routes, and helpers for the LMS.
 * - Used globally for navigation, links, guards, and API calls.
 * - No local/sample/demo code.
 */

export const APP_NAME = 'University LMS';

// All top-level and dynamic routes for navigation, guards, and links.
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
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

// Defensive: frozen clone for safe imports
export const ROUTES_FROZEN = Object.freeze({ ...ROUTES });

// Base API endpoint (env override or Vite proxy during local dev only)
export const API_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : '/api';

// API path helper with prefix handling and slash safety
export const apiPath = (path = '') =>
  `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Production/Architecture Notes:
 * - All routes are globally unified—edit here for app-wide consistency.
 * - API helpers never use hardcoded sample/demo paths.
 * - Safe for SSR, SPA, and async API/autogen contracts.
 */