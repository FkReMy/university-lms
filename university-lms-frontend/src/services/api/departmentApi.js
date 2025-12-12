import axiosInstance from './axiosInstance';

/**
 * Department & Specialization API client.
 * Adjust endpoint paths to match your backend conventions.
 *
 * Suggested backend routes:
 * - GET    /departments
 * - POST   /departments
 * - GET    /departments/:departmentId
 * - PUT    /departments/:departmentId
 * - DELETE /departments/:departmentId
 * - GET    /departments/:departmentId/specializations
 * - POST   /departments/:departmentId/specializations
 * - PUT    /departments/:departmentId/specializations/:specializationId
 * - DELETE /departments/:departmentId/specializations/:specializationId
 */
const departmentApi = {
  // ---------------------------------------------------------------------------
  // Departments
  // ---------------------------------------------------------------------------

  /**
   * List departments (optionally paginated / searchable).
   * @param {Object} params
   * @param {number} [params.page]   - 1-based page number.
   * @param {number} [params.limit]  - Page size.
   * @param {string} [params.search] - Filter by name/code.
   */
  list(params = {}) {
    return axiosInstance.get('/departments', { params });
  },

  /**
   * Get a single department by ID.
   * @param {string|number} departmentId
   */
  get(departmentId) {
    return axiosInstance.get(`/departments/${departmentId}`);
  },

  /**
   * Create a new department.
   * @param {Object} payload - e.g., { name, code, description }
   */
  create(payload) {
    return axiosInstance.post('/departments', payload);
  },

  /**
   * Update an existing department.
   * @param {string|number} departmentId
   * @param {Object} payload
   */
  update(departmentId, payload) {
    return axiosInstance.put(`/departments/${departmentId}`, payload);
  },

  /**
   * Delete a department.
   * @param {string|number} departmentId
   */
  remove(departmentId) {
    return axiosInstance.delete(`/departments/${departmentId}`);
  },

  // ---------------------------------------------------------------------------
  // Specializations (scoped under a department)
  // ---------------------------------------------------------------------------

  /**
   * List specializations for a department.
   * @param {string|number} departmentId
   * @param {Object} params - optional filters/pagination
   */
  listSpecializations(departmentId, params = {}) {
    return axiosInstance.get(`/departments/${departmentId}/specializations`, {
      params,
    });
  },

  /**
   * Create a specialization within a department.
   * @param {string|number} departmentId
   * @param {Object} payload - e.g., { name, code, description }
   */
  createSpecialization(departmentId, payload) {
    return axiosInstance.post(
      `/departments/${departmentId}/specializations`,
      payload
    );
  },

  /**
   * Update a specialization.
   * @param {string|number} departmentId
   * @param {string|number} specializationId
   * @param {Object} payload
   */
  updateSpecialization(departmentId, specializationId, payload) {
    return axiosInstance.put(
      `/departments/${departmentId}/specializations/${specializationId}`,
      payload
    );
  },

  /**
   * Delete a specialization.
   * @param {string|number} departmentId
   * @param {string|number} specializationId
   */
  removeSpecialization(departmentId, specializationId) {
    return axiosInstance.delete(
      `/departments/${departmentId}/specializations/${specializationId}`
    );
  },
};

export default departmentApi;