/**
 * Quiz realtime channel helper built on top of the WebSocket client.
 *
 * Responsibilities:
 * - Subscribe to quiz-related events from the server.
 * - Provide semantic helpers for common event types.
 *
 * Assumptions:
 * - The server emits messages like: { type, payload }
 * - Example types:
 *   - "quiz:published"    -> payload: { quizId, courseId, offeringId, sectionId, publishedAt }
 *   - "quiz:updated"      -> payload: { quizId, fields } (fields changed)
 *   - "quiz:attemptStarted" -> payload: { quizId, attemptId, studentId, startedAt }
 *   - "quiz:attemptSubmitted" -> payload: { quizId, attemptId, studentId, submittedAt, scorePreview }
 *   - "quiz:graded"       -> payload: { quizId, attemptId, studentId, score, gradedAt }
 *
 * Usage:
 *   import { connectSocket } from './socketClient';
 *   import {
 *     onQuizPublished,
 *     onQuizUpdated,
 *     onQuizAttemptSubmitted,
 *     sendQuizEvent,
 *   } from './quizChannel';
 *
 *   connectSocket();
 *   const off = onQuizPublished((payload) => console.log('New quiz', payload));
 *   // later: off();
 */

import { addListener, removeListener, sendMessage } from './socketClient';

// Generic subscribe helper
function on(type, handler) {
  addListener(type, handler);
  return () => removeListener(type, handler);
}

// Public subscriptions for common quiz events
export const onQuizPublished = (handler) => on('quiz:published', handler);
export const onQuizUpdated = (handler) => on('quiz:updated', handler);
export const onQuizAttemptStarted = (handler) => on('quiz:attemptStarted', handler);
export const onQuizAttemptSubmitted = (handler) => on('quiz:attemptSubmitted', handler);
export const onQuizGraded = (handler) => on('quiz:graded', handler);

// Send a generic quiz event (if client needs to notify server)
export function sendQuizEvent(type, payload) {
  if (!type) return;
  sendMessage(type, payload);
}

// Example specialized senders (optional convenience)
export function notifyAttemptStart(quizId, attemptId, studentId) {
  sendQuizEvent('quiz:attemptStarted', { quizId, attemptId, studentId });
}

export function notifyAttemptSubmit(quizId, attemptId, studentId) {
  sendQuizEvent('quiz:attemptSubmitted', { quizId, attemptId, studentId });
}