import axiosInstance, { setAuthToken, clearAuthToken } from './axiosInstance';

/**
 * Auth API wrapper.
 * Centralizes authentication-related endpoints and token handling.
 * Adjust the endpoint paths if your backend differs.
 */
const authApi = {
  /**
   * Log in with credentials.
   * Expects backend to return { accessToken, user }
   */
  async login(credentials) {
    const data = await axiosInstance.post('/auth/login', credentials);
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  /**
   * Refresh the current session (e.g., using a refresh token cookie).
   * Expects backend to return { accessToken, user }
   */
  async refresh() {
    const data = await axiosInstance.post('/auth/refresh');
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  /**
   * Fetch the currently authenticated user profile.
   * Useful for restoring session on page load.
   */
  async getCurrentUser() {
    return axiosInstance.get('/auth/me');
  },

  /**
   * Log out and clear client token.
   * If your backend invalidates refresh tokens via a cookie, keep withCredentials true.
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