/**
 * ProfessorDashboard Component
 * ----------------------------------------------------------
 * Main dashboard page for LMS professors/instructors.
 *
 * Responsibilities:
 * - Summarizes instructor-centered LMS stats (courses, students, assignments, submissions).
 * - Shows upcoming classes or deadlines, recent submissions, and quick links.
 * - Can show grade distribution or engagement chart for professor's courses.
 *
 * Usage:
 *   <Route path="/professor" element={<ProfessorDashboard />} />
 */

import { useEffect, useState } from 'react';
import styles from './ProfessorDashboard.module.scss';
import GradeDistributionChart from '../../components/analytics/GradeDistributionChart';

export default function ProfessorDashboard() {
  // Example dashboard state (replace with real API fetches)
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    assignments: 0,
    submissions: 0,
  });
  const [upcoming, setUpcoming] = useState([
    // { id, type: "class"|"deadline", title, dueAt }
  ]);
  const [recentSubmissions, setRecentSubmissions] = useState([
    // { id, student, assignment, submittedAt, grade }
  ]);
  const [gradeDist, setGradeDist] = useState([92, 85, 70, 98, 81, 75, 80, 91, 100, 95, 87, 73, 68]);
  const [loading, setLoading] = useState(true);

  // Simulate async instructor-specific data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        courses: 4,
        students: 124,
        assignments: 15,
        submissions: 442,
      });
      setUpcoming([
        { id: 21, type: "class", title: "Calculus I - Lecture", dueAt: "2025-03-29T09:00" },
        { id: 22, type: "deadline", title: "HW 4 due", dueAt: "2025-03-30T23:59" },
        { id: 23, type: "class", title: "Advising Hour", dueAt: "2025-03-31T14:00" },
      ]);
      setRecentSubmissions([
        { id: 201, student: "Liam Hall", assignment: "Quiz 3", submittedAt: "2025-03-27T10:42", grade: "88" },
        { id: 202, student: "Sophia Young", assignment: "HW 3", submittedAt: "2025-03-27T11:03", grade: "95" },
        { id: 203, student: "Elijah White", assignment: "Project Draft", submittedAt: "2025-03-27T11:28", grade: "N/A" },
      ]);
      setGradeDist([92, 85, 70, 98, 81, 75, 80, 91, 100, 95, 87, 73, 68]);
      setLoading(false);
    }, 1100);
  }, []);

  // Format date for events and submissions
  function formatDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      year: '2-digit', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  return (
    <div className={styles.professorDashboard}>
      <h1 className={styles.professorDashboard__title}>
        Professor Dashboard
      </h1>
      {loading ? (
        <div className={styles.professorDashboard__loading}>Loading dashboard…</div>
      ) : (
        <div>
          {/* Stats grid */}
          <section className={styles.professorDashboard__statsGrid}>
            <div className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Courses</span>
              <span className={styles.professorDashboard__statValue}>{stats.courses}</span>
            </div>
            <div className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Students</span>
              <span className={styles.professorDashboard__statValue}>{stats.students}</span>
            </div>
            <div className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Assignments</span>
              <span className={styles.professorDashboard__statValue}>{stats.assignments}</span>
            </div>
            <div className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Submissions</span>
              <span className={styles.professorDashboard__statValue}>{stats.submissions}</span>
            </div>
          </section>
          {/* Upcoming classes/deadlines */}
          <section className={styles.professorDashboard__section}>
            <h2 className={styles.professorDashboard__sectionTitle}>Upcoming</h2>
            <ul className={styles.professorDashboard__upcomingList}>
              {upcoming.map(event => (
                <li key={event.id} className={styles.professorDashboard__upcomingItem}>
                  <span className={styles.professorDashboard__upcomingType}>
                    {event.type === "class" ? "Class" : "Deadline"}
                  </span>
                  <span className={styles.professorDashboard__upcomingTitle}>{event.title}</span>
                  <span className={styles.professorDashboard__upcomingWhen}>{formatDate(event.dueAt)}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* Recent submissions */}
          <section className={styles.professorDashboard__section}>
            <h2 className={styles.professorDashboard__sectionTitle}>Recent Submissions</h2>
            <table className={styles.professorDashboard__submissionsTable}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Submitted At</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.student}</td>
                    <td>{sub.assignment}</td>
                    <td>{formatDate(sub.submittedAt)}</td>
                    <td>{sub.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {/* Grade distribution */}
          <section className={styles.professorDashboard__section}>
            <h2 className={styles.professorDashboard__sectionTitle}>Grade Distribution</h2>
            <GradeDistributionChart grades={gradeDist} />
          </section>
          {/* Quick links row */}
          <section className={styles.professorDashboard__quickLinks}>
            <a className={styles.professorDashboard__quickLink} href="/professor/courses">
              My Courses
            </a>
            <a className={styles.professorDashboard__quickLink} href="/professor/assignments">
              Manage Assignments
            </a>
            <a className={styles.professorDashboard__quickLink} href="/professor/students">
              Student List
            </a>
          </section>
        </div>
      )}
    </div>
  );
}