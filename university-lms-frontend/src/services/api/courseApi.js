import axiosInstance from './axiosInstance';

/**
 * Course & enrollment API client.
 * Adjust endpoint paths to match your backend.
 *
 * Suggested backend routes:
 * - GET    /courses                     (catalog list)
 * - POST   /courses                     (create catalog entry)
 * - GET    /courses/:courseId           (catalog detail)
 * - PUT    /courses/:courseId           (update catalog entry)
 * - DELETE /courses/:courseId           (delete catalog entry)
 *
 * - GET    /courses/:courseId/offerings                (list offerings)
 * - POST   /courses/:courseId/offerings                (create offering)
 * - GET    /courses/:courseId/offerings/:offeringId    (get offering)
 * - PUT    /courses/:courseId/offerings/:offeringId    (update offering)
 * - DELETE /courses/:courseId/offerings/:offeringId    (delete offering)
 *
 * - GET    /courses/:courseId/offerings/:offeringId/enrollments
 * - POST   /courses/:courseId/offerings/:offeringId/enrollments
 * - DELETE /courses/:courseId/offerings/:offeringId/enrollments/:enrollmentId
 */
const courseApi = {
  // ---------------------------------------------------------------------------
  // Catalog (course definitions)
  // ---------------------------------------------------------------------------

  /**
   * List catalog courses with optional filters.
   * @param {Object} params
   * @param {number} [params.page]   - 1-based page number.
   * @param {number} [params.limit]  - Page size.
   * @param {string} [params.search] - Filter by code/title.
   * @param {string} [params.departmentId] - Filter by department.
   */
  list(params = {}) {
    return axiosInstance.get('/courses', { params });
  },

  /**
   * Get a single catalog course.
   */
  get(courseId) {
    return axiosInstance.get(`/courses/${courseId}`);
  },

  /**
   * Create a catalog course.
   * @param {Object} payload - e.g., { code, title, credits, departmentId, description }
   */
  create(payload) {
    return axiosInstance.post('/courses', payload);
  },

  /**
   * Update a catalog course.
   */
  update(courseId, payload) {
    return axiosInstance.put(`/courses/${courseId}`, payload);
  },

  /**
   * Delete a catalog course.
   */
  remove(courseId) {
    return axiosInstance.delete(`/courses/${courseId}`);
  },

  // ---------------------------------------------------------------------------
  // Offerings (term-specific instances of a course)
  // ---------------------------------------------------------------------------

  /**
   * List offerings for a course.
   * @param {string|number} courseId
   * @param {Object} params - e.g., { termId, instructorId, status }
   */
  listOfferings(courseId, params = {}) {
    return axiosInstance.get(`/courses/${courseId}/offerings`, { params });
  },

  /**
   * Get a specific offering.
   */
  getOffering(courseId, offeringId) {
    return axiosInstance.get(`/courses/${courseId}/offerings/${offeringId}`);
  },

  /**
   * Create a new offering for a course.
   * @param {Object} payload - e.g., { termId, instructorId, capacity, schedule, roomId }
   */
  createOffering(courseId, payload) {
    return axiosInstance.post(`/courses/${courseId}/offerings`, payload);
  },

  /**
   * Update an offering.
   */
  updateOffering(courseId, offeringId, payload) {
    return axiosInstance.put(
      `/courses/${courseId}/offerings/${offeringId}`,
      payload
    );
  },

  /**
   * Delete an offering.
   */
  removeOffering(courseId, offeringId) {
    return axiosInstance.delete(`/courses/${courseId}/offerings/${offeringId}`);
  },

  // ---------------------------------------------------------------------------
  // Enrollments (students in a specific offering)
  // ---------------------------------------------------------------------------

  /**
   * List enrollments for an offering.
   * @param {Object} params - e.g., { page, limit, status }
   */
  listEnrollments(courseId, offeringId, params = {}) {
    return axiosInstance.get(
      `/courses/${courseId}/offerings/${offeringId}/enrollments`,
      { params }
    );
  },

  /**
   * Enroll a student (or multiple) into an offering.
   * @param {Object|Object[]} payload - e.g., { studentId, status } or [{...}, {...}]
   */
  addEnrollment(courseId, offeringId, payload) {
    return axiosInstance.post(
      `/courses/${courseId}/offerings/${offeringId}/enrollments`,
      payload
    );
  },

  /**
   * Remove an enrollment.
   */
  removeEnrollment(courseId, offeringId, enrollmentId) {
    return axiosInstance.delete(
      `/courses/${courseId}/offerings/${offeringId}/enrollments/${enrollmentId}`
    );
  },
};

export default courseApi;