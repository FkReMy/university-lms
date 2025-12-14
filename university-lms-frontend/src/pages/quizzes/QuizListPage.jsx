/**
 * QuizListPage Component
 * ----------------------------------------------------------
 * List of quizzes for a course or department.
 *
 * Responsibilities:
 * - Show all available quizzes, their status, and main info.
 * - Allows searching/filtering by title or status.
 * - Ready for expansion: add/edit/view/close quizzes.
 * - Uses shared UI components (Input, Select, Button, Badge) for design consistency.
 *
 * Usage:
 *   <Route path="/quizzes" element={<QuizListPage />} />
 */

import { useEffect, useState } from 'react';

import Badge from '../../components/ui/badge';   // Consistent styled badge
import Button from '../../components/ui/button'; // Consistent styled button
import Input from '../../components/ui/input';   // Consistent styled input
import Select from '../../components/ui/select'; // Consistent styled select

import styles from './QuizListPage.module.scss';

export default function QuizListPage() {
  // State for quiz data and search/filter
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate API load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuizzes([
        {
          id: 1,
          title: 'Python Fundamentals Quiz',
          open: '2025-02-10T10:00',
          close: '2025-02-12T18:30',
          course: 'CSCI 101',
          section: 'M/W 10:30',
          status: 'Open',
        },
        {
          id: 2,
          title: 'Calculus Midterm',
          open: '2025-03-18T09:00',
          close: '2025-03-20T20:00',
          course: 'MATH 195',
          section: 'T/Th 09:00',
          status: 'Closed',
        },
        {
          id: 3,
          title: 'Business Communication Quiz 1',
          open: '2025-01-27T12:00',
          close: '2025-01-27T13:30',
          course: 'BUS 240',
          section: 'F 12:00',
          status: 'Open',
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Unique status options (for filter dropdown)
  const statuses = [...new Set(quizzes.map(q => q.status))].sort();

  // Filter quizzes based on search and status
  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || q.status === status;
    return matchesSearch && matchesStatus;
  });

  // Status badge (using shared Badge component)
  function statusBadge(s) {
    let variant = "default";
    if (s === 'Open') variant = "success";
    if (s === 'Closed') variant = "danger";
    return <Badge variant={variant}>{s}</Badge>;
  }

  // Format date/time for UI
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
    <div className={styles.quizListPage}>
      <h1 className={styles.quizListPage__title}>Quizzes</h1>
      <div className={styles.quizListPage__controls}>
        <Input
          className={styles.quizListPage__search}
          type="text"
          placeholder="Search title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.quizListPage__statusSelect}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option value={s} key={s}>{s}</option>
          ))}
        </Select>
        <Button
          className={styles.quizListPage__addBtn}
          type="button"
          variant="primary"
          onClick={() => {}}
          // Future: open add quiz dialog
        >
          + Add Quiz
        </Button>
      </div>
      <div className={styles.quizListPage__listArea}>
        {loading ? (
          <div className={styles.quizListPage__loading}>
            Loading quizzes…
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className={styles.quizListPage__empty}>
            No quizzes found.
          </div>
        ) : (
          <table className={styles.quizListPage__table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Open</th>
                <th>Close</th>
                <th>Course</th>
                <th>Section</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map(q => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>{fmt(q.open)}</td>
                  <td>{fmt(q.close)}</td>
                  <td>{q.course}</td>
                  <td>{q.section}</td>
                  <td>{statusBadge(q.status)}</td>
                  <td>
                    <Button
                      className={styles.quizListPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      // onClick={() => ... edit logic ...}
                    >
                      Edit
                    </Button>
                    <Button
                      className={styles.quizListPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      // onClick={() => ... remove logic ...}
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
 * Notes:
 * - Uses shared Input, Select, Button, and Badge components from your UI library throughout for design system consistency.
 * - Status badge is now styled via the Badge component, not inline styles.
 * - Action buttons and controls are also consistent with your global app UI.
 */