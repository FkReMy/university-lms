/**
 * useQuizAttempt
 * ----------------------------------------------------------
 * Manages the lifecycle of a quiz attempt for the LMS frontend.
 *
 * Responsibilities:
 * - Fetch attempt data (questions, metadata, prior answers).
 * - Track local answer state.
 * - Submit answers (full or partial).
 * - Expose loading/error flags for UI state.
 *
 * Notes:
 * - Replace fetch calls with your API client as needed.
 * - This hook is client-side only; server should handle correctness and scoring.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export function useQuizAttempt({ quizId, attemptId }) {
  const [attempt, setAttempt] = useState(null);        // Attempt payload from API
  const [answers, setAnswers] = useState({});          // Local answer map: { questionId: value }
  const [loading, setLoading] = useState(false);       // Network/loading flag
  const [submitting, setSubmitting] = useState(false); // Submission in progress flag
  const [error, setError] = useState(null);            // Last error (if any)

  const hasAttempt = !!attempt;

  // Load attempt data (new or existing)
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

  // Update a single answer locally
  const setAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  // Submit answers (can be partial or final)
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
        setAnswers(data.answers || answers); // sync with server echo
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

  // Derived helper: completion status (from API or computed)
  const isCompleted = useMemo(
    () => Boolean(attempt?.status === 'completed' || attempt?.completedAt),
    [attempt]
  );

  // Auto-load attempt on mount / param change
  useEffect(() => {
    loadAttempt();
  }, [loadAttempt]);

  return {
    attempt,
    answers,
    loading,
    submitting,
    error,
    hasAttempt,
    isCompleted,
    setAnswer,
    submitAnswers,
    reload: loadAttempt,
  };
}