/**
 * useAssignmentSubmission
 * ----------------------------------------------------------------------------
 * Centralized hook for managing assignment submission state in the LMS frontend.
 * - Handles loading assignment details and previous submissions.
 * - Manages answer field state and uploads (including multi-file).
 * - Handles loading, submitting, success, and error feedback.
 * - All code is backend-ready, with no local data, sample logic, or demo defaults.
 * - To connect to your backend, replace fetch endpoints/API logic with your client.
 *
 * Usage Notes:
 * - Directly suitable for backend-driven forms: updates, reload, real network error feedback.
 * - No internal demo/sample logic.
 */

import { useCallback, useEffect, useState } from 'react';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export function useAssignmentSubmission({ assignmentId }) {
  // Assignment and submission state
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  // Answer fields and file uploads
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState([]);

  // UI status flags
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch assignment details (and prior submission if it exists).
   * Update assignment, submission, and input field state.
   */
  const loadAssignment = useCallback(async () => {
    if (!assignmentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submission`, {
        method: 'GET',
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to load assignment');
      }
      const data = await res.json();
      setAssignment(data.assignment);
      setSubmission(data.submission || null);
      setAnswers(data.submission?.answers || {});
      setFiles([]); // Reset file field on load (not persisted after submit)
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  /**
   * Set answer value for a particular field/key.
   * Supports controlled inputs in forms.
   */
  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Update the files array (attached files: File[]).
   */
  const setUploadFiles = useCallback((filesArray = []) => {
    setFiles(Array.isArray(filesArray) ? filesArray : []);
  }, []);

  /**
   * Submit assignment answers + files.
   * Will POST JSON (if no files) or FormData (if files attached) for backend compatibility.
   * Throws on error so forms can respond to errors.
   */
  const submit = useCallback(async () => {
    if (!assignmentId) return;
    setSubmitting(true);
    setError(null);

    try {
      let responseData;
      // Use FormData for file uploads; otherwise use JSON body
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('answers', JSON.stringify(answers));
        files.forEach((file, idx) => {
          formData.append(`file${idx + 1}`, file);
        });
        const res = await fetch(`/api/assignments/${assignmentId}/submission`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || 'Failed to submit assignment');
        }
        responseData = await res.json();
      } else {
        const res = await fetch(`/api/assignments/${assignmentId}/submission`, {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ answers }),
        });
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || 'Failed to submit assignment');
        }
        responseData = await res.json();
      }
      setSubmission(responseData.submission || responseData);
      return responseData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [assignmentId, answers, files]);

  // Fetch initial data on mount or when assignmentId changes
  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  return {
    assignment,      // assignment metadata (title, description, etc.)
    submission,      // latest submission (if any)
    answers,         // answer form state (object)
    files,           // files to upload (File[])
    loading,         // fetching state
    submitting,      // submit-in-progress state
    error,           // error object/message
    hasSubmitted: !!submission,
    setAnswer,       // update a single answer field
    setFiles: setUploadFiles, // update file upload array
    reload: loadAssignment,   // manual refresh
    submit,          // submit (returns promise)
  };
}

/**
 * Production/Architecture Notes:
 * - No demo/sample/mock code; all logic expects backend integration.
 * - To swap actual fetch with your own API client, only replace fetch endpoints as needed.
 * - Can be attached to any assignment/quiz UI and supports full loading, error, and submitting feedback.
 */