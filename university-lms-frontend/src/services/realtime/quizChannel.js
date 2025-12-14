/**
 * QuizChannel (LMS Production Real-Time Quizzes)
 * ----------------------------------------------------------------------------
 * WebSocket-based real-time helpers for quiz event subscription and dispatch.
 * - Subscribes/unsubscribes to standardized quiz-related server events.
 * - Sends quiz events (for interactive, collaborative, or sync scenarios).
 * - All code is unified, robust, and suitable for global LMS usage.
 *
 * Usage:
 *   import { connectSocket } from './socketClient';
 *   import {
 *     onQuizPublished,
 *     onQuizUpdated,
 *     onQuizAttemptStarted,
 *     onQuizAttemptSubmitted,
 *     onQuizGraded,
 *     sendQuizEvent,
 *     notifyAttemptStart,
 *     notifyAttemptSubmit,
 *   } from './quizChannel';
 *
 *   connectSocket();
 *   const off = onQuizPublished(payload => { ... });
 *   // off() to unsubscribe.
 */

import { addListener, removeListener, sendMessage } from './socketClient';

/**
 * Subscribe to a specific quiz-related event type.
 * @param {string} type - WebSocket event type string (e.g., "quiz:published").
 * @param {function} handler - Callback invoked with payload.
 * @returns {function} Unsubscribe function.
 */
function on(type, handler) {
  addListener(type, handler);
  return () => removeListener(type, handler);
}

/**
 * Subscribe to quiz published events.
 * @param {function} handler
 * @returns {function}
 */
export const onQuizPublished = (handler) => on('quiz:published', handler);

/**
 * Subscribe to quiz updated events.
 * @param {function} handler
 * @returns {function}
 */
export const onQuizUpdated = (handler) => on('quiz:updated', handler);

/**
 * Subscribe to quiz attempt started events.
 * @param {function} handler
 * @returns {function}
 */
export const onQuizAttemptStarted = (handler) => on('quiz:attemptStarted', handler);

/**
 * Subscribe to quiz attempt submitted events.
 * @param {function} handler
 * @returns {function}
 */
export const onQuizAttemptSubmitted = (handler) => on('quiz:attemptSubmitted', handler);

/**
 * Subscribe to quiz graded events.
 * @param {function} handler
 * @returns {function}
 */
export const onQuizGraded = (handler) => on('quiz:graded', handler);

/**
 * Send a generic quiz event to the server (if interactive/notification required).
 * @param {string} type - Event type (e.g. 'quiz:attemptStarted')
 * @param {object} payload - Associated data
 */
export function sendQuizEvent(type, payload) {
  if (!type) return;
  sendMessage(type, payload);
}

/**
 * Notify the server that a quiz attempt has started.
 * @param {string|number} quizId
 * @param {string|number} attemptId
 * @param {string|number} studentId
 */
export function notifyAttemptStart(quizId, attemptId, studentId) {
  sendQuizEvent('quiz:attemptStarted', { quizId, attemptId, studentId });
}

/**
 * Notify the server that a quiz attempt has been submitted.
 * @param {string|number} quizId
 * @param {string|number} attemptId
 * @param {string|number} studentId
 */
export function notifyAttemptSubmit(quizId, attemptId, studentId) {
  sendQuizEvent('quiz:attemptSubmitted', { quizId, attemptId, studentId });
}

/**
 * Production/Architecture Notes:
 * - All event types are named following global LMS real-time conventions.
 * - Subscribe/unsubscribe are robust and idempotent.
 * - No sample/demo logic; all usage and event shapes should match backend.
 */