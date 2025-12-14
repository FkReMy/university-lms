/**
 * Quiz API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Centralized client for quizzes, questions, options, attempts, answers, and file actions.
 * - Uses a global axios instance (configured for authentication).
 * - Fully parameterized, production-ready, no sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const quizApi = {
  // ===========================================================================
  // Quizzes
  // ===========================================================================

  /**
   * List quizzes with optional filters/pagination.
   * @param {Object} params - { page, limit, courseId, offeringId, sectionId, search, status }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/quizzes', { params });
  },

  /**
   * Get a single quiz by ID.
   * @param {string|number} quizId
   * @returns {Promise}
   */
  get(quizId) {
    return axiosInstance.get(`/quizzes/${quizId}`);
  },

  /**
   * Create a quiz.
   * @param {Object} payload - { title, description, courseId, offeringId, sectionId, type, startTime, endTime, timeLimit }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/quizzes', payload);
  },

  /**
   * Update a quiz.
   * @param {string|number} quizId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(quizId, payload) {
    return axiosInstance.put(`/quizzes/${quizId}`, payload);
  },

  /**
   * Delete a quiz.
   * @param {string|number} quizId
   * @returns {Promise}
   */
  remove(quizId) {
    return axiosInstance.delete(`/quizzes/${quizId}`);
  },

  // ===========================================================================
  // Questions
  // ===========================================================================

  /**
   * List all questions in a quiz.
   * @param {string|number} quizId
   * @param {Object} params - Optional filters/pagination
   * @returns {Promise}
   */
  listQuestions(quizId, params = {}) {
    return axiosInstance.get(`/quizzes/${quizId}/questions`, { params });
  },

  /**
   * Add a new question to a quiz.
   * @param {string|number} quizId
   * @param {Object} payload - { text, type, points, order, options: [...] }
   * @returns {Promise}
   */
  createQuestion(quizId, payload) {
    return axiosInstance.post(`/quizzes/${quizId}/questions`, payload);
  },

  /**
   * Update a quiz question.
   * @param {string|number} quizId
   * @param {string|number} questionId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateQuestion(quizId, questionId, payload) {
    return axiosInstance.put(`/quizzes/${quizId}/questions/${questionId}`, payload);
  },

  /**
   * Remove a question from a quiz.
   * @param {string|number} quizId
   * @param {string|number} questionId
   * @returns {Promise}
   */
  removeQuestion(quizId, questionId) {
    return axiosInstance.delete(`/quizzes/${quizId}/questions/${questionId}`);
  },

  // ===========================================================================
  // Options (for multiple-choice, etc)
  // ===========================================================================

  /**
   * Add options (single or multiple) to a question.
   * @param {string|number} quizId
   * @param {string|number} questionId
   * @param {Object|Object[]} payload - { text, isCorrect, order }
   * @returns {Promise}
   */
  addOptions(quizId, questionId, payload) {
    return axiosInstance.post(
      `/quizzes/${quizId}/questions/${questionId}/options`,
      payload
    );
  },

  /**
   * Update a single option.
   * @param {string|number} quizId
   * @param {string|number} questionId
   * @param {string|number} optionId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateOption(quizId, questionId, optionId, payload) {
    return axiosInstance.put(
      `/quizzes/${quizId}/questions/${questionId}/options/${optionId}`,
      payload
    );
  },

  /**
   * Remove a single option from a question.
   * @param {string|number} quizId
   * @param {string|number} questionId
   * @param {string|number} optionId
   * @returns {Promise}
   */
  removeOption(quizId, questionId, optionId) {
    return axiosInstance.delete(
      `/quizzes/${quizId}/questions/${questionId}/options/${optionId}`
    );
  },

  // ===========================================================================
  // Attempts
  // ===========================================================================

  /**
   * List attempts for a quiz (teacher or student scope based on auth).
   * @param {string|number} quizId
   * @param {Object} params - Optional filtering
   * @returns {Promise}
   */
  listAttempts(quizId, params = {}) {
    return axiosInstance.get(`/quizzes/${quizId}/attempts`, { params });
  },

  /**
   * Start a new attempt (student submit).
   * @param {string|number} quizId
   * @param {Object} payload
   * @returns {Promise}
   */
  createAttempt(quizId, payload = {}) {
    return axiosInstance.post(`/quizzes/${quizId}/attempts`, payload);
  },

  /**
   * Get a specific attempt's details.
   * @param {string|number} quizId
   * @param {string|number} attemptId
   * @param {Object} params - Optional detail flags
   * @returns {Promise}
   */
  getAttempt(quizId, attemptId, params = {}) {
    return axiosInstance.get(`/quizzes/${quizId}/attempts/${attemptId}`, { params });
  },

  /**
   * Submit answers for a quiz attempt (bulk).
   * @param {string|number} quizId
   * @param {string|number} attemptId
   * @param {Object|Object[]} payload - { questionId, answer, optionIds, fileId, text }
   * @returns {Promise}
   */
  submitAnswers(quizId, attemptId, payload) {
    return axiosInstance.post(
      `/quizzes/${quizId}/attempts/${attemptId}/answers`,
      payload
    );
  },

  /**
   * Update a single answer for a quiz attempt.
   * @param {string|number} quizId
   * @param {string|number} attemptId
   * @param {string|number} answerId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateAnswer(quizId, attemptId, answerId, payload) {
    return axiosInstance.put(
      `/quizzes/${quizId}/attempts/${attemptId}/answers/${answerId}`,
      payload
    );
  },

  // ===========================================================================
  // Grading (manual or override)
  // ===========================================================================

  /**
   * Grade or override a quiz attempt.
   * @param {string|number} quizId
   * @param {string|number} attemptId
   * @param {Object} payload - { score, feedback }
   * @returns {Promise}
   */
  gradeAttempt(quizId, attemptId, payload) {
    return axiosInstance.post(
      `/quizzes/${quizId}/attempts/${attemptId}/grade`,
      payload
    );
  },

  /**
   * Publish grades for a quiz.
   * @param {string|number} quizId
   * @param {Object} payload - Optional publish params
   * @returns {Promise}
   */
  publishGrades(quizId, payload = {}) {
    return axiosInstance.post(`/quizzes/${quizId}/publish-grades`, payload);
  },

  // ===========================================================================
  // Files (general quiz-level attachments & submission files)
  // ===========================================================================

  /**
   * Upload a file for a quiz (resources, etc).
   * @param {string|number} quizId
   * @param {FormData} formData
   * @returns {Promise}
   */
  uploadQuizFile(quizId, formData) {
    return axiosInstance.post(`/quizzes/${quizId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete a quiz-level file.
   * @param {string|number} quizId
   * @param {string|number} fileId
   * @returns {Promise}
   */
  removeQuizFile(quizId, fileId) {
    return axiosInstance.delete(`/quizzes/${quizId}/files/${fileId}`);
  },

  /**
   * Upload a file submission for a quiz attempt.
   * @param {string|number} quizId
   * @param {string|number} attemptId
   * @param {FormData} formData
   * @returns {Promise}
   */
  uploadAttemptFile(quizId, attemptId, formData) {
    return axiosInstance.post(
      `/quizzes/${quizId}/attempts/${attemptId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /**
   * Delete a file submission from a quiz attempt.
   * @param {string|number} quizId
   * @param {string|number} attemptId
   * @param {string|number} fileId
   * @returns {Promise}
   */
  removeAttemptFile(quizId, attemptId, fileId) {
    return axiosInstance.delete(
      `/quizzes/${quizId}/attempts/${attemptId}/files/${fileId}`
    );
  }
};

export default quizApi;

/**
 * Production/Architecture Notes:
 * - All endpoints are parameterized and backend-compatible.
 * - No sample/demo logic; all usage is centralized for real LMS quizzes.
 * - All file endpoints use FormData and correct headers.
 */