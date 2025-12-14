/**
 * Auth API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Centralized authentication API wrapper for all user session operations.
 * - Handles login, logout, refresh, and current profile retrieval.
 * - Integrates global axios instance and token utilities.
 * - All endpoints parameterized and ready for real backend use.
 * - No sample/demo logic.
 */

import axiosInstance, { setAuthToken, clearAuthToken } from './axiosInstance';

const authApi = {
  /**
   * Log in with supplied user credentials.
   * Expects backend to return { accessToken, user } on success.
   * @param {Object} credentials - { username/email, password }
   * @returns {Promise<Object>} response data
   */
  async login(credentials) {
    const data = await axiosInstance.post('/auth/login', credentials);
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  /**
   * Refresh authentication (e.g. with httpOnly refresh token cookie).
   * Expects backend to return { accessToken, user }.
   * @returns {Promise<Object>} response data
   */
  async refresh() {
    const data = await axiosInstance.post('/auth/refresh');
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  /**
   * Get the currently authenticated user profile (for session restore).
   * @returns {Promise<Object>} user data or null if not authenticated
   */
  async getCurrentUser() {
    return axiosInstance.get('/auth/me');
  },

  /**
   * Log out user and clear client auth token.
   * Backend should invalidate refresh tokens as appropriate.
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      clearAuthToken();
    }
  },
};

export default authApi;

/**
 * Production/Architecture Notes:
 * - All API calls are parameterized and connect directly to backend endpoints.
 * - setAuthToken/clearAuthToken are global, must be kept in sync with auth logic.
 * - No sample code; all usage is safe for production sessions.
 */