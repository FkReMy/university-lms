/**
 * Academic Session, Room, and Schedule Slot API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Centralized API for academic sessions (terms), rooms, and schedule slots.
 * - Uses global axios instance (should be configured for authentication).
 * - All endpoints are robust, production-ready, and parameterized for backend use.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const sessionApi = {
  // ===========================================================================
  // Academic Sessions (Terms/Semesters)
  // ===========================================================================

  /**
   * List academic sessions (terms/semesters) with optional filtering.
   * @param {Object} params - { page, limit, search, active }
   * @returns {Promise}
   */
  listSessions(params = {}) {
    return axiosInstance.get('/sessions', { params });
  },

  /**
   * Get a single academic session by ID.
   * @param {string|number} sessionId
   * @returns {Promise}
   */
  getSession(sessionId) {
    return axiosInstance.get(`/sessions/${sessionId}`);
  },

  /**
   * Create a new academic session.
   * @param {Object} payload - { name, code, startDate, endDate, isActive }
   * @returns {Promise}
   */
  createSession(payload) {
    return axiosInstance.post('/sessions', payload);
  },

  /**
   * Update an existing academic session by ID.
   * @param {string|number} sessionId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateSession(sessionId, payload) {
    return axiosInstance.put(`/sessions/${sessionId}`, payload);
  },

  /**
   * Delete (remove) an academic session.
   * @param {string|number} sessionId
   * @returns {Promise}
   */
  removeSession(sessionId) {
    return axiosInstance.delete(`/sessions/${sessionId}`);
  },

  // ===========================================================================
  // Rooms (Locations)
  // ===========================================================================

  /**
   * List rooms with optional filtering/pagination.
   * @param {Object} params - { building, search, page, limit }
   * @returns {Promise}
   */
  listRooms(params = {}) {
    return axiosInstance.get('/rooms', { params });
  },

  /**
   * Get a single room by ID.
   * @param {string|number} roomId
   * @returns {Promise}
   */
  getRoom(roomId) {
    return axiosInstance.get(`/rooms/${roomId}`);
  },

  /**
   * Create a new room.
   * @param {Object} payload - { name, number, building, capacity, features }
   * @returns {Promise}
   */
  createRoom(payload) {
    return axiosInstance.post('/rooms', payload);
  },

  /**
   * Update a room by ID.
   * @param {string|number} roomId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateRoom(roomId, payload) {
    return axiosInstance.put(`/rooms/${roomId}`, payload);
  },

  /**
   * Delete a room.
   * @param {string|number} roomId
   * @returns {Promise}
   */
  removeRoom(roomId) {
    return axiosInstance.delete(`/rooms/${roomId}`);
  },

  // ===========================================================================
  // Schedule Slots (Calendaring/time/room assignments)
  // ===========================================================================

  /**
   * List schedule slots with optional filters (by session, course, offering, etc).
   * @param {Object} params - { sessionId, courseId, offeringId, roomId, day, page, limit }
   * @returns {Promise}
   */
  listSlots(params = {}) {
    return axiosInstance.get('/schedule-slots', { params });
  },

  /**
   * Get a single schedule slot by ID.
   * @param {string|number} slotId
   * @returns {Promise}
   */
  getSlot(slotId) {
    return axiosInstance.get(`/schedule-slots/${slotId}`);
  },

  /**
   * Create a new schedule slot.
   * @param {Object} payload - { sessionId, courseId, offeringId, sectionId, roomId, day, startTime, endTime }
   * @returns {Promise}
   */
  createSlot(payload) {
    return axiosInstance.post('/schedule-slots', payload);
  },

  /**
   * Update a schedule slot by ID.
   * @param {string|number} slotId
   * @param {Object} payload
   * @returns {Promise}
   */
  updateSlot(slotId, payload) {
    return axiosInstance.put(`/schedule-slots/${slotId}`, payload);
  },

  /**
   * Delete a schedule slot by ID.
   * @param {string|number} slotId
   * @returns {Promise}
   */
  removeSlot(slotId) {
    return axiosInstance.delete(`/schedule-slots/${slotId}`);
  }
};

export default sessionApi;

/**
 * Production/Architecture Notes:
 * - All helpers are parametrized to work with real backend endpoints.
 * - No sample code; all routes ready for session, room, and calendar scheduling integration.
 * - Imported globally for scheduling or setup logic across the LMS.
 */