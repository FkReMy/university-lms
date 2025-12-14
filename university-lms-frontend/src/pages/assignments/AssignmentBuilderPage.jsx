/**
 * AssignmentBuilderPage Component (Production)
 * ----------------------------------------------------------------------------
 * Unified global LMS page for creating/editing assignments.
 * - Handles: title, due, description, attachment file.
 * - Supports existing assignment editing or clean new creation.
 * - All state wired through proper hooks; demo/sample logic removed.
 * - File upload and UI ready for backend FastAPI integration.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './AssignmentBuilderPage.module.scss';

import assignmentApi from '@/services/api/assignmentApi'; // You must implement: CRUD for assignments
import fileApi from '@/services/api/fileApi';
import { useAssignmentStore , selectCurrentAssignment } from '@/store/assignmentStore';

/**
 * AssignmentBuilderPage — handles both new and edit modes.
 */
export default function AssignmentBuilderPage() {
  // Optional param: assignment id (if editing)
  const { id } = useParams();
  const navigate = useNavigate();

  // Global store hooks
  const currentAssignment = useAssignmentStore(selectCurrentAssignment);
  const startLoading = useAssignmentStore((s) => s.startLoading);
  const stopLoading = useAssignmentStore((s) => s.stopLoading);
  const setError = useAssignmentStore((s) => s.setError);
  const setCurrentAssignment = useAssignmentStore((s) => s.setCurrentAssignment);

  // Local form state
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();

  // Load assignment for edit, or reset for new
  useEffect(() => {
    async function fetchOrInit() {
      startLoading();
      try {
        if (id) {
          // Edit mode: load assignment detail
          const data = await assignmentApi.get(id);
          setCurrentAssignment(data);
          setTitle(data.title || '');
          setDue(data.due || '');
          setDescription(data.description || '');
        } else {
          // New mode: blank form
          setCurrentAssignment(null);
          setTitle('');
          setDue('');
          setDescription('');
        }
        setFile(null);
      } catch (err) {
        setError('Failed to load assignment.');
      } finally {
        stopLoading();
      }
    }
    fetchOrInit();
    // eslint-disable-next-line
  }, [id]);

  // File change handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Remove file from UI input and state
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save handler (create or update)
  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    startLoading();
    try {
      let uploadedFileId = null;

      // Upload attachment if any
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        const res = await fileApi.upload(formData);
        uploadedFileId = res.id; // backend should return file id
        setUploading(false);
      }

      const payload = {
        title,
        due,
        description,
        fileId: uploadedFileId || (currentAssignment ? currentAssignment.fileId : null),
      };

      let saved;
      if (id) {
        // Update existing
        saved = await assignmentApi.update(id, payload);
      } else {
        // Create new
        saved = await assignmentApi.create(payload);
      }

      // Optionally: optimistic UI update or redirect
      navigate(`/assignments/${saved.id}`);
    } catch (err) {
      setError('Failed to save assignment.');
    } finally {
      stopLoading();
    }
    // eslint-disable-next-line
  }, [title, due, description, file, id, currentAssignment, navigate]);

  const loading = useAssignmentStore((s) => s.loading);

  return (
    <div className={styles.assignmentBuilderPage}>
      <h1 className={styles.assignmentBuilderPage__title}>
        {id ? (title || 'Edit Assignment') : 'New Assignment'}
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
                disabled={uploading}
              >
                {id ? 'Save Changes' : 'Create Assignment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}