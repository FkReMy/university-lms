// Quiz store (Redux-style actions) using Zustand.
// Manages quiz list, current quiz detail, questions, attempts, and loading/error flags.

import { create } from 'zustand';

const initialState = {
  quizzes: [],            // list view
  currentQuiz: null,      // detailed quiz object
  questions: [],          // questions for currentQuiz
  attempts: [],           // attempts for currentQuiz (if loaded)
  loading: false,
  error: null
};

export const useQuizStore = create((set, get) => ({
  ...initialState,

  // ---------------------------------------------------------------------------
  // Loading & error helpers
  // ---------------------------------------------------------------------------
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: () => set({ loading: false }),
  setError: (error) => set({ error, loading: false }),
  clearError: () => set({ error: null }),

  // ---------------------------------------------------------------------------
  // Quizzes (list)
  // ---------------------------------------------------------------------------
  setQuizzes: (quizzes) => set({ quizzes, loading: false, error: null }),
  addQuiz: (quiz) => set({ quizzes: [...get().quizzes, quiz] }),
  updateQuiz: (quizId, partial) =>
    set({
      quizzes: get().quizzes.map((q) => (q.id === quizId ? { ...q, ...partial } : q)),
      currentQuiz:
        get().currentQuiz?.id === quizId
          ? { ...get().currentQuiz, ...partial }
          : get().currentQuiz
    }),
  removeQuiz: (quizId) =>
    set({
      quizzes: get().quizzes.filter((q) => q.id !== quizId),
      currentQuiz: get().currentQuiz?.id === quizId ? null : get().currentQuiz,
      questions: get().currentQuiz?.id === quizId ? [] : get().questions,
      attempts: get().currentQuiz?.id === quizId ? [] : get().attempts
    }),

  // ---------------------------------------------------------------------------
  // Current quiz & questions
  // ---------------------------------------------------------------------------
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz, questions: [], attempts: [], error: null }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set({ questions: [...get().questions, question] }),
  updateQuestion: (questionId, partial) =>
    set({
      questions: get().questions.map((q) => (q.id === questionId ? { ...q, ...partial } : q))
    }),
  removeQuestion: (questionId) =>
    set({ questions: get().questions.filter((q) => q.id !== questionId) }),

  // ---------------------------------------------------------------------------
  // Attempts
  // ---------------------------------------------------------------------------
  setAttempts: (attempts) => set({ attempts }),
  addAttempt: (attempt) => set({ attempts: [...get().attempts, attempt] }),
  updateAttempt: (attemptId, partial) =>
    set({
      attempts: get().attempts.map((a) => (a.id === attemptId ? { ...a, ...partial } : a))
    }),
  removeAttempt: (attemptId) =>
    set({ attempts: get().attempts.filter((a) => a.id !== attemptId) }),

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------
  reset: () => set({ ...initialState })
}));

// Selectors (optional convenience)
export const selectQuizzes = (s) => s.quizzes;
export const selectCurrentQuiz = (s) => s.currentQuiz;
export const selectQuestions = (s) => s.questions;
export const selectAttempts = (s) => s.attempts;
export const selectQuizLoading = (s) => s.loading;
export const selectQuizError = (s) => s.error;