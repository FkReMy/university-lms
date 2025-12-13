/**
 * AssignmentBuilderPage Component
 * ----------------------------------------------------------
 * Page for building or editing an assignment (title, deadline, description, file, etc).
 *
 * Responsibilities:
 * - Editable form for assignment title, due date/time, description, file upload.
 * - Optionally supports existing assignment editing (loads demo/existing data).
 * - Ready for expansion: grading options, attachments, assignment type.
 *
 * Usage:
 *   <Route path="/assignments/:id/edit" element={<AssignmentBuilderPage />} />
 *   <Route path="/assignments/new" element={<AssignmentBuilderPage />} />
 */

import React, { useEffect, useState, useRef } from 'react';

import styles from './AssignmentBuilderPage.module.scss';

// --- Demo default assignment ---
const DEMO_ASSIGNMENT = {
  title: 'Programming Fundamentals Assignment 1',
  due: '2025-02-22T21:00',
  description: `Write a program in Python to calculate the factorial of a number.
Upload your .py file using the form below.`,
  file: null,
};

export default function AssignmentBuilderPage() {
  // State for assignment fields
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  // Load assignment for editing, or reset for new
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTitle(DEMO_ASSIGNMENT.title);
      setDue(DEMO_ASSIGNMENT.due);
      setDescription(DEMO_ASSIGNMENT.description);
      setFile(null);
      setLoading(false);
    }, 700);
  }, []);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleRemoveFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Handler for save (demo)
  function handleSave(e) {
    e.preventDefault();
    // Would call API, send {title, due, description, file}
    alert('Assignment saved!\n\n(Demo only)');
  }

  return (
    <div className={styles.assignmentBuilderPage}>
      <h1 className={styles.assignmentBuilderPage__title}>
        {title || 'New Assignment'}
      </h1>
      <div className={styles.assignmentBuilderPage__formArea}>
        {loading ? (
          <div className={styles.assignmentBuilderPage__loading}>Loading assignment...</div>
        ) : (
          <form
            className={styles.assignmentBuilderPage__form}
            onSubmit={handleSave}
            autoComplete="off"
            encType="multipart/form-data"
          >
            {/* Assignment title */}
            <div className={styles.assignmentBuilderPage__fieldRow}>
              <label className={styles.assignmentBuilderPage__label}>
                Title
                <input
                  className={styles.assignmentBuilderPage__input}
                  type="text"
                  required
                  maxLength={120}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>
            </div>
            {/* Due date/time */}
            <div className={styles.assignmentBuilderPage__fieldRow}>
              <label className={styles.assignmentBuilderPage__label}>
                Due Date/Time
                <input
                  className={styles.assignmentBuilderPage__input}
                  type="datetime-local"
                  value={due}
                  onChange={e => setDue(e.target.value)}
                  required
                />
              </label>
            </div>
            {/* Description */}
            <div className={styles.assignmentBuilderPage__fieldRow}>
              <label className={styles.assignmentBuilderPage__label}>
                Description
                <textarea
                  className={styles.assignmentBuilderPage__textarea}
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={700}
                  placeholder="Assignment instructions..."
                />
              </label>
            </div>
            {/* File upload */}
            <div className={styles.assignmentBuilderPage__fieldRow}>
              <label className={styles.assignmentBuilderPage__label}>
                Attachment (.zip, .pdf, .docx, .py, etc)
                <input
                  className={styles.assignmentBuilderPage__fileInput}
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.zip,.docx,.py,.txt"
                />
              </label>
              {file && (
                <div className={styles.assignmentBuilderPage__fileChip}>
                  {file.name}
                  <button
                    type="button"
                    className={styles.assignmentBuilderPage__fileRemoveBtn}
                    onClick={handleRemoveFile}
                    title="Remove file"
                    aria-label="Remove file"
                  >&#215;</button>
                </div>
              )}
            </div>
            {/* Actions */}
            <div className={styles.assignmentBuilderPage__actions}>
              <button
                type="submit"
                className={styles.assignmentBuilderPage__saveBtn}
              >
                Save Assignment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}