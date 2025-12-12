import axiosInstance from './axiosInstance';

/**
 * Quiz API client.
 * Covers quizzes, questions, options, attempts, answers, and file submissions.
 * Adjust endpoint paths to match your backend routing.
 *
 * Suggested backend routes (example):
 * - Quizzes:            GET/POST   /quizzes
 *                       GET/PUT/DEL /quizzes/:quizId
 * - Questions:          GET/POST   /quizzes/:quizId/questions
 *                       GET/PUT/DEL /quizzes/:quizId/questions/:questionId
 * - Options:            POST/PUT/DEL /quizzes/:quizId/questions/:questionId/options(/:optionId)
 * - Attempts:           GET/POST   /quizzes/:quizId/attempts
 *                       GET        /quizzes/:quizId/attempts/:attemptId
 * - Answers:            POST/PUT   /quizzes/:quizId/attempts/:attemptId/answers
 * - Files (attachments):POST/DEL   /quizzes/:quizId/files(/:fileId)
 * - File submissions:   POST/DEL   /quizzes/:quizId/attempts/:attemptId/files(/:fileId)
 */
const quizApi = {
  // ---------------------------------------------------------------------------
  // Quizzes
  // ---------------------------------------------------------------------------

  /**
   * List quizzes with optional filters/pagination.
   * @param {Object} params e.g., { page, limit, courseId, offeringId, sectionId, search, status }
   */
  list(params = {}) {
    return axiosInstance.get('/quizzes', { params });
  },

  /**
   * Get a single quiz by ID.
   */
  get(quizId) {
    return axiosInstance.get(`/quizzes/${quizId}`);
  }

  /**
   * Create a quiz.
   * @param {Object} payload e.g., { title, description, courseId, offeringId, sectionId, type, startTime, endTime, timeLimit }
   */
  create(payload) {
    return axiosInstance.post('/quizzes', payload);
  },

  /**
   * Update a quiz.
   */
  update(quizId, payload) {
    return axiosInstance.put(`/quizzes/${quizId}`, payload);
  },

  /**
   * Delete a quiz.
   */
  remove(quizId) {
    return axiosInstance.delete(`/quizzes/${quizId}`);
  },

  // ---------------------------------------------------------------------------
  // Questions
  // ---------------------------------------------------------------------------

  /**
   * List questions for a quiz.
   * @param {Object} params optional filters/pagination
   */
  listQuestions(quizId, params = {}) {
    return axiosInstance.get(`/quizzes/${quizId}/questions`, { params });
  },

  /**
   * Add a question to a quiz.
   * @param {Object} payload e.g., { text, type, points, order, options: [...] }
   */
  createQuestion(quizId, payload) {
    return axiosInstance.post(`/quizzes/${quizId}/questions`, payload);
  },

  /**
   * Update a question.
   */
  updateQuestion(quizId, questionId, payload) {
    return axiosInstance.put(`/quizzes/${quizId}/questions/${questionId}`, payload);
  },

  /**
   * Delete a question.
   */
  removeQuestion(quizId, questionId) {
    return axiosInstance.delete(`/quizzes/${quizId}/questions/${questionId}`);
  },

  // ---------------------------------------------------------------------------
  // Options (for multiple choice, etc.)
  // ---------------------------------------------------------------------------

  /**
   * Add options to a question.
   * @param {Object|Object[]} payload e.g., { text, isCorrect, order }
   */
  addOptions(quizId, questionId, payload) {
    return axiosInstance.post(
      `/quizzes/${quizId}/questions/${questionId}/options`,
      payload
    );
  },

  /**
   * Update a single option.
   */
  updateOption(quizId, questionId, optionId, payload) {
    return axiosInstance.put(
      `/quizzes/${quizId}/questions/${questionId}/options/${optionId}`,
      payload
    );
  },

  /**
   * Delete an option.
   */
  removeOption(quizId, questionId, optionId) {
    return axiosInstance.delete(
      `/quizzes/${quizId}/questions/${questionId}/options/${optionId}`
    );
  },

  // ---------------------------------------------------------------------------
  // Attempts
  // ---------------------------------------------------------------------------

  /**
   * List attempts for a quiz (teacher view) or for the current user (student view).
   * Use server-side role/authorization to scope appropriately.
   */
  listAttempts(quizId, params = {}) {
    return axiosInstance.get(`/quizzes/${quizId}/attempts`, { params });
  },

  /**
   * Start/create an attempt.
   * @param {Object} payload e.g., { studentId, startedAt }
   */
  createAttempt(quizId, payload = {}) {
    return axiosInstance.post(`/quizzes/${quizId}/attempts`, payload);
  },

  /**
   * Get a specific attempt (with questions/answers, depending on backend).
   */
  getAttempt(quizId, attemptId, params = {}) {
    return axiosInstance.get(`/quizzes/${quizId}/attempts/${attemptId}`, { params });
  },

  /**
   * Submit or update answers for an attempt (bulk).
   * @param {Object|Object[]} payload e.g., { questionId, answer, optionIds, fileId, text }
   */
  submitAnswers(quizId, attemptId, payload) {
    return axiosInstance.post(
      `/quizzes/${quizId}/attempts/${attemptId}/answers`,
      payload
    );
  },

  /**
   * Update a single answer (if your backend allows partial updates).
   */
  updateAnswer(quizId, attemptId, answerId, payload) {
    return axiosInstance.put(
      `/quizzes/${quizId}/attempts/${attemptId}/answers/${answerId}`,
      payload
    );
  },

  // ---------------------------------------------------------------------------
  // Grading (optional endpoints)
  // ---------------------------------------------------------------------------

  /**
   * Grade an attempt (manual or override).
   * @param {Object} payload e.g., { score, feedback }
   */
  gradeAttempt(quizId, attemptId, payload) {
    return axiosInstance.post(
      `/quizzes/${quizId}/attempts/${attemptId}/grade`,
      payload
    );
  },

  /**
   * Publish grades for a quiz (if supported).
   */
  publishGrades(quizId, payload = {}) {
    return axiosInstance.post(`/quizzes/${quizId}/publish-grades`, payload);
  },

  // ---------------------------------------------------------------------------
  // Files (quiz-level attachments) and file submissions (per attempt)
  // ---------------------------------------------------------------------------

  /**
   * Upload a file attachment for a quiz (e.g., resources).
   * @param {FormData} formData must include file fields per backend expectation.
   */
  uploadQuizFile(quizId, formData) {
    return axiosInstance.post(`/quizzes/${quizId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete a quiz-level file.
   */
  removeQuizFile(quizId, fileId) {
    return axiosInstance.delete(`/quizzes/${quizId}/files/${fileId}`);
  },

  /**
   * Upload a file submission for a specific attempt.
   * @param {FormData} formData must include file fields per backend expectation.
   */
  uploadAttemptFile(quizId, attemptId, formData) {
    return axiosInstance.post(
      `/quizzes/${quizId}/attempts/${attemptId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  /**
   * Delete a file submission from an attempt.
   */
  removeAttemptFile(quizId, attemptId, fileId) {
    return axiosInstance.delete(
      `/quizzes/${quizId}/attempts/${attemptId}/files/${fileId}`
    );
  },
};

export default quizApi;