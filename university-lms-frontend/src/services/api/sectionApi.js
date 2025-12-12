import axiosInstance from './axiosInstance';

/**
 * Section / Group API client.
 * Handles section groups and student assignments within course offerings.
 * Adjust endpoint paths to match your backend.
 *
 * Suggested backend routes:
 * - GET    /sections
 * - POST   /sections
 * - GET    /sections/:sectionId
 * - PUT    /sections/:sectionId
 * - DELETE /sections/:sectionId
 *
 * - GET    /sections/:sectionId/students
 * - POST   /sections/:sectionId/students            (add one or many)
 * - DELETE /sections/:sectionId/students/:studentId (remove student)
 *
 * - (Optional) schedule/meetings:
 *   GET/POST/PUT/DELETE /sections/:sectionId/meetings
 */
const sectionApi = {
  // ---------------------------------------------------------------------------
  // Sections (groups under a course offering)
  // ---------------------------------------------------------------------------

  /**
   * List sections with optional filters.
   * @param {Object} params
   * @param {number} [params.page]        - 1-based page number
   * @param {number} [params.limit]       - page size
   * @param {string|number} [params.courseId]   - filter by course
   * @param {string|number} [params.offeringId] - filter by offering/term
   * @param {string} [params.search]      - search by name/code
   * @param {string} [params.instructorId]- filter by instructor
   */
  list(params = {}) {
    return axiosInstance.get('/sections', { params });
  },

  /**
   * Get a single section by ID.
   */
  get(sectionId) {
    return axiosInstance.get(`/sections/${sectionId}`);
  },

  /**
   * Create a new section.
   * @param {Object} payload - e.g., { name, code, courseId, offeringId, instructorId, capacity, schedule }
   */
  create(payload) {
    return axiosInstance.post('/sections', payload);
  },

  /**
   * Update an existing section.
   */
  update(sectionId, payload) {
    return axiosInstance.put(`/sections/${sectionId}`, payload);
  },

  /**
   * Delete a section.
   */
  remove(sectionId) {
    return axiosInstance.delete(`/sections/${sectionId}`);
  },

  // ---------------------------------------------------------------------------
  // Students within a section
  // ---------------------------------------------------------------------------

  /**
   * List students assigned to a section.
   * @param {string|number} sectionId
   * @param {Object} params - e.g., { page, limit, status }
   */
  listStudents(sectionId, params = {}) {
    return axiosInstance.get(`/sections/${sectionId}/students`, { params });
  },

  /**
   * Add one or multiple students to a section.
   * @param {string|number} sectionId
   * @param {Object|Object[]} payload - e.g., { studentId, status } or array
   */
  addStudents(sectionId, payload) {
    return axiosInstance.post(`/sections/${sectionId}/students`, payload);
  },

  /**
   * Remove a student from a section.
   * @param {string|number} sectionId
   * @param {string|number} studentId
   */
  removeStudent(sectionId, studentId) {
    return axiosInstance.delete(`/sections/${sectionId}/students/${studentId}`);
  },

  // ---------------------------------------------------------------------------
  // (Optional) Meetings / schedule per section
  // ---------------------------------------------------------------------------

  /**
   * List meetings/schedule entries for a section.
   */
  listMeetings(sectionId, params = {}) {
    return axiosInstance.get(`/sections/${sectionId}/meetings`, { params });
  },

  /**
   * Create a meeting/schedule entry.
   * @param {Object} payload - e.g., { day, startTime, endTime, roomId }
   */
  createMeeting(sectionId, payload) {
    return axiosInstance.post(`/sections/${sectionId}/meetings`, payload);
  },

  /**
   * Update a meeting.
   */
  updateMeeting(sectionId, meetingId, payload) {
    return axiosInstance.put(
      `/sections/${sectionId}/meetings/${meetingId}`,
      payload
    );
  },

  /**
   * Delete a meeting.
   */
  removeMeeting(sectionId, meetingId) {
    return axiosInstance.delete(`/sections/${sectionId}/meetings/${meetingId}`);
  },
};

export default sectionApi;