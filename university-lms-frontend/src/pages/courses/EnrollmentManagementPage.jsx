/**
 * EnrollmentManagementPage Component
 * ----------------------------------------------------------
 * Admin/faculty page to view and manage course section enrollments.
 *
 * Responsibilities:
 * - List enrollments: student, course section, status.
 * - Allows filtering/search by student, course, or status.
 * - Ready for future mutation: approve, drop, waitlist, change status.
 *
 * Usage:
 *   <Route path="/enrollments" element={<EnrollmentManagementPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './EnrollmentManagementPage.module.scss';

export default function EnrollmentManagementPage() {
  // State for enrollment records and filters
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate fetching enrollment records
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEnrollments([
        {
          id: 1,
          student: 'Jane Student',
          studentEmail: 'jane.smith@email.edu',
          course: 'CSCI 101',
          courseName: 'Introduction to Computer Science',
          instructor: 'Dr. Smith',
          status: 'enrolled',
        },
        {
          id: 2,
          student: 'Oliver Brown',
          studentEmail: 'oliver.brown@email.edu',
          course: 'BUS 240',
          courseName: 'Business Communication',
          instructor: 'Dr. Turner',
          status: 'waitlisted',
        },
        {
          id: 3,
          student: 'John Lee',
          studentEmail: 'john.lee@email.edu',
          course: 'MATH 195',
          courseName: 'Calculus I',
          instructor: 'Dr. Kapoor',
          status: 'dropped',
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Status options for dropdown
  const statuses = [
    ...new Set(enrollments.map((e) => e.status)),
  ].sort();

  // Filtered enrollments based on search and status
  const filteredEnrollments = enrollments.filter((enr) => {
    const matchesSearch =
      enr.student.toLowerCase().includes(search.toLowerCase()) ||
      enr.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      enr.course.toLowerCase().includes(search.toLowerCase()) ||
      enr.courseName.toLowerCase().includes(search.toLowerCase()) ||
      enr.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || enr.status === status;
    return matchesSearch && matchesStatus;
  });

  // Chip styling for enrollment status
  function statusBadge(stat) {
    let bg = '#dedede',
      color = '#213050';
    if (!stat) return null;
    if (stat === 'enrolled') {
      bg = '#e0edff';
      color = '#2563eb';
    }
    if (stat === 'waitlisted') {
      bg = '#fff6e0';
      color = '#e67e22';
    }
    if (stat === 'dropped') {
      bg = '#fbeaea';
      color = '#e62727';
    }
    return (
      <span
        style={{
          background: bg,
          color: color,
          fontWeight: 600,
          fontSize: '0.96em',
          borderRadius: '1em',
          padding: '0.13em 0.85em',
        }}
      >
        {stat.charAt(0).toUpperCase() + stat.slice(1)}
      </span>
    );
  }

  return (
    <div className={styles.enrollmentManagementPage}>
      <h1 className={styles.enrollmentManagementPage__title}>
        Enrollment Management
      </h1>
      <div className={styles.enrollmentManagementPage__controls}>
        <input
          className={styles.enrollmentManagementPage__search}
          type="text"
          placeholder="Search by student, course, or instructor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.enrollmentManagementPage__statusSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.enrollmentManagementPage__listArea}>
        {loading ? (
          <div className={styles.enrollmentManagementPage__loading}>
            Loading enrollments…
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className={styles.enrollmentManagementPage__empty}>
            No enrollments found.
          </div>
        ) : (
          <table className={styles.enrollmentManagementPage__table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enr) => (
                <tr key={enr.id}>
                  <td>{enr.student}</td>
                  <td>{enr.studentEmail}</td>
                  <td>{enr.course}</td>
                  <td>{enr.courseName}</td>
                  <td>{enr.instructor}</td>
                  <td>{statusBadge(enr.status)}</td>
                  <td>
                    <button
                      className={styles.enrollmentManagementPage__actionBtn}
                      // onClick={() => ... approve/drop logic ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.enrollmentManagementPage__actionBtn}
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