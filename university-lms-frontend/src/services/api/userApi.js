import axiosInstance from './axiosInstance';

/**
 * User API client.
 * Centralizes CRUD and role updates for users.
 * Adjust endpoint paths to match your backend.
 */
const userApi = {
  /**
   * List users with optional pagination/filters.
   * @param {Object} params
   * @param {number} [params.page] - Page number (1-based).
   * @param {number} [params.limit] - Page size.
   * @param {string} [params.search] - Name/email search.
   * @param {string} [params.role] - Filter by role (e.g., 'Admin', 'Professor').
   */
  list(params = {}) {
    return axiosInstance.get('/users', { params });
  },

  /**
   * Get a single user by ID.
   */
  get(userId) {
    return axiosInstance.get(`/users/${userId}`);
  },

  /**
   * Create a new user.
   * @param {Object} payload - e.g., { email, firstName, lastName, role, ... }
   */
  create(payload) {
    return axiosInstance.post('/users', payload);
  },

  /**
   * Update an existing user.
   */
  update(userId, payload) {
    return axiosInstance.put(`/users/${userId}`, payload);
  },

  /**
   * Delete a user.
   */
  remove(userId) {
    return axiosInstance.delete(`/users/${userId}`);
  },

  /**
   * Update roles for a user.
   * @param {string|number} userId
   * @param {string[]|string} roles - e.g., ['Admin'] or 'Student'
   */
  updateRoles(userId, roles) {
    return axiosInstance.put(`/users/${userId}/roles`, { roles });
  },

  /**
   * Optional: change password (if your backend supports admin-driven resets).
   */
  changePassword(userId, payload) {
    // payload could be { password: 'newPass123' }
    return axiosInstance.post(`/users/${userId}/password`, payload);
  },
};

export default userApi;