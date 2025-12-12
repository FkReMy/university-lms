/**
 * useAssignmentSubmission
 * ----------------------------------------------------------
 * Manages fetch and submission state for an assignment attempt in the LMS frontend.
 *
 * Responsibilities:
 * - Fetch assignment details and (optionally) the user's prior submission.
 * - Track field state (text answers, file uploads, etc).
 * - Handle submission, uploading, and error management.
 * - Expose status flags for UI loading/submitting/error feedback.
 *
 * Notes:
 * - Replace fetch/file upload operations with your own API client as needed.
 * - Client-side only; server is a source of truth for correctness.
 */

import { useCallback, useEffect, useState } from 'react';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export function useAssignmentSubmission({ assignmentId }) {
  // Assignment details and user's prior submission (if any)
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  // Form state ("answers" could be an object, text, or files, depending on assignment)
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState([]);

  // UX state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load assignment details (and optionally prior submission)
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
      setFiles([]); // Files reset on load
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  /**
   * Update the answer field for a particular question/key
   */
  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Update files array (e.g. from input type="file")
   * Expects: Array of File objects
   */
  const setUploadFiles = useCallback((filesArray = []) => {
    setFiles(Array.isArray(filesArray) ? filesArray : []);
  }, []);

  /**
   * Submit the assignment (with answers and files)
   * Replace implementation as needed for backend contracts.
   */
  const submit = useCallback(async () => {
    if (!assignmentId) return;
    setSubmitting(true);
    setError(null);

    try {
      let responseData;

      // If submitting files, use FormData
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('answers', JSON.stringify(answers));
        files.forEach((file, idx) => {
          formData.append(`file${idx + 1}`, file);
        });
        // Could also include other metadata if needed
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
        // No files, submit JSON
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

  // Load on mount or when assignmentId changes
  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  return {
    assignment,    // assignment info (title, description, questions, ...)
    submission,    // user's prior submission object (or null)
    answers,       // form field state (object)
    files,         // file attachments (array of File, not submitted yet)
    loading,       // is fetching initial data?
    submitting,    // is submitting?
    error,         // error to present to the user (if any)
    hasSubmitted: !!submission,
    setAnswer,     // update a single answer value
    setFiles: setUploadFiles, // set attached files
    reload: loadAssignment,   // reload assignment state from API
    submit,        // fire off the submission
  };
}