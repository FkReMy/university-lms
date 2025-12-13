/**
 * SubmissionReviewPage Component
 * ----------------------------------------------------------
 * Displays/grads a student's submission for an assignment.
 *
 * Responsibilities:
 * - Shows assignment and student info.
 * - Shows submitted file or content (demo: filename only).
 * - Allows grader to enter grade, leave feedback, or download file.
 * - Demo: handles grade/save actions; supports loading/thank you.
 *
 * Usage:
 *   <Route path="/grading/submission/:id" element={<SubmissionReviewPage />} />
 */

import React, { useEffect, useState } from 'react';
import styles from './SubmissionReviewPage.module.scss';

// Demo: static data (would come from API)
const DEMO = {
  assignment: {
    id: 1,
    title: 'Programming Fundamentals Assignment 1',
    maxGrade: 100,
    description: `Write a program in Python to calculate the factorial of a number.`,
  },
  student: {
    id: 207,
    name: 'Jane Student',
  },
  submission: {
    id: 501,
    fileName: 'jane_a1.py',
    submittedAt: '2025-02-20T18:45',
    grade: 96,
    feedback: "Well done! Clean code and correct output.",
  },
};

export default function SubmissionReviewPage() {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [student, setStudent] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load demo data (simulate API)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAssignment(DEMO.assignment);
      setStudent(DEMO.student);
      setSubmission(DEMO.submission);
      setGrade(DEMO.submission.grade);
      setFeedback(DEMO.submission.feedback);
      setLoading(false);
    }, 700);
  }, []);

  // Save grading (mock)
  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }, 1000);
  }

  // Format
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
    <div className={styles.submissionReviewPage}>
      {loading ? (
        <div className={styles.submissionReviewPage__loading}>Loading submission…</div>
      ) : !assignment || !student || !submission ? (
        <div className={styles.submissionReviewPage__error}>Submission not found.</div>
      ) : (
        <div className={styles.submissionReviewPage__mainBox}>
          <h1 className={styles.submissionReviewPage__title}>
            Review Submission
          </h1>
          <div className={styles.submissionReviewPage__metaArea}>
            <div>
              <b>Assignment:</b> {assignment.title}
            </div>
            <div>
              <b>Student:</b> {student.name}
            </div>
            <div>
              <b>Submitted:</b> {fmt(submission.submittedAt)}
            </div>
          </div>
          <div className={styles.submissionReviewPage__desc}>
            {assignment.description}
          </div>
          <div className={styles.submissionReviewPage__fileArea}>
            <div>
              <b>Submitted File:</b>{" "}
              <span className={styles.submissionReviewPage__fileName}>
                {submission.fileName}
              </span>
              {/* Download link would use backend file API */}
              <a
                href="#"
                className={styles.submissionReviewPage__downloadBtn}
                style={{ marginLeft: 20 }}
                download
                tabIndex={-1}
                onClick={e => e.preventDefault()} // Demo only
              >
                Download
              </a>
            </div>
          </div>
          <form
            className={styles.submissionReviewPage__form}
            onSubmit={handleSave}
            autoComplete="off"
          >
            <div className={styles.submissionReviewPage__gradeRow}>
              <label className={styles.submissionReviewPage__label}>
                Grade (out of {assignment.maxGrade})
                <input
                  className={styles.submissionReviewPage__input}
                  type="number"
                  min="0"
                  max={assignment.maxGrade}
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className={styles.submissionReviewPage__fieldRow}>
              <label className={styles.submissionReviewPage__label}>
                Feedback
                <textarea
                  className={styles.submissionReviewPage__textarea}
                  rows={4}
                  maxLength={600}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Enter any comments or feedback for the student…"
                />
              </label>
            </div>
            <div className={styles.submissionReviewPage__actions}>
              <button
                className={styles.submissionReviewPage__saveBtn}
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Grade"}
              </button>
              {saved && (
                <div className={styles.submissionReviewPage__savedMsg}>
                  Grade saved!
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}