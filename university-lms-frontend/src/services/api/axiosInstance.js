/**
 * Centralized Axios Instance (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Provides a globally configured Axios instance for API requests.
 * - Sets base URL using env variable or defaults to '/api/v1'
 * - Injects Authorization header from global auth store
 * - Unwraps .data on responses and handles global errors
 * - Includes helpers for token management in localStorage
 * - No demo/sample logic
 */

import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// -----------------------------------------------------------------------------
// Axios Config
// -----------------------------------------------------------------------------
export const API_BASE_URL =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : '/api/v1';

const DEFAULT_TIMEOUT_MS = 20_000; // 20s

// -----------------------------------------------------------------------------
// Token Helpers - for outside Zustand context or SSR hydration
// -----------------------------------------------------------------------------
const TOKEN_KEY = 'access_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore errors (e.g. private mode)
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}

// -----------------------------------------------------------------------------
// Axios Instance
// -----------------------------------------------------------------------------
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------------------
// Request Interceptor: Inject Bearer token from Zustand (global auth store)
// -----------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------------------
// Response Interceptor: Unwrap .data, handle session and network errors
// -----------------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Session/auth & connectivity errors: global handing
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      if (authStore.isAuthenticated) {
        authStore.logout();
      }
      error.message = 'Session expired. Please log in again.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Check your connection and try again.';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

/**
 * Production/Architecture Notes:
 * - All centralized API requests and errors are normalized here.
 * - Auth store integration allows logout/rehydration on critical errors.
 * - Uses '/api/v1' as default route prefix to match backend.
 * - Safe and globally importable for every LMS app/service.
 */