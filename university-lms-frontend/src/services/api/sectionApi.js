/**
 * Section & Group API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Handles section groups, student assignment to sections, and meeting schedules.
 * - Uses a global, authenticated axios instance.
 * - All endpoints are parameterized for real backend usage.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const sectionApi = {
  // ===========================================================================
  // Sections (course offering groups)
  // ===========================================================================

  /**
   * List sections with optional filters/pagination.
   * @param {Object} params - { page, limit, courseId, offeringId, search, instructorId }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/sections', { params });
  },

  /**
   * Get a single section by ID.
   * @param {string|number} sectionId
   * @returns {Promise}
   */
  get(sectionId) {
    return axiosInstance.get(`/sections/${sectionId}`);
  },

  /**
   * Create a new section.
   * @param {Object} payload - { name, code, courseId, offeringId, instructorId, capacity, schedule }
   * @returns {Promise}
   */
  create(payload) {
    return axiosInstance.post('/sections', payload);
  },

  /**
   * Update an existing section.
   * @param {string|number} sectionId
   * @param {Object} payload
   * @returns {Promise}
   */
  update(sectionId, payload) {
    return axiosInstance.put(`/sections/${sectionId}`, payload);
  },

  /**
   * Delete a section.
   * @param {string|number} sectionId
   * @returns {Promise}
   */
  remove(sectionId) {
    return axiosInstance.delete(`/sections/${sectionId}`);
  },

  // ===========================================================================
  // Students in Sections
  // ===========================================================================

  /**
   * List students assigned to a section.
   * @param {string|number} sectionId
   * @param {Object} params - e.g., { page, limit, status }
   * @returns {Promise}
   */
  listStudents(sectionId, params = {}) {
    return axiosInstance.get(`/sections/${sectionId}/students`, { params });
  },

  /**
   * Add one or multiple students to a section.
   * @param {string|number} sectionId
   * @param {Object|Object[]} payload - { studentId, status } or array
   * @returns {Promise}
   */
  addStudents(sectionId, payload) {
    return axiosInstance.post(`/sections/${sectionId}/students`, payload);
  },

  /**
   * Remove a student from a section.
   * @param {string|number} sectionId
   * @param {string|number} studentId
   * @returns {Promise}
   */
  removeStudent(sectionId, studentId) {
    return axiosInstance.delete(`/sections/${sectionId}/students/${studentId}`);
  },

  // ===========================================================================
  // Section Meetings/Schedule (optional)
  // ===========================================================================

  /**
   * List scheduled meetings for a section.
   * @param {string|number} sectionId
   * @param {Object} params (optional filtering)
   * @returns {Promise}
   */
  listMeetings(sectionId, params = {}) {
    return axiosInstance.get(`/sections/${sectionId}/meetings`, { params });
  },

  /**
   * Create a meeting/schedule entry for a section.
   * @param {string|number} sectionId
   * @param {Object} payload - { day, startTime, endTime, roomId }
   * @returns {Promise}
   */
  createMeeting(sectionId, payload) {
    return axiosInstance.post(`/sections/${sectionId}/meetings`, payload);
  },

  /**
   * Update a meeting in a section.
   * @param {string|number} sectionId
   * @param {string|number} meetingId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateMeeting(sectionId, meetingId, payload) {
    return axiosInstance.put(
      `/sections/${sectionId}/meetings/${meetingId}`,
      payload
    );
  },

  /**
   * Delete a meeting from a section.
   * @param {string|number} sectionId
   * @param {string|number} meetingId
   * @returns {Promise}
   */
  removeMeeting(sectionId, meetingId) {
    return axiosInstance.delete(
      `/sections/${sectionId}/meetings/${meetingId}`
    );
  },
};

export default sectionApi;

/**
 * Production/Architecture Notes:
 * - All endpoints and parameters are backend-compatible and ready for scaling.
 * - Students/meetings endpoints are organized for maintainability.
 * - No demo/sample code, ready for global app integration.
 */