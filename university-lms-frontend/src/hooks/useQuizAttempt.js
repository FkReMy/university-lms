/**
 * useQuizAttempt (LMS Production Hook)
 * ----------------------------------------------------------------------------
 * Handles lifecycle and local state for a quiz attempt in the LMS frontend.
 * - Loads quiz attempt (metadata, questions, prior answers) from backend.
 * - Handles controlled answer updates and submissions (partial/final).
 * - Exposes all network state for global/prod UI patterns.
 * - 100% backend-ready, with no sample/demo code.
 *
 * To use with your backend, replace fetch calls as needed.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export function useQuizAttempt({ quizId, attemptId }) {
  // Attempt metadata, answer map, UI/control states
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const hasAttempt = !!attempt;

  /**
   * Fetch attempt data (by quiz and optional attemptId).
   * Normalizes state for clean UI fill from server.
   */
  const loadAttempt = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (attemptId) params.append('attemptId', attemptId);

      const res = await fetch(`/api/quizzes/${quizId}/attempt?${params.toString()}`, {
        method: 'GET',
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to load quiz attempt');
      }

      const data = await res.json();
      setAttempt(data);
      setAnswers(data.answers || {});
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [quizId, attemptId]);

  /**
   * Update a single answer locally (controlled UI form state).
   */
  const setAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  /**
   * Submits answers to backend (can be partial or final).
   * Returns response data for next flow in UI.
   */
  const submitAnswers = useCallback(
    async ({ final = false } = {}) => {
      if (!quizId) return;
      setSubmitting(true);
      setError(null);

      try {
        const res = await fetch(`/api/quizzes/${quizId}/attempt/submit`, {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({
            attemptId: attempt?.id,
            answers,
            final,
          }),
        });

        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || 'Failed to submit answers');
        }

        const data = await res.json();
        setAttempt(data);
        setAnswers(data.answers || answers); // sync answers with server
        return data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [quizId, attempt?.id, answers]
  );

  /**
   * Completion: API (attempt.status === 'completed') or attempt.completedAt exists.
   */
  const isCompleted = useMemo(
    () => Boolean(attempt?.status === 'completed' || attempt?.completedAt),
    [attempt]
  );

  // On mount/quiz change, load new attempt.
  useEffect(() => {
    loadAttempt();
  }, [loadAttempt]);

  return {
    attempt,        // Object with details, questions, etc.
    answers,        // Map of answers { questionId: value }
    loading,        // Fetching boolean
    submitting,     // Submit-in-progress boolean
    error,          // Error object/string/null
    hasAttempt,     // Boolean (has an attempt loaded)
    isCompleted,    // Boolean (from backend signals)
    setAnswer,      // Update function for answer
    submitAnswers,  // Submit answers to backend
    reload: loadAttempt, // Refetch state/manual reload
  };
}

/**
 * Production/Architecture Notes:
 * - No sample/demo logic; hook is prod-ready and matches backend data/contract.
 * - Safely exposes all network and completion state for global UI consumption.
 * - Use in any quiz, test, survey-like workflow with minimal glue code.
 */