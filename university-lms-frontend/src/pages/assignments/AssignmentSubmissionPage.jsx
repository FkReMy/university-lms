/**
 * AssignmentSubmissionPage Component
 * ----------------------------------------------------------
 * Student page for submitting an assignment (form, file upload).
 *
 * Responsibilities:
 * - Shows assignment info: title, due date, and description.
 * - Allows student to upload and submit a file.
 * - Demo: handles file upload/removal, loading/thank you state.
 *
 * Usage:
 *   <Route path="/assignments/:id/submit" element={<AssignmentSubmissionPage />} />
 */

import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import styles from './AssignmentSubmissionPage.module.scss';
import { ROUTES } from '@/lib/constants';

// Demo assignment info (replace with API in prod)
const DEMO_ASSIGNMENT = {
  id: 1,
  title: 'Programming Fundamentals Assignment 1',
  due: '2025-02-22T21:00',
  description: `Write a program in Python to calculate the factorial of a number.
Upload your .py file below.`,
};

export default function AssignmentSubmissionPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef();

  // Simulate assignment fetch
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAssignment({ ...DEMO_ASSIGNMENT, id: assignmentId || DEMO_ASSIGNMENT.id });
      setLoading(false);
    }, 600);
  }, [assignmentId]);

  // Handle file upload
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  // Remove selected file
  function handleRemoveFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Mock submit
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  // Format UI date
  function fmt(dateStr) {
    if (!dateStr) return '';
    const dt = new Date(dateStr);
    return dt.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            Assignment #{assignmentId || assignment.id} — Due: <b>{fmt(assignment.due)}</b>
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
                    >&#215;</button>
                  </div>
                )}
              </div>
              <div className={styles.assignmentSubmissionPage__actions}>
                <button
                  className={styles.assignmentSubmissionPage__submitBtn}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
