import axiosInstance from './axiosInstance';

/**
 * Assignment API client.
 * Covers assignments, submissions, grading, and related file uploads.
 * Adjust endpoint paths to match your backend routing.
 *
 * Suggested backend routes (example):
 * - Assignments:        GET/POST      /assignments
 *                        GET/PUT/DEL   /assignments/:assignmentId
 * - Submissions:        GET/POST      /assignments/:assignmentId/submissions
 *                        GET/PUT/DEL   /assignments/:assignmentId/submissions/:submissionId
 * - Grading:            POST          /assignments/:assignmentId/submissions/:submissionId/grade
 * - Assignment files:   POST/DEL      /assignments/:assignmentId/files(/:fileId)
 * - Submission files:   POST/DEL      /assignments/:assignmentId/submissions/:submissionId/files(/:fileId)
 */
const assignmentApi = {
  // ---------------------------------------------------------------------------
  // Assignments
  // ---------------------------------------------------------------------------

  /**
   * List assignments with optional filters/pagination.
   * @param {Object} params e.g., { page, limit, courseId, offeringId, sectionId, search, status, dueBefore, dueAfter }
   */
  list(params = {}) {
    return axiosInstance.get('/assignments', { params });
  },

  /**
   * Get a single assignment by ID.
   */
  get(assignmentId) {
    return axiosInstance.get(`/assignments/${assignmentId}`);
  },

  /**
   * Create an assignment.
   * @param {Object} payload e.g., { title, description, courseId, offeringId, sectionId, dueDate, maxPoints }
   */
  create(payload) {
    return axiosInstance.post('/assignments', payload);
  },

  /**
   * Update an assignment.
   */
  update(assignmentId, payload) {
    return axiosInstance.put(`/assignments/${assignmentId}`, payload);
  },

  /**
   * Delete an assignment.
   */
  remove(assignmentId) {
    return axiosInstance.delete(`/assignments/${assignmentId}`);
  },

  // ---------------------------------------------------------------------------
  // Submissions
  // ---------------------------------------------------------------------------

  /**
   * List submissions for an assignment.
   * @param {Object} params e.g., { page, limit, studentId, status }
   */
  listSubmissions(assignmentId, params = {}) {
    return axiosInstance.get(`/assignments/${assignmentId}/submissions`, {
      params,
    });
  },

  /**
   * Get a single submission (may include answers/files depending on backend).
   */
  getSubmission(assignmentId, submissionId, params = {}) {
    return axiosInstance.get(
      `/assignments/${assignmentId}/submissions/${submissionId}`,
      { params }
    );
  },

  /**
   * Create a submission (student submit).
   * @param {Object} payload e.g., { studentId, text, links, fileIds }
   */
  createSubmission(assignmentId, payload) {
    return axiosInstance.post(`/assignments/${assignmentId}/submissions`, payload);
  },

  /**
   * Update a submission (if edits are allowed).
   */
  updateSubmission(assignmentId, submissionId, payload) {
    return axiosInstance.put(
      `/assignments/${assignmentId}/submissions/${submissionId}`,
      payload
    );
  },

  /**
   * Delete a submission (or mark withdrawn).
   */
  removeSubmission(assignmentId, submissionId) {
    return axiosInstance.delete(
      `/assignments/${assignmentId}/submissions/${submissionId}`
    );
  },

  // ---------------------------------------------------------------------------
  // Grading
  // ---------------------------------------------------------------------------

  /**
   * Grade or update grade/feedback for a submission.
   * @param {Object} payload e.g., { score, feedback, gradedAt, graderId }
   */
  gradeSubmission(assignmentId, submissionId, payload) {
    return axiosInstance.post(
      `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      payload
    );
  },

  // ---------------------------------------------------------------------------
  // Assignment-level files (resources/attachments)
  // ---------------------------------------------------------------------------

  /**
   * Upload a file attached to the assignment (instructions, templates, etc.).
   * @param {FormData} formData include file fields per backend expectation.
   */
  uploadAssignmentFile(assignmentId, formData) {
    return axiosInstance.post(
      `/assignments/${assignmentId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /**
   * Delete an assignment-level file.
   */
  removeAssignmentFile(assignmentId, fileId) {
    return axiosInstance.delete(`/assignments/${assignmentId}/files/${fileId}`);
  },

  // ---------------------------------------------------------------------------
  // Submission files (student uploads)
  // ---------------------------------------------------------------------------

  /**
   * Upload a file for a specific submission.
   * @param {FormData} formData include file fields per backend expectation.
   */
  uploadSubmissionFile(assignmentId, submissionId, formData) {
    return axiosInstance.post(
      `/assignments/${assignmentId}/submissions/${submissionId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /**
   * Delete a file from a submission.
   */
  removeSubmissionFile(assignmentId, submissionId, fileId) {
    return axiosInstance.delete(
      `/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}`
    );
  },
};

export default assignmentApi;