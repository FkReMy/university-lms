/**
 * CourseOfferingDetailPage Component
 * ----------------------------------------------------------
 * View and manage a single course offering (section).
 *
 * Responsibilities:
 * - Displays offering: course info, schedule, roster, instructor, etc.
 * - Shows enrollment, term, status, and description/details.
 * - List enrolled students with basic info.
 * - Admin/faculty actions for future: edit, close enrollment.
 *
 * Usage:
 *   <Route path="/offerings/:id" element={<CourseOfferingDetailPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './CourseOfferingDetailPage.module.scss';

export default function CourseOfferingDetailPage({ offeringId /* from router params */ }) {
  // State: simulated load for course offering details and roster
  const [offering, setOffering] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOffering({
        id: offeringId ?? 9,
        term: 'Spring 2025',
        course: 'CSCI 101',
        courseName: 'Introduction to Computer Science',
        instructor: 'Dr. Smith',
        schedule: 'Mon/Wed 10:30-12:00',
        credits: 4,
        status: 'Active',
        enrollment: 32,
        description:
          'Learn foundational programming and problem-solving skills in Python. Major concepts: algorithms, variables, data types, control flow, and debugging.',
      });
      setStudents([
        { id: 101, name: 'Jane Student', email: 'jane.smith@email.edu', status: 'enrolled' },
        { id: 102, name: 'John Lee', email: 'john.lee@email.edu', status: 'enrolled' },
        { id: 103, name: 'Olivia Brown', email: 'obrown@email.edu', status: 'waitlisted' },
      ]);
      setLoading(false);
    }, 900);
  }, [offeringId]);

  // Status chip color
  function statusBadge(status) {
    let bg = "#dedede", color = "#213050";
    if (!status) return null;
    if (status.toLowerCase() === "active") { bg = "#e5ffe9"; color = "#179a4e"; }
    if (status.toLowerCase() === "closed") { bg = "#fbeaea"; color = "#e62727"; }
    if (status.toLowerCase() === "waitlisted") { bg = "#fff6e0"; color = "#e67e22"; }
    if (status.toLowerCase() === "enrolled") { bg = "#e0edff"; color = "#2563eb"; }
    return (
      <span
        style={{
          background: bg,
          color: color,
          fontWeight: 600,
          borderRadius: "1em",
          padding: "0.13em 0.9em",
          fontSize: "0.98em",
          marginLeft: "0.34em"
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className={styles.courseOfferingDetailPage}>
      {loading ? (
        <div className={styles.courseOfferingDetailPage__loading}>Loading offering…</div>
      ) : !offering ? (
        <div className={styles.courseOfferingDetailPage__empty}>Offering not found.</div>
      ) : (
        <div className={styles.courseOfferingDetailPage__card}>
          {/* Course & offering info */}
          <header className={styles.courseOfferingDetailPage__header}>
            <h1 className={styles.courseOfferingDetailPage__title}>
              {offering.courseName} <span className={styles.courseOfferingDetailPage__code}>[{offering.course}]</span>
              {statusBadge(offering.status)}
            </h1>
            <div className={styles.courseOfferingDetailPage__infoRow}>
              <span className={styles.courseOfferingDetailPage__label}>Term:</span> {offering.term}
            </div>
            <div className={styles.courseOfferingDetailPage__infoRow}>
              <span className={styles.courseOfferingDetailPage__label}>Instructor:</span> {offering.instructor}
            </div>
            <div className={styles.courseOfferingDetailPage__infoRow}>
              <span className={styles.courseOfferingDetailPage__label}>Schedule:</span> {offering.schedule}
            </div>
            <div className={styles.courseOfferingDetailPage__infoRow}>
              <span className={styles.courseOfferingDetailPage__label}>Credits:</span> {offering.credits}
            </div>
            <div className={styles.courseOfferingDetailPage__infoRow}>
              <span className={styles.courseOfferingDetailPage__label}>Enrolled:</span> {offering.enrollment}
            </div>
            <div className={styles.courseOfferingDetailPage__desc}>
              {offering.description}
            </div>
          </header>
          {/* Roster list */}
          <section className={styles.courseOfferingDetailPage__section}>
            <h2 className={styles.courseOfferingDetailPage__sectionTitle}>Enrolled Students</h2>
            {students.length === 0 ? (
              <div className={styles.courseOfferingDetailPage__empty}>No students enrolled.</div>
            ) : (
              <table className={styles.courseOfferingDetailPage__table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{statusBadge(s.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          {/* Admin/instructor actions */}
          <section className={styles.courseOfferingDetailPage__actions}>
            <button
              className={styles.courseOfferingDetailPage__actionBtn}
              // onClick={() => ... future edit dialog ...}
            >Edit Info</button>
            <button
              className={styles.courseOfferingDetailPage__actionBtn}
              // onClick={() => ... change status logic ...}
            >Close Enrollment</button>
          </section>
        </div>
      )}
    </div>
  );
}