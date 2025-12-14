/**
 * User API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Centralizes user management: CRUD, roles, and password operations.
 * - Uses global axios instance for all requests (must be configured for auth).
 * - Parameterized and production ready; no sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const userApi = {
  /**
   * List users with optional filters and pagination.
   * @param {Object} params - { page, limit, search, role }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/users', { params });
  },

  /**
   * Get a single user by ID.
   * @param {string|number} userId
   * @returns {Promise}
   */
  get(userId) {
    return axiosInstance.get(`/users/${userId}`);
  },

  /**
   * Create a new user.
   * @param {Object} payload - { email, firstName, lastName, role, ... }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/users', payload);
  },

  /**
   * Update user details.
   * @param {string|number} userId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(userId, payload) {
    return axiosInstance.put(`/users/${userId}`, payload);
  },

  /**
   * Delete a user by ID.
   * @param {string|number} userId
   * @returns {Promise}
   */
  remove(userId) {
    return axiosInstance.delete(`/users/${userId}`);
  },

  /**
   * Update roles for a user.
   * @param {string|number} userId
   * @param {string[]|string} roles - For setting one or many roles.
   * @returns {Promise}
   */
  updateRoles(userId, roles) {
    return axiosInstance.put(`/users/${userId}/roles`, { roles });
  },

  /**
   * Change user password (optionally for admin-driven resets).
   * @param {string|number} userId
   * @param {Object} payload - { password: 'newPassword' }
   * @returns {Promise}
   */
  changePassword(userId, payload) {
    return axiosInstance.post(`/users/${userId}/password`, payload);
  }
};

export default userApi;

/**
 * Production/Architecture Notes:
 * - Central resource for all user CRUD and admin actions.
 * - All endpoints parameterized for robust backend/production use.
 * - No example/sample data handling.
 */