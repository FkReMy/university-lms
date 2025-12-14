/**
 * Grade API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Centralized client for gradebook, grade items, and grade management.
 * - Uses a global axios instance.
 * - Parameterized and production-ready for Python FastAPI/PostgreSQL backend.
 * - No sample/demo logic; all methods ready for real production.
 */

import axiosInstance from './axiosInstance';

const gradeApi = {
  // ===========================================================================
  // Gradebook Overview (course/offering/section)
  // ===========================================================================

  /**
   * Get gradebook: students x grade items for a given scope.
   * @param {Object} params - { courseId, offeringId, sectionId, search }
   * @returns {Promise}
   */
  getGradebook(params = {}) {
    return axiosInstance.get('/grades/gradebook', { params });
  },

  // ===========================================================================
  // Grade Items Management (quizzes/assignments/etc)
  // ===========================================================================

  /**
   * List all grade items for a course/offering/section (assignments/quizzes/etc).
   * @param {Object} params - { courseId, offeringId, sectionId, type }
   * @returns {Promise}
   */
  listItems(params = {}) {
    return axiosInstance.get('/grades/items', { params });
  },

  /**
   * Get a single grade item detail by ID.
   * @param {string|number} itemId
   * @returns {Promise}
   */
  getItem(itemId) {
    return axiosInstance.get(`/grades/items/${itemId}`);
  },

  /**
   * Create a new grade item.
   * @param {Object} payload - { title, maxPoints, weight, type, courseId, offeringId, sectionId, dueDate }
   * @returns {Promise}
   */
  createItem(payload) {
    return axiosInstance.post('/grades/items', payload);
  },

  /**
   * Update a grade item.
   * @param {string|number} itemId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateItem(itemId, payload) {
    return axiosInstance.put(`/grades/items/${itemId}`, payload);
  },

  /**
   * Delete a grade item.
   * @param {string|number} itemId
   * @returns {Promise}
   */
  removeItem(itemId) {
    return axiosInstance.delete(`/grades/items/${itemId}`);
  },

  // ===========================================================================
  // Student Grade Operations (single student-item grade get/set)
  // ===========================================================================

  /**
   * Get a student's grade for a specific grade item.
   * @param {string|number} itemId
   * @param {string|number} studentId
   * @returns {Promise}
   */
  getStudentGrade(itemId, studentId) {
    return axiosInstance.get(`/grades/items/${itemId}/students/${studentId}`);
  },

  /**
   * Set or update a student's grade for a specific item.
   * @param {string|number} itemId
   * @param {string|number} studentId
   * @param {Object} payload - { score, feedback, gradedAt, graderId }
   * @returns {Promise}
   */
  setStudentGrade(itemId, studentId, payload) {
    return axiosInstance.put(
      `/grades/items/${itemId}/students/${studentId}`,
      payload
    );
  },

  // ===========================================================================
  // Bulk Grade Updates (batch for an entire item)
  // ===========================================================================

  /**
   * Bulk update/insert grades for a grade item.
   * @param {string|number} itemId
   * @param {Array} payload - [{ studentId, score, feedback }]
   * @returns {Promise}
   */
  bulkUpdate(itemId, payload) {
    return axiosInstance.post(`/grades/items/${itemId}/bulk`, payload);
  },
};

export default gradeApi;

/**
 * Production/Architecture Notes:
 * - Routes and parameters match real backend models.
 * - No demo/sample logic, only for actual LMS usage.
 * - All usage is centralized and scalable for all frontends.
 */