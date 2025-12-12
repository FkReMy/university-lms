import axiosInstance from './axiosInstance';

/**
 * Grade API client.
 * Handles gradebook views, grade items (e.g., quizzes/assignments), and grade updates.
 * Adjust endpoint paths to match your backend routing.
 *
 * Suggested backend routes (example):
 * - Gradebook (per offering/section):
 *   GET /grades/gradebook?courseId=&offeringId=&sectionId=
 *
 * - Grade items (e.g., per quiz/assignment):
 *   GET    /grades/items
 *   POST   /grades/items
 *   GET    /grades/items/:itemId
 *   PUT    /grades/items/:itemId
 *   DELETE /grades/items/:itemId
 *
 * - Student grades:
 *   GET    /grades/items/:itemId/students/:studentId
 *   PUT    /grades/items/:itemId/students/:studentId   (set/override grade)
 *
 * - Bulk updates:
 *   POST   /grades/items/:itemId/bulk                  (array of { studentId, score, feedback })
 */
const gradeApi = {
  // ---------------------------------------------------------------------------
  // Gradebook (overview for a course/offering/section)
  // ---------------------------------------------------------------------------

  /**
   * Fetch gradebook data (rows = students, columns = grade items).
   * @param {Object} params
   * @param {string|number} [params.courseId]
   * @param {string|number} [params.offeringId]
   * @param {string|number} [params.sectionId]
   * @param {string} [params.search] - optional search on student name/id
   */
  getGradebook(params = {}) {
    return axiosInstance.get('/grades/gradebook', { params });
  },

  // ---------------------------------------------------------------------------
  // Grade items (e.g., quiz/assignment entries in the gradebook)
  // ---------------------------------------------------------------------------

  /**
   * List grade items.
   * @param {Object} params e.g., { courseId, offeringId, sectionId, type }
   */
  listItems(params = {}) {
    return axiosInstance.get('/grades/items', { params });
  },

  /**
   * Get a single grade item.
   */
  getItem(itemId) {
    return axiosInstance.get(`/grades/items/${itemId}`);
  },

  /**
   * Create a grade item.
   * @param {Object} payload e.g., { title, maxPoints, weight, type, courseId, offeringId, sectionId, dueDate }
   */
  createItem(payload) {
    return axiosInstance.post('/grades/items', payload);
  },

  /**
   * Update a grade item.
   */
  updateItem(itemId, payload) {
    return axiosInstance.put(`/grades/items/${itemId}`, payload);
  },

  /**
   * Delete a grade item.
   */
  removeItem(itemId) {
    return axiosInstance.delete(`/grades/items/${itemId}`);
  },

  // ---------------------------------------------------------------------------
  // Student grades (single update or fetch)
  // ---------------------------------------------------------------------------

  /**
   * Get a student's grade for a specific item.
   */
  getStudentGrade(itemId, studentId) {
    return axiosInstance.get(`/grades/items/${itemId}/students/${studentId}`);
  },

  /**
   * Set or update a student's grade.
   * @param {Object} payload e.g., { score, feedback, gradedAt, graderId }
   */
  setStudentGrade(itemId, studentId, payload) {
    return axiosInstance.put(
      `/grades/items/${itemId}/students/${studentId}`,
      payload
    );
  },

  // ---------------------------------------------------------------------------
  // Bulk grade updates
  // ---------------------------------------------------------------------------

  /**
   * Bulk update grades for an item.
   * @param {Array} payload array of { studentId, score, feedback }
   */
  bulkUpdate(itemId, payload) {
    return axiosInstance.post(`/grades/items/${itemId}/bulk`, payload);
  },
};

export default gradeApi;