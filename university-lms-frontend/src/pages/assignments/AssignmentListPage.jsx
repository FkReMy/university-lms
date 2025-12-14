/**
 * AssignmentListPage Component (Production)
 * ----------------------------------------------------------------------------
 * Lists all assignments for a course, section, or department.
 * - Loads from global assignments store.
 * - Supports search and status filtering.
 * - Uses global UI components and styles.
 * - Ready for production (no sample/mock data).
 * - Add/edit/view/remove stubs ready for integration.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import styles from './AssignmentListPage.module.scss';

// Global assignment store/actions
import { useAssignmentStore, selectAssignments, selectAssignmentLoading } from '@/store/assignmentStore';
import assignmentApi from '@/services/api/assignmentApi'; // Must be implemented: real API client

export default function AssignmentListPage() {
  // Global store selectors and actions
  const assignments = useAssignmentStore(selectAssignments);
  const loading = useAssignmentStore(selectAssignmentLoading);
  const setAssignments = useAssignmentStore((s) => s.setAssignments);
  const startLoading = useAssignmentStore((s) => s.startLoading);
  const stopLoading = useAssignmentStore((s) => s.stopLoading);
  const setError = useAssignmentStore((s) => s.setError);

  // Local filter/search states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const navigate = useNavigate();

  // Load assignments from API/store on mount
  useEffect(() => {
    async function fetchAssignments() {
      try {
        startLoading();
        const result = await assignmentApi.list(); // expects an array from backend
        setAssignments(result || []);
      } catch (err) {
        setError('Failed to load assignments.');
      } finally {
        stopLoading();
      }
    }
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract all unique statuses for filter
  const statuses = useMemo(
    () => Array.from(new Set(assignments.map(a => a.status))).filter(Boolean).sort(),
    [assignments]
  );

  // Efficient filter
  const filteredAssignments = useMemo(
    () => assignments.filter(a => {
      const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || a.status === status;
      return matchesSearch && matchesStatus;
    }),
    [assignments, search, status]
  );

  // Status badge using global Badge component
  function StatusBadge(s) {
    let variant = 'default';
    if (s === 'Open') variant = 'success';
    if (s === 'Closed') variant = 'danger';
    return <Badge variant={variant}>{s}</Badge>;
  }

  // Date formatting helper
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

  // Navigation handlers (to be completed)
  const handleAdd = useCallback(() => {
    navigate('/assignments/new');
  }, [navigate]);
  const handleEdit = useCallback((id) => {
    navigate(`/assignments/${id}/edit`);
  }, [navigate]);
  const handleRemove = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    try {
      startLoading();
      await assignmentApi.remove(id);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      setError('Failed to remove assignment.');
    } finally {
      stopLoading();
    }
  }, [assignments, setAssignments, startLoading, stopLoading, setError]);

  return (
    <div className={styles.assignmentListPage}>
      <h1 className={styles.assignmentListPage__title}>Assignments</h1>
      <div className={styles.assignmentListPage__controls}>
        <Input
          className={styles.assignmentListPage__search}
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.assignmentListPage__statusSelect}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option value={s} key={s}>{s}</option>
          ))}
        </Select>
        <Button
          className={styles.assignmentListPage__addBtn}
          type="button"
          variant="primary"
          onClick={handleAdd}
        >
          + Add Assignment
        </Button>
      </div>
      <div className={styles.assignmentListPage__listArea}>
        {loading ? (
          <div className={styles.assignmentListPage__loading}>
            Loading assignments&hellip;
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className={styles.assignmentListPage__empty}>
            No assignments found.
          </div>
        ) : (
          <table className={styles.assignmentListPage__table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map(a => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{fmt(a.due)}</td>
                  <td>{StatusBadge(a.status)}</td>
                  <td>
                    <Button
                      className={styles.assignmentListPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleEdit(a.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      className={styles.assignmentListPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleRemove(a.id)}
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
 * - Uses only real backend API and global state via Zustand, no demo/sample arrays.
 * - Uses only unified, accessible design system Button/Badge/Input/Select components.
 * - All CRUD actions ready for backend connection and UX polish (modals/redirects).
 */