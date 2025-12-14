/**
 * SubmissionReviewPage Component (Production)
 * ----------------------------------------------------------------------------
 * Displays and grades a student's submission for an assignment.
 * - Shows assignment and student info, attached file information.
 * - Allows instructor/grader to enter grade, leave feedback, download file.
 * - All UI uses global components; backend-driven only (no samples/demos).
 *
 * Usage:
 *   <Route path="/grading/submission/:id" element={<SubmissionReviewPage />} />
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './SubmissionReviewPage.module.scss';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea'; // If you have a global textarea, else use <textarea>
import submissionApi from '@/services/api/submissionApi'; // Must provide .get(id), .saveGrade(id, payload), .downloadFile(fileId)

export default function SubmissionReviewPage() {
  const { id: submissionId } = useParams();

  // Internal UI states
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [student, setStudent] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load submission info from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchSubmission() {
      setLoading(true);
      try {
        const data = await submissionApi.get(submissionId);
        if (isMounted) {
          setAssignment(data.assignment || null);
          setStudent(data.student || null);
          setSubmission(data.submission || null);
          setGrade(data.submission?.grade ?? '');
          setFeedback(data.submission?.feedback ?? '');
        }
      } catch (err) {
        if (isMounted) {
          setAssignment(null);
          setStudent(null);
          setSubmission(null);
          setGrade('');
          setFeedback('');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSubmission();
    return () => { isMounted = false; };
  }, [submissionId]);

  // Save grading/feedback to backend
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await submissionApi.saveGrade(submissionId, {
        grade: typeof grade === "string" ? Number(grade) : grade,
        feedback,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (err) {
      // Optionally: show error status/message
    } finally {
      setSaving(false);
    }
  }

  // Download file handler
  function handleDownloadFile(e) {
    e.preventDefault();
    if (submission && submission.fileId) {
      submissionApi.downloadFile(submission.fileId);
    }
  }

  // Format date for readability
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
              <Button
                type="button"
                className={styles.submissionReviewPage__downloadBtn}
                size="sm"
                variant="outline"
                style={{ marginLeft: 20 }}
                onClick={handleDownloadFile}
              >
                Download
              </Button>
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
                <Input
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
                {Textarea ? (
                  <Textarea
                    className={styles.submissionReviewPage__textarea}
                    rows={4}
                    maxLength={600}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Enter any comments or feedback for the student…"
                  />
                ) : (
                  <textarea
                    className={styles.submissionReviewPage__textarea}
                    rows={4}
                    maxLength={600}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Enter any comments or feedback for the student…"
                  />
                )}
              </label>
            </div>
            <div className={styles.submissionReviewPage__actions}>
              <Button
                className={styles.submissionReviewPage__saveBtn}
                type="submit"
                variant="primary"
                loading={saving}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Grade"}
              </Button>
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

/**
 * Production Notes:
 * - All data is loaded/saved through backend (submissionApi).
 * - Uses global Button, Input, and Textarea components for consisency.
 * - All state, navigation, download, and grading are real and scalable.
 * - No demo/sample code; ready for real grading workflow.
 */