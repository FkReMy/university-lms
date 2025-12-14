/**
 * AcademicSessionsPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin interface for listing and managing academic sessions (semesters).
 * - Lists all sessions with name, date range, and status.
 * - Search/filter by session name or status.
 * - All UI uses global design system (Input, Select, Button, Badge).
 * - No sample/demo logic, 100% backend/API-driven.
 * - Ready for future add/edit/end session dialog/modal.
 *
 * Usage:
 *   <Route path="/sessions" element={<AcademicSessionsPage />} />
 */

import { useEffect, useMemo, useState, useCallback } from 'react';

import styles from './AcademicSessionsPage.module.scss';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import sessionApi from '@/services/api/sessionApi'; // Must provide .list(), etc.

export default function AcademicSessionsPage() {
  // State: session list and filter UI
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load sessions from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchSessions() {
      setLoading(true);
      try {
        const data = await sessionApi.list();
        if (isMounted) setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setSessions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSessions();
    return () => { isMounted = false; };
  }, []);

  // Unique sorted status dropdown options
  const statuses = useMemo(
    () => [...new Set(sessions.map(s => s.status))].filter(Boolean).sort(),
    [sessions]
  );

  // Filtered session list by name/status
  const filteredSessions = useMemo(
    () =>
      sessions.filter(s => {
        const matchesSearch =
          s.name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || s.status === status;
        return matchesSearch && matchesStatus;
      }),
    [sessions, search, status]
  );

  // Badge style for session status
  function statusBadge(s) {
    let variant = "default";
    if (/active/i.test(s)) variant = "success";
    else if (/planned/i.test(s)) variant = "primary";
    else if (/ended/i.test(s)) variant = "danger";
    return <Badge variant={variant}>{s}</Badge>;
  }

  // Format date for display
  function fmt(dateStr) {
    if (!dateStr) return '';
    const dt = new Date(dateStr);
    return dt.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  // Handlers for future actions
  const handleAdd = useCallback(() => {
    // TODO: Implement session add dialog/modal
  }, []);
  const handleEdit = useCallback((id) => {
    // TODO: Implement session edit dialog/modal
  }, []);
  const handleRemove = useCallback((id) => {
    // TODO: Implement session end/remove logic
  }, []);

  return (
    <div className={styles.academicSessionsPage}>
      <h1 className={styles.academicSessionsPage__title}>Academic Sessions</h1>
      <div className={styles.academicSessionsPage__controls}>
        <Input
          className={styles.academicSessionsPage__search}
          type="text"
          placeholder="Search session by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.academicSessionsPage__statusSelect}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option value={s} key={s}>{s}</option>
          ))}
        </Select>
        <Button
          className={styles.academicSessionsPage__addBtn}
          type="button"
          variant="primary"
          onClick={handleAdd}
        >
          + Add Session
        </Button>
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
                    <Button
                      className={styles.academicSessionsPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleEdit(s.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      className={styles.academicSessionsPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleRemove(s.id)}
                    >
                      Remove
                    </Button>
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

/**
 * Production Notes:
 * - API-driven via sessionApi.list().
 * - All filter/search and modals use unified design system.
 * - Ready for future expansion: modals, dialogs, inline edit, etc.
 * - No hardcoded/sample data anywhere.
 */