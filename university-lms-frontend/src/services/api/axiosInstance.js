/**
 * Axios Instance (Production)
 * ---------------------------
 * Exports a configured axios instance for all API requests,
 * globally using unified versioned API endpoints consistent with backend.
 *
 * - Pulls base URL from .env (VITE_API_BASE_URL), defaults to `/api/v1`
 * - Handles token injection and global error interception (production ready)
 * - No demo/sample code.
 */

import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: Include request interceptor for JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or get from Zustand or context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error handling for auth/logout/etc.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Add global error handling logic if required
    return Promise.reject(error);
  }
);

export default axiosInstance;