/**
 * Centralized Axios instance for the LMS frontend.
 * - Sets a base URL from Vite env (VITE_API_BASE_URL) with a sensible fallback.
 * - Injects the Authorization header when a token is available.
 * - Provides small helpers to set/clear/read the token in localStorage.
 * - Normalizes response handling (returns `response.data`).
 * - Surfaces network/timeout errors with clearer messages.
 */

import axios from 'axios';

import { useAuthStore } from '@/store/authStore';

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const DEFAULT_TIMEOUT_MS = 20_000; // adjust as needed

// -----------------------------------------------------------------------------
// Token helpers (lightweight; swap for a more robust auth store if needed)
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
    /* noop */
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}

// -----------------------------------------------------------------------------
// Axios instance
// -----------------------------------------------------------------------------
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  withCredentials: true, // include cookies if your backend uses them; toggle if not needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------------------
// Request interceptor: attach Authorization from authStore if present
// Note: Using getState() to access Zustand store outside React component context
// -----------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from auth store using Zustand's getState() method
    // This is safe to use outside of React components
    const token = useAuthStore.getState().token;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------------------
// Response interceptor: unwrap data and provide clearer errors
// -----------------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      if (authStore.isAuthenticated) {
        authStore.logout();
      }
      error.message = 'Session expired. Please log in again.';
    }
    // Normalize network/timeouts
    else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Check your connection and try again.';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;