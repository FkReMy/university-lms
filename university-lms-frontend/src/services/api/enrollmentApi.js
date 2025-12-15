/**
 * Enrollment API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Handles enrollments at the offering level (global instance for all frontend usage).
 * - All endpoints parameterized for production FastAPI/PostgreSQL backend.
 * - Uses a global axios instance, globally-authenticated.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const enrollmentApi = {
  /**
   * List enrollments with optional pagination/filtering.
   * @param {Object} params - { page, limit, studentId, courseId, offeringId, status }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/enrollments', { params });
  },

  /**
   * List enrollments for a specific student/user.
   * @param {string|number} studentId
   * @returns {Promise}
   */
  listForUser(studentId) {
    return this.list({ studentId });
  },

  /**
   * Get details for a single enrollment by ID.
   * @param {string|number} enrollmentId
   * @returns {Promise}
   */
  get(enrollmentId) {
    return axiosInstance.get(`/enrollments/${enrollmentId}`);
  },

  /**
   * Create a new enrollment.
   * @param {Object} payload - { studentId, courseId, offeringId, status }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/enrollments', payload);
  },

  /**
   * Update an existing enrollment (status, metadata, etc).
   * @param {string|number} enrollmentId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(enrollmentId, payload) {
    return axiosInstance.put(`/enrollments/${enrollmentId}`, payload);
  },

  /**
   * Delete (drop) an enrollment.
   * @param {string|number} enrollmentId
   * @returns {Promise}
   */
  remove(enrollmentId) {
    return axiosInstance.delete(`/enrollments/${enrollmentId}`);
  }
};

export default enrollmentApi;

/**
 * Production/Architecture Notes:
 * - All endpoints are parameterized, no hardcoded sample logic.
 * - Use this API for global enrollment; for course-scoped enrollments, see courseApi.
 * - All network logic uses the global, authenticated axios instance.
 */