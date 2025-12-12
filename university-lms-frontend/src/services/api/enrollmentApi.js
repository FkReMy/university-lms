import axiosInstance from './axiosInstance';

/**
 * Enrollment API client.
 * Handles enrollments at the offering level (course instance in a specific term).
 * Adjust endpoint paths to match your backend.
 *
 * Suggested backend routes:
 * - GET    /enrollments
 * - POST   /enrollments
 * - GET    /enrollments/:enrollmentId
 * - PUT    /enrollments/:enrollmentId
 * - DELETE /enrollments/:enrollmentId
 *
 * If your backend scopes enrollments under courses/offerings, see courseApi instead.
 */
const enrollmentApi = {
  /**
   * List enrollments with optional pagination/filters.
   * @param {Object} params
   * @param {number} [params.page]     - 1-based page number
   * @param {number} [params.limit]    - page size
   * @param {string} [params.studentId]- filter by student
   * @param {string} [params.courseId] - filter by course
   * @param {string} [params.offeringId]- filter by offering/section
   * @param {string} [params.status]   - e.g., 'enrolled', 'waitlisted', 'dropped'
   */
  list(params = {}) {
    return axiosInstance.get('/enrollments', { params });
  },

  /**
   * Get a single enrollment by ID.
   */
  get(enrollmentId) {
    return axiosInstance.get(`/enrollments/${enrollmentId}`);
  },

  /**
   * Create a new enrollment.
   * @param {Object} payload - e.g., { studentId, courseId, offeringId, status }
   */
  create(payload) {
    return axiosInstance.post('/enrollments', payload);
  },

  /**
   * Update an enrollment (status, metadata, etc.).
   */
  update(enrollmentId, payload) {
    return axiosInstance.put(`/enrollments/${enrollmentId}`, payload);
  },

  /**
   * Delete (or drop) an enrollment.
   */
  remove(enrollmentId) {
    return axiosInstance.delete(`/enrollments/${enrollmentId}`);
  },
};

export default enrollmentApi;