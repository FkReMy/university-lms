/**
 * Course & Enrollment API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Provides all HTTP actions for course catalog, offerings, and enrollments.
 * - Uses a global axios instance (should be pre-configured for authentication).
 * - Endpoints are fully parameterized and production-ready.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const courseApi = {
  // ===========================================================================
  // Catalog (course definitions)
  // ===========================================================================

  /**
   * List catalog courses with optional filters/search/pagination.
   * @param {Object} params - { page, limit, search, departmentId }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/courses', { params });
  },

  /**
   * Get a single catalog course by ID.
   * @param {string|number} courseId
   * @returns {Promise}
   */
  get(courseId) {
    return axiosInstance.get(`/courses/${courseId}`);
  },

  /**
   * Create a new catalog course.
   * @param {Object} payload - { code, title, credits, departmentId, description }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/courses', payload);
  },

  /**
   * Update a catalog course.
   * @param {string|number} courseId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(courseId, payload) {
    return axiosInstance.put(`/courses/${courseId}`, payload);
  },

  /**
   * Delete a catalog course.
   * @param {string|number} courseId
   * @returns {Promise}
   */
  remove(courseId) {
    return axiosInstance.delete(`/courses/${courseId}`);
  },

  // ===========================================================================
  // Offerings (term-specific instances of a course)
  // ===========================================================================

  /**
   * List offerings for a course, with optional filters.
   * @param {string|number} courseId
   * @param {Object} params - { termId, instructorId, status }
   * @returns {Promise}
   */
  listOfferings(courseId, params = {}) {
    return axiosInstance.get(`/courses/${courseId}/offerings`, { params });
  },

  /**
   * Get a specific offering detail.
   * @param {string|number} courseId
   * @param {string|number} offeringId
   * @returns {Promise}
   */
  getOffering(courseId, offeringId) {
    return axiosInstance.get(`/courses/${courseId}/offerings/${offeringId}`);
  },

  /**
   * Create a new offering under a catalog course.
   * @param {string|number} courseId
   * @param {Object} payload - { termId, instructorId, capacity, schedule, roomId }
   * @returns {Promise}
   */
  createOffering(courseId, payload) {
    return axiosInstance.post(`/courses/${courseId}/offerings`, payload);
  },

  /**
   * Update attributes for an offering.
   * @param {string|number} courseId
   * @param {string|number} offeringId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateOffering(courseId, offeringId, payload) {
    return axiosInstance.put(`/courses/${courseId}/offerings/${offeringId}`, payload);
  },

  /**
   * Delete a course offering.
   * @param {string|number} courseId
   * @param {string|number} offeringId
   * @returns {Promise}
   */
  removeOffering(courseId, offeringId) {
    return axiosInstance.delete(`/courses/${courseId}/offerings/${offeringId}`);
  },

  // ===========================================================================
  // Enrollments (students in a specific offering)
  // ===========================================================================

  /**
   * List enrollments in a specific offering.
   * @param {string|number} courseId
   * @param {string|number} offeringId
   * @param {Object} params - { page, limit, status }
   * @returns {Promise}
   */
  listEnrollments(courseId, offeringId, params = {}) {
    return axiosInstance.get(
      `/courses/${courseId}/offerings/${offeringId}/enrollments`,
      { params }
    );
  },

  /**
   * Enroll student(s) to an offering. Accepts single or bulk student payload.
   * @param {string|number} courseId
   * @param {string|number} offeringId
   * @param {Object|Object[]} payload - { studentId, status } or [{...}]
   * @returns {Promise}
   */
  addEnrollment(courseId, offeringId, payload) {
    return axiosInstance.post(
      `/courses/${courseId}/offerings/${offeringId}/enrollments`,
      payload
    );
  },

  /**
   * Remove an enrollment from an offering.
   * @param {string|number} courseId
   * @param {string|number} offeringId
   * @param {string|number} enrollmentId
   * @returns {Promise}
   */
  removeEnrollment(courseId, offeringId, enrollmentId) {
    return axiosInstance.delete(
      `/courses/${courseId}/offerings/${offeringId}/enrollments/${enrollmentId}`
    );
  },
};

export default courseApi;

/**
 * Production/Architecture Notes:
 * - All route shapes and params are backend-production-ready.
 * - Only import this file (no sample/demo code or responses).
 * - Each section is clearly separated for catalog, offerings, and enrollments.
 */