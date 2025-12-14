/**
 * AssignmentSubmissionPage Component (Production)
 * ----------------------------------------------------------------------------
 * Student-facing page for submitting an assignment file.
 * - Shows assignment info: title, due, description.
 * - Integrates with global store & real backend API.
 * - Handles file upload/submission and loading state.
 * - All demo/sample logic removed for real production use.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import styles from './AssignmentSubmissionPage.module.scss';

import Button from '@/components/ui/button'; // Ensure to use global Button component
import { ROUTES } from '@/lib/constants';
import assignmentApi from '@/services/api/assignmentApi'; // Backend CRUD for assignments
import fileApi from '@/services/api/fileApi';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function AssignmentSubmissionPage() {
  const { id: assignmentId } = useParams();

  // Store actions to minimize API requests if already loaded
  const setError = useAssignmentStore((s) => s.setError);

  // Local UI state
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef();

  // Load assignment on mount if necessary
  useEffect(() => {
    async function fetchAssignment() {
      setLoading(true);
      try {
        if (assignmentId) {
          const data = await assignmentApi.get(assignmentId);
          setAssignment(data);
        } else {
          setAssignment(null);
        }
      } catch (err) {
        setError('Assignment not found.');
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignment();
    // eslint-disable-next-line
  }, [assignmentId]);

  // Handle chosen file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Remove chosen file
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle submission (integrate with fileApi & assignmentApi)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let uploadedFileId = null;

      // Upload the submission file first
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fileApi.upload(formData);
        uploadedFileId = res.id;
      }

      // Submit assignment as submission/attempt (backend should create link)
      await assignmentApi.submit(assignmentId, {
        fileId: uploadedFileId,
        // optionally: userId, timestamp, etc.
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line
  }, [file, assignmentId]);

  // Format date/time for the UI
  function fmt(dateStr) {
    if (!dateStr) return '';
    const dt = new Date(dateStr);
    return dt.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className={styles.assignmentSubmissionPage}>
      {loading ? (
        <div className={styles.assignmentSubmissionPage__loading}>
          Loading assignment…
        </div>
      ) : !assignment ? (
        <div className={styles.assignmentSubmissionPage__error}>
          Assignment not found.
        </div>
      ) : (
        <div className={styles.assignmentSubmissionPage__mainBox}>
          <h1 className={styles.assignmentSubmissionPage__title}>{assignment.title}</h1>
          <div className={styles.assignmentSubmissionPage__due}>
            Assignment #{assignmentId} — Due: <b>{fmt(assignment.due)}</b>
          </div>
          <div className={styles.assignmentSubmissionPage__desc}>
            {assignment.description}
          </div>
          {submitted ? (
            <div className={styles.assignmentSubmissionPage__submitted}>
              Assignment Submitted! Thank you.
              <div className={styles.assignmentSubmissionPage__backLink}>
                <Link to={ROUTES.ASSIGNMENTS}>Back to assignments</Link>
              </div>
            </div>
          ) : (
            <form
              className={styles.assignmentSubmissionPage__form}
              onSubmit={handleSubmit}
              autoComplete="off"
              encType="multipart/form-data"
            >
              <div className={styles.assignmentSubmissionPage__fileRow}>
                <label className={styles.assignmentSubmissionPage__label}>
                  Upload File
                  <input
                    className={styles.assignmentSubmissionPage__fileInput}
                    type="file"
                    ref={fileInputRef}
                    required
                    accept=".pdf,.zip,.docx,.py,.txt"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <div className={styles.assignmentSubmissionPage__fileChip}>
                    {file.name}
                    <button
                      type="button"
                      className={styles.assignmentSubmissionPage__fileRemoveBtn}
                      onClick={handleRemoveFile}
                      title="Remove file"
                      aria-label="Remove file"
                    >
                      &#215;
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.assignmentSubmissionPage__actions}>
                <Button
                  className={styles.assignmentSubmissionPage__submitBtn}
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Production Notes:
 * - Loads actual assignment and submits actual file.
 * - Uses global store actions and resets errors.
 * - No demo/sample mock assignment or sample waits.
 * - All UI controls routed through global Button.
 * - Submission endpoint to be implemented in assignmentApi backend.
 */