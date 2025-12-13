/**
 * AssignmentListPage Component
 * ----------------------------------------------------------
 * Lists assignments for a course, section, or department.
 *
 * Responsibilities:
 * - Lists assignments with due date, title, and status (open/closed).
 * - Allows searching/filtering by title or status.
 * - Ready for expansion: add/edit/view/remove actions.
 *
 * Usage:
 *   <Route path="/assignments" element={<AssignmentListPage />} />
 */

import React, { useEffect, useState } from 'react';

import styles from './AssignmentListPage.module.scss';

export default function AssignmentListPage() {
  // State for assignments and search/filter
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate API load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: 'Programming Fundamentals Assignment 1',
          due: '2025-02-22T21:00',
          status: 'Open',
        },
        {
          id: 2,
          title: 'Calculus Homework Set 3',
          due: '2025-03-10T23:59',
          status: 'Closed',
        },
        {
          id: 3,
          title: 'Business Report',
          due: '2025-02-28T17:40',
          status: 'Open',
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Unique status values
  const statuses = [...new Set(assignments.map(a => a.status))].sort();

  // Filtered assignments
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || a.status === status;
    return matchesSearch && matchesStatus;
  });

  // Status badge
  function statusBadge(s) {
    let bg = "#dedede", color = "#213050";
    if (!s) return null;
    if (s === 'Open') { bg = "#e5ffe9"; color = "#179a4e"; }
    if (s === 'Closed') { bg = "#fbeaea"; color = "#e62727"; }
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

  // Format UI date/time
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
    <div className={styles.assignmentListPage}>
      <h1 className={styles.assignmentListPage__title}>Assignments</h1>
      <div className={styles.assignmentListPage__controls}>
        <input
          className={styles.assignmentListPage__search}
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.assignmentListPage__statusSelect}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option value={s} key={s}>{s}</option>
          ))}
        </select>
        <button
          className={styles.assignmentListPage__addBtn}
          type="button"
          // onClick={() => ... future add assignment ...}
        >
          + Add Assignment
        </button>
      </div>
      <div className={styles.assignmentListPage__listArea}>
        {loading ? (
          <div className={styles.assignmentListPage__loading}>
            Loading assignments…
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
                  <td>{statusBadge(a.status)}</td>
                  <td>
                    <button
                      className={styles.assignmentListPage__actionBtn}
                      // onClick={() => ... edit/view logic ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.assignmentListPage__actionBtn}
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