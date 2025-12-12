// Assignment store (Redux-style actions) using Zustand.
// Manages assignment list, current assignment detail, submissions, and loading/error flags.

import { create } from 'zustand';

const initialState = {
  assignments: [],         // list view
  currentAssignment: null, // detailed assignment object
  submissions: [],         // submissions for currentAssignment
  loading: false,
  error: null
};

export const useAssignmentStore = create((set, get) => ({
  ...initialState,

  // ---------------------------------------------------------------------------
  // Loading & error helpers
  // ---------------------------------------------------------------------------
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: () => set({ loading: false }),
  setError: (error) => set({ error, loading: false }),
  clearError: () => set({ error: null }),

  // ---------------------------------------------------------------------------
  // Assignments (list)
  // ---------------------------------------------------------------------------
  setAssignments: (assignments) => set({ assignments, loading: false, error: null }),
  addAssignment: (assignment) => set({ assignments: [...get().assignments, assignment] }),
  updateAssignment: (assignmentId, partial) =>
    set({
      assignments: get().assignments.map((a) =>
        a.id === assignmentId ? { ...a, ...partial } : a
      ),
      currentAssignment:
        get().currentAssignment?.id === assignmentId
          ? { ...get().currentAssignment, ...partial }
          : get().currentAssignment
    }),
  removeAssignment: (assignmentId) =>
    set({
      assignments: get().assignments.filter((a) => a.id !== assignmentId),
      currentAssignment:
        get().currentAssignment?.id === assignmentId ? null : get().currentAssignment,
      submissions: get().currentAssignment?.id === assignmentId ? [] : get().submissions
    }),

  // ---------------------------------------------------------------------------
  // Current assignment & submissions
  // ---------------------------------------------------------------------------
  setCurrentAssignment: (assignment) =>
    set({ currentAssignment: assignment, submissions: [], error: null }),

  setSubmissions: (submissions) => set({ submissions }),
  addSubmission: (submission) => set({ submissions: [...get().submissions, submission] }),
  updateSubmission: (submissionId, partial) =>
    set({
      submissions: get().submissions.map((s) =>
        s.id === submissionId ? { ...s, ...partial } : s
      )
    }),
  removeSubmission: (submissionId) =>
    set({ submissions: get().submissions.filter((s) => s.id !== submissionId) }),

  // Optional: grade/feedback helper for a submission
  setSubmissionGrade: (submissionId, gradePayload) =>
    set({
      submissions: get().submissions.map((s) =>
        s.id === submissionId ? { ...s, ...gradePayload } : s
      )
    }),

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------
  reset: () => set({ ...initialState })
}));

// Selectors (optional convenience)
export const selectAssignments = (s) => s.assignments;
export const selectCurrentAssignment = (s) => s.currentAssignment;
export const selectSubmissions = (s) => s.submissions;
export const selectAssignmentLoading = (s) => s.loading;
export const selectAssignmentError = (s) => s.error;