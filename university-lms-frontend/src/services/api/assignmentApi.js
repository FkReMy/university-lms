/**
 * Assignment API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Central global client for assignments, submissions, grading, and file uploads.
 * - Uses a single axiosInstance (should be configured for auth, interceptors, baseURL).
 * - Endpoints are parameterized and production-ready for scalable backend use.
 * - Comments specify typical backend route shapes for maintainability.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const assignmentApi = {
  // ===========================================================================
  // Assignments
  // ===========================================================================

  /**
   * List assignments with optional filters/pagination.
   * @param {Object} params e.g., { page, limit, courseId, offeringId, sectionId, search, status, dueBefore, dueAfter }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/assignments', { params });
  },

  /**
   * Get a single assignment by ID.
   * @param {string|number} assignmentId
   * @returns {Promise}
   */
  get(assignmentId) {
    return axiosInstance.get(`/assignments/${assignmentId}`);
  },

  /**
   * Create a new assignment.
   * @param {Object} payload e.g., { title, description, courseId, offeringId, sectionId, dueDate, maxPoints }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/assignments', payload);
  },

  /**
   * Update an assignment.
   * @param {string|number} assignmentId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(assignmentId, payload) {
    return axiosInstance.put(`/assignments/${assignmentId}`, payload);
  },

  /**
   * Delete an assignment.
   * @param {string|number} assignmentId
   * @returns {Promise}
   */
  remove(assignmentId) {
    return axiosInstance.delete(`/assignments/${assignmentId}`);
  },

  // ===========================================================================
  // Submissions
  // ===========================================================================

  /**
   * List submissions for an assignment with optional filters.
   * @param {string|number} assignmentId
   * @param {Object} params e.g., { page, limit, studentId, status }
   * @returns {Promise}
   */
  listSubmissions(assignmentId, params = {}) {
    return axiosInstance.get(`/assignments/${assignmentId}/submissions`, { params });
  },

  /**
   * Get a specific submission, including detail fields.
   * @param {string|number} assignmentId
   * @param {string|number} submissionId
   * @param {Object} params
   * @returns {Promise}
   */
  getSubmission(assignmentId, submissionId, params = {}) {
    return axiosInstance.get(
      `/assignments/${assignmentId}/submissions/${submissionId}`,
      { params }
    );
  },

  /**
   * Create a new submission for an assignment (by student).
   * @param {string|number} assignmentId
   * @param {Object} payload e.g., { studentId, text, links, fileIds }
   * @returns {Promise}
   */
  createSubmission(assignmentId, payload) {
    return axiosInstance.post(`/assignments/${assignmentId}/submissions`, payload);
  },

  /**
   * Update a submission (if edits are allowed by backend).
   * @param {string|number} assignmentId
   * @param {string|number} submissionId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateSubmission(assignmentId, submissionId, payload) {
    return axiosInstance.put(
      `/assignments/${assignmentId}/submissions/${submissionId}`,
      payload
    );
  },

  /**
   * Delete (withdraw) a submission.
   * @param {string|number} assignmentId
   * @param {string|number} submissionId
   * @returns {Promise}
   */
  removeSubmission(assignmentId, submissionId) {
    return axiosInstance.delete(
      `/assignments/${assignmentId}/submissions/${submissionId}`
    );
  },

  // ===========================================================================
  // Grading
  // ===========================================================================

  /**
   * Grade (or update grade/feedback) for a submission.
   * @param {string|number} assignmentId
   * @param {string|number} submissionId
   * @param {Object} payload e.g., { score, feedback, gradedAt, graderId }
   * @returns {Promise}
   */
  gradeSubmission(assignmentId, submissionId, payload) {
    return axiosInstance.post(
      `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      payload
    );
  },

  // ===========================================================================
  // Assignment-level Files (resources/attachments)
  // ===========================================================================

  /**
   * Upload a file attached to the assignment (instructions, templates, etc.).
   * @param {string|number} assignmentId
   * @param {FormData} formData (must include file fields per backend API)
   * @returns {Promise}
   */
  uploadAssignmentFile(assignmentId, formData) {
    return axiosInstance.post(
      `/assignments/${assignmentId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /**
   * Delete an assignment-level file by ID.
   * @param {string|number} assignmentId
   * @param {string|number} fileId
   * @returns {Promise}
   */
  removeAssignmentFile(assignmentId, fileId) {
    return axiosInstance.delete(`/assignments/${assignmentId}/files/${fileId}`);
  },

  // ===========================================================================
  // Submission Files (student uploads)
  // ===========================================================================

  /**
   * Upload a file attached to a specific submission.
   * @param {string|number} assignmentId
   * @param {string|number} submissionId
   * @param {FormData} formData
   * @returns {Promise}
   */
  uploadSubmissionFile(assignmentId, submissionId, formData) {
    return axiosInstance.post(
      `/assignments/${assignmentId}/submissions/${submissionId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /**
   * Delete a file from a submission by fileId.
   * @param {string|number} assignmentId
   * @param {string|number} submissionId
   * @param {string|number} fileId
   * @returns {Promise}
   */
  removeSubmissionFile(assignmentId, submissionId, fileId) {
    return axiosInstance.delete(
      `/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}`
    );
  },
};

export default assignmentApi;

/**
 * Production/Architecture Notes:
 * - All endpoints are parameterized and backend-ready.
 * - Import axiosInstance from global service (must be configured for auth/interceptors).
 * - No example/sample logic; suitable for all production flows.
 */