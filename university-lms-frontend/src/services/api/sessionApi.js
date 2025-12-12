import axiosInstance from './axiosInstance';

/**
 * Academic sessions, rooms, and schedule slots API client.
 * Adjust endpoint paths to match your backend.
 *
 * Suggested backend routes:
 * - Sessions (terms/semesters):
 *   GET    /sessions
 *   POST   /sessions
 *   GET    /sessions/:sessionId
 *   PUT    /sessions/:sessionId
 *   DELETE /sessions/:sessionId
 *
 * - Rooms:
 *   GET    /rooms
 *   POST   /rooms
 *   GET    /rooms/:roomId
 *   PUT    /rooms/:roomId
 *   DELETE /rooms/:roomId
 *
 * - Schedule slots (time + room assignments, optional):
 *   GET    /schedule-slots
 *   POST   /schedule-slots
 *   GET    /schedule-slots/:slotId
 *   PUT    /schedule-slots/:slotId
 *   DELETE /schedule-slots/:slotId
 */
const sessionApi = {
  // ---------------------------------------------------------------------------
  // Academic sessions (terms/semesters)
  // ---------------------------------------------------------------------------

  /**
   * List academic sessions with optional filters.
   * @param {Object} params
   * @param {number} [params.page]    - 1-based page number.
   * @param {number} [params.limit]   - page size.
   * @param {string} [params.search]  - filter by name/code/year.
   * @param {string} [params.active]  - e.g., 'true' to filter active sessions.
   */
  listSessions(params = {}) {
    return axiosInstance.get('/sessions', { params });
  },

  /**
   * Get a single academic session by ID.
   */
  getSession(sessionId) {
    return axiosInstance.get(`/sessions/${sessionId}`);
  },

  /**
   * Create a new academic session.
   * @param {Object} payload - e.g., { name, code, startDate, endDate, isActive }
   */
  createSession(payload) {
    return axiosInstance.post('/sessions', payload);
  },

  /**
   * Update an existing academic session.
   */
  updateSession(sessionId, payload) {
    return axiosInstance.put(`/sessions/${sessionId}`, payload);
  },

  /**
   * Delete an academic session.
   */
  removeSession(sessionId) {
    return axiosInstance.delete(`/sessions/${sessionId}`);
  },

  // ---------------------------------------------------------------------------
  // Rooms (locations for classes/exams)
  // ---------------------------------------------------------------------------

  /**
   * List rooms with optional filters.
   * @param {Object} params
   * @param {string} [params.building] - filter by building.
   * @param {string} [params.search]   - filter by name/number.
   * @param {number} [params.page]     - pagination page.
   * @param {number} [params.limit]    - page size.
   */
  listRooms(params = {}) {
    return axiosInstance.get('/rooms', { params });
  },

  /**
   * Get a single room by ID.
   */
  getRoom(roomId) {
    return axiosInstance.get(`/rooms/${roomId}`);
  },

  /**
   * Create a new room.
   * @param {Object} payload - e.g., { name, number, building, capacity, features }
   */
  createRoom(payload) {
    return axiosInstance.post('/rooms', payload);
  },

  /**
   * Update a room.
   */
  updateRoom(roomId, payload) {
    return axiosInstance.put(`/rooms/${roomId}`, payload);
  },

  /**
   * Delete a room.
   */
  removeRoom(roomId) {
    return axiosInstance.delete(`/rooms/${roomId}`);
  },

  // ---------------------------------------------------------------------------
  // Schedule slots (time + room assignments)
  // ---------------------------------------------------------------------------

  /**
   * List schedule slots with optional filters.
   * @param {Object} params
   * @param {string|number} [params.sessionId]  - filter by academic session/term.
   * @param {string|number} [params.courseId]   - filter by course.
   * @param {string|number} [params.offeringId] - filter by offering/section.
   * @param {string|number} [params.roomId]     - filter by room.
   * @param {string} [params.day]               - e.g., 'Monday'.
   * @param {number} [params.page]
   * @param {number} [params.limit]
   */
  listSlots(params = {}) {
    return axiosInstance.get('/schedule-slots', { params });
  },

  /**
   * Get a single schedule slot by ID.
   */
  getSlot(slotId) {
    return axiosInstance.get(`/schedule-slots/${slotId}`);
  },

  /**
   * Create a new schedule slot.
   * @param {Object} payload - e.g., { sessionId, courseId, offeringId, sectionId, roomId, day, startTime, endTime }
   */
  createSlot(payload) {
    return axiosInstance.post('/schedule-slots', payload);
  },

  /**
   * Update an existing schedule slot.
   */
  updateSlot(slotId, payload) {
    return axiosInstance.put(`/schedule-slots/${slotId}`, payload);
  },

  /**
   * Delete a schedule slot.
   */
  removeSlot(slotId) {
    return axiosInstance.delete(`/schedule-slots/${slotId}`);
  },
};

export default sessionApi;