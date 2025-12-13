/**
 * AcademicSessionsPage Component
 * ----------------------------------------------------------
 * Admin page for listing and managing academic sessions/semesters.
 *
 * Responsibilities:
 * - Lists all sessions with their date range and status (active, planned, ended).
 * - Allows searching or filtering by name or status.
 * - Ready for expansion: add/edit/end session actions.
 *
 * Usage:
 *   <Route path="/sessions" element={<AcademicSessionsPage />} />
 */

import { useEffect, useState } from 'react';
import styles from './AcademicSessionsPage.module.scss';

export default function AcademicSessionsPage() {
  // State for session list and search/filter
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSessions([
        {
          id: 1,
          name: 'Spring 2025',
          start: '2025-01-14',
          end: '2025-05-10',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Fall 2024',
          start: '2024-08-20',
          end: '2024-12-08',
          status: 'Ended'
        },
        {
          id: 3,
          name: 'Summer 2025',
          start: '2025-06-01',
          end: '2025-08-10',
          status: 'Planned'
        }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Status filter options
  const statuses = [
    ...new Set(sessions.map(s => s.status))
  ].sort();

  // Filtered session list
  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || s.status === status;
    return matchesSearch && matchesStatus;
  });

  // Status badge
  function statusBadge(s) {
    let bg = "#dedede", color = "#213050";
    if (!s) return null;
    if (s === 'Active') { bg = "#e5ffe9"; color = "#179a4e"; }
    if (s === 'Planned') { bg = "#e0edff"; color = "#2563eb"; }
    if (s === 'Ended') { bg = "#fbeaea"; color = "#e62727"; }
    return (
      <span
        style={{
          background: bg,
          color: color,
          fontWeight: 600,
          fontSize: "0.96em",
          borderRadius: "1em",
          padding: "0.13em 0.85em",
        }}
      >
        {s}
      </span>
    );
  }

  // Nicely format date
  function fmt(dateStr) {
    if (!dateStr) return '';
    const dt = new Date(dateStr);
    return dt.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  return (
    <div className={styles.academicSessionsPage}>
      <h1 className={styles.academicSessionsPage__title}>Academic Sessions</h1>
      <div className={styles.academicSessionsPage__controls}>
        <input
          className={styles.academicSessionsPage__search}
          type="text"
          placeholder="Search session by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.academicSessionsPage__statusSelect}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option value={s} key={s}>{s}</option>
          ))}
        </select>
        <button
          className={styles.academicSessionsPage__addBtn}
          type="button"
          // onClick={() => ... future add dialog ...}
        >
          + Add Session
        </button>
      </div>
      <div className={styles.academicSessionsPage__listArea}>
        {loading ? (
          <div className={styles.academicSessionsPage__loading}>
            Loading sessions…
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className={styles.academicSessionsPage__empty}>
            No sessions found.
          </div>
        ) : (
          <table className={styles.academicSessionsPage__table}>
            <thead>
              <tr>
                <th>Session</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{fmt(s.start)}</td>
                  <td>{fmt(s.end)}</td>
                  <td>{statusBadge(s.status)}</td>
                  <td>
                    <button
                      className={styles.academicSessionsPage__actionBtn}
                      // onClick={() => ... future edit dialog ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.academicSessionsPage__actionBtn}
                      // onClick={() => ... end/delete logic ...}
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