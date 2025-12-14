/**
 * Quiz Store (Zustand, Global LMS)
 * ----------------------------------------------------------------------------
 * Production Zustand store for quizzes:
 * - Tracks global quiz list, current quiz detail, quiz questions, attempts, and loading/error state.
 * - Unified, scalable, and ready for FastAPI/PostgreSQL backend integration.
 * - Mutation/actions are all pure and global. No demo/sample logic.
 */

import { create } from 'zustand';

// Initial/resettable store state
const initialState = {
  quizzes: [],        // Global quiz list
  currentQuiz: null,  // Selected quiz detail object
  questions: [],      // Questions for current quiz
  attempts: [],       // Attempts for current quiz (if loaded)
  loading: false,     // Loading flag
  error: null         // Error flag
};

/**
 * useQuizStore — Central LMS quiz store state and mutations.
 */
export const useQuizStore = create((set, get) => ({
  ...initialState,

  // -----------------------------------------------
  // Loading/Error State Helpers
  // -----------------------------------------------
  /** Set the store to loading state, clearing errors. */
  startLoading: () => set({ loading: true, error: null }),

  /** Set loading false. */
  stopLoading: () => set({ loading: false }),

  /** Set an error and stop loading. */
  setError: (error) => set({ error, loading: false }),

  /** Clear only error, keep all else. */
  clearError: () => set({ error: null }),

  // -----------------------------------------------
  // Quizzes List Actions
  // -----------------------------------------------
  /** Set the full quizzes array. */
  setQuizzes: (quizzes) => set({ quizzes, loading: false, error: null }),

  /** Add a quiz to the list. */
  addQuiz: (quiz) => set({ quizzes: [...get().quizzes, quiz] }),

  /** Update a quiz (by id, with patch object). */
  updateQuiz: (quizId, partial) =>
    set({
      quizzes: get().quizzes.map((q) => (q.id === quizId ? { ...q, ...partial } : q)),
      currentQuiz:
        get().currentQuiz?.id === quizId
          ? { ...get().currentQuiz, ...partial }
          : get().currentQuiz
    }),

  /** Remove a quiz (clear detail/questions/attempts if currently selected). */
  removeQuiz: (quizId) =>
    set({
      quizzes: get().quizzes.filter((q) => q.id !== quizId),
      currentQuiz: get().currentQuiz?.id === quizId ? null : get().currentQuiz,
      questions: get().currentQuiz?.id === quizId ? [] : get().questions,
      attempts: get().currentQuiz?.id === quizId ? [] : get().attempts
    }),

  // -----------------------------------------------
  // Current Quiz & Questions Actions
  // -----------------------------------------------
  /** Set current quiz and clear related arrays. */
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz, questions: [], attempts: [], error: null }),

  /** Replace all questions for current quiz. */
  setQuestions: (questions) => set({ questions }),

  /** Add a question to the current quiz's questions. */
  addQuestion: (question) => set({ questions: [...get().questions, question] }),

  /** Update a specific question by id. */
  updateQuestion: (questionId, partial) =>
    set({
      questions: get().questions.map((q) => (q.id === questionId ? { ...q, ...partial } : q))
    }),

  /** Remove a question by id. */
  removeQuestion: (questionId) =>
    set({ questions: get().questions.filter((q) => q.id !== questionId) }),

  // -----------------------------------------------
  // Attempts Actions
  // -----------------------------------------------
  /** Set attempts array for current quiz. */
  setAttempts: (attempts) => set({ attempts }),

  /** Add a quiz attempt. */
  addAttempt: (attempt) => set({ attempts: [...get().attempts, attempt] }),

  /** Update a quiz attempt by id. */
  updateAttempt: (attemptId, partial) =>
    set({
      attempts: get().attempts.map((a) => (a.id === attemptId ? { ...a, ...partial } : a))
    }),

  /** Remove an attempt by id. */
  removeAttempt: (attemptId) =>
    set({ attempts: get().attempts.filter((a) => a.id !== attemptId) }),

  // -----------------------------------------------
  // Reset state to initial
  // -----------------------------------------------
  reset: () => set({ ...initialState })
}));

// -----------------------------------------------
// Selectors for convenient UI hooks
// -----------------------------------------------
export const selectQuizzes         = (state) => state.quizzes;
export const selectCurrentQuiz     = (state) => state.currentQuiz;
export const selectQuestions       = (state) => state.questions;
export const selectAttempts        = (state) => state.attempts;
export const selectQuizLoading     = (state) => state.loading;
export const selectQuizError       = (state) => state.error;

/**
 * Production/Architecture Notes:
 * - This quiz store is robust for production LMS code/architecture.
 * - No samples, demos, or hardcoded flows: pure, scalable, and real-data centric.
 */