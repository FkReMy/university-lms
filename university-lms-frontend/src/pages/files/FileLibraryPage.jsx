/**
 * FileLibraryPage Component
 * ----------------------------------------------------------
 * Lists and manages files/resources for a course/section/library,
 * for students and instructors (read/download, ready for upload/delete).
 *
 * Responsibilities:
 * - List all available files with name, size, type, uploaded date/user.
 * - Search/filter by name/type.
 * - Ready for expansion: upload/remove/download files.
 *
 * Usage:
 *   <Route path="/files" element={<FileLibraryPage />} />
 */

import React, { useEffect, useState } from 'react';
import styles from './FileLibraryPage.module.scss';

// Utility formatters
function fmtSize(bytes) {
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(0) + ' KB';
  return bytes + ' B';
}
function fmtDate(dateStr) {
  if (!dateStr) return '';
  const dt = new Date(dateStr);
  return dt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Demo: file list (would fetch from API)
const DEMO_FILES = [
  {
    id: 'f1',
    name: 'assignment1.pdf',
    size: 411208,
    type: 'PDF',
    uploadedAt: '2025-02-11T16:04',
    uploader: 'Prof. Smith',
  },
  {
    id: 'f2',
    name: 'welcome.mp4',
    size: 5021129,
    type: 'Video',
    uploadedAt: '2025-02-12T13:31',
    uploader: 'Prof. Smith',
  },
  {
    id: 'f3',
    name: 'lecture_notes_week2.docx',
    size: 182400,
    type: 'DOCX',
    uploadedAt: '2025-02-19T09:13',
    uploader: 'Jane Student',
  },
  {
    id: 'f4',
    name: 'sample.py',
    size: 6400,
    type: 'Python',
    uploadedAt: '2025-03-01T14:14',
    uploader: 'John Lee',
  },
];

export default function FileLibraryPage() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate API file loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFiles(DEMO_FILES);
      setLoading(false);
    }, 700);
  }, []);

  // Unique types for filter
  const types = [...new Set(files.map(f => f.type))].sort();

  // Filter by name/type
  const filtered = files.filter(f => {
    const matchName = f.name.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || f.type === type;
    return matchName && matchType;
  });

  return (
    <div className={styles.fileLibraryPage}>
      <h1 className={styles.fileLibraryPage__title}>
        File Library
      </h1>
      <div className={styles.fileLibraryPage__controls}>
        <input
          className={styles.fileLibraryPage__search}
          type="text"
          placeholder="Search by file name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.fileLibraryPage__typeSelect}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          className={styles.fileLibraryPage__uploadBtn}
          type="button"
          // onClick={() => ... future upload ...}
        >
          + Upload File
        </button>
      </div>
      <div className={styles.fileLibraryPage__listArea}>
        {loading ? (
          <div className={styles.fileLibraryPage__loading}>
            Loading files…
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.fileLibraryPage__empty}>
            No files found.
          </div>
        ) : (
          <table className={styles.fileLibraryPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{fmtSize(f.size)}</td>
                  <td>{f.type}</td>
                  <td>{fmtDate(f.uploadedAt)}</td>
                  <td>{f.uploader}</td>
                  <td>
                    <button
                      className={styles.fileLibraryPage__actionBtn}
                      // onClick={() => ... download logic ...}
                    >
                      Download
                    </button>
                    <button
                      className={styles.fileLibraryPage__actionBtn}
                      // onClick={() => ... remove logic ...}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}