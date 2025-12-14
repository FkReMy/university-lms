/**
 * Department & Specialization API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Provides HTTP actions for department and specialization management.
 * - Uses a global axios instance (should be configured with auth).
 * - Endpoints are parameterized and ready for backend-integration.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const departmentApi = {
  // ===========================================================================
  // Departments
  // ===========================================================================

  /**
   * List departments (optionally paginated/searchable).
   * @param {Object} params - { page, limit, search }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/departments', { params });
  },

  /**
   * Get a single department by ID.
   * @param {string|number} departmentId
   * @returns {Promise}
   */
  get(departmentId) {
    return axiosInstance.get(`/departments/${departmentId}`);
  },

  /**
   * Create a new department.
   * @param {Object} payload - { name, code, description }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/departments', payload);
  },

  /**
   * Update an existing department.
   * @param {string|number} departmentId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(departmentId, payload) {
    return axiosInstance.put(`/departments/${departmentId}`, payload);
  },

  /**
   * Delete a department.
   * @param {string|number} departmentId
   * @returns {Promise}
   */
  remove(departmentId) {
    return axiosInstance.delete(`/departments/${departmentId}`);
  },

  // ===========================================================================
  // Specializations (scoped under department)
  // ===========================================================================

  /**
   * List specializations for a given department.
   * @param {string|number} departmentId
   * @param {Object} params - optional filters/pagination
   * @returns {Promise}
   */
  listSpecializations(departmentId, params = {}) {
    return axiosInstance.get(`/departments/${departmentId}/specializations`, { params });
  },

  /**
   * Create a specialization in a department.
   * @param {string|number} departmentId
   * @param {Object} payload - { name, code, description }
   * @returns {Promise}
   */
  createSpecialization(departmentId, payload) {
    return axiosInstance.post(
      `/departments/${departmentId}/specializations`,
      payload
    );
  },

  /**
   * Update a specialization in a department.
   * @param {string|number} departmentId
   * @param {string|number} specializationId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateSpecialization(departmentId, specializationId, payload) {
    return axiosInstance.put(
      `/departments/${departmentId}/specializations/${specializationId}`,
      payload
    );
  },

  /**
   * Delete a specialization from a department.
   * @param {string|number} departmentId
   * @param {string|number} specializationId
   * @returns {Promise}
   */
  removeSpecialization(departmentId, specializationId) {
    return axiosInstance.delete(
      `/departments/${departmentId}/specializations/${specializationId}`
    );
  }
};

export default departmentApi;

/**
 * Production/Architecture Notes:
 * - All endpoints and fields are fully backend-ready and parameterized.
 * - Import globally to manage departments and specializations.
 * - Separates management of departments and their nested specializations.
 */