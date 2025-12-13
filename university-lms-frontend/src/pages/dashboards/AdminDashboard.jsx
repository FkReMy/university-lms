/**
 * AdminDashboard Component
 * ----------------------------------------------------------
 * Main dashboard page for LMS administrators.
 *
 * Responsibilities:
 * - Summarizes high-level LMS stats (users, courses, assignments, submissions)
 * - Shows most-popular courses and recent activity.
 * - Links to user/course/assignment management sections.
 * - May show visualizations (grade chart, recent submissions, etc).
 *
 * Usage:
 *   <Route path="/admin" element={<AdminDashboard />} />
 */

import { useEffect, useState } from 'react';

import GradeDistributionChart from '../../components/analytics/GradeDistributionChart';

import styles from './AdminDashboard.module.scss';

export default function AdminDashboard() {
  // Example dashboard state (replace with real data fetching)
  const [stats, setStats] = useState({
    users: 0,
    instructors: 0,
    courses: 0,
    assignments: 0,
    submissions: 0,
  });
  const [topCourses, setTopCourses] = useState([
    // Example: {id, title, enrolled, instructor}
  ]);
  const [recentSubmissions, setRecentSubmissions] = useState([
    // Example: {id, student, assignment, submittedAt, grade}
  ]);
  const [gradeDist, setGradeDist] = useState([95, 88, 80, 71, 91, 78, 100, 89, 85, 73, 65, 77, 88]);
  const [loading, setLoading] = useState(true);

  // Simulate async data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        users: 1250,
        instructors: 42,
        courses: 15,
        assignments: 38,
        submissions: 1204,
      });
      setTopCourses([
        { id: 1, title: "Intro to Computer Science", enrolled: 314, instructor: "Dr. Smith" },
        { id: 2, title: "Business Communication", enrolled: 182, instructor: "Prof. Lee" },
        { id: 3, title: "Calculus I", enrolled: 139, instructor: "Dr. Kapoor" },
      ]);
      setRecentSubmissions([
        { id: 61, student: "Olivia Brown", assignment: "HW 4", submittedAt: "2025-03-23T13:15", grade: "92" },
        { id: 62, student: "Noah Clark", assignment: "Essay 1", submittedAt: "2025-03-23T13:18", grade: "87" },
        { id: 63, student: "Ava Davis", assignment: "Quiz 2", submittedAt: "2025-03-23T13:22", grade: "78" },
      ]);
      setGradeDist([95, 88, 80, 71, 91, 78, 100, 89, 85, 73, 65, 77, 88, 92, 90, 79]);
      setLoading(false);
    }, 1100);
  }, []);

  // Format date for submissions
  function formatDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      year: '2-digit', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  return (
    <div className={styles.adminDashboard}>
      <h1 className={styles.adminDashboard__title}>
        Admin Dashboard
      </h1>
      {loading ? (
        <div className={styles.adminDashboard__loading}>Loading LMS stats…</div>
      ) : (
        <div>
          {/* Stats grid */}
          <section className={styles.adminDashboard__statsGrid}>
            <div className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Users</span>
              <span className={styles.adminDashboard__statValue}>{stats.users}</span>
            </div>
            <div className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Instructors</span>
              <span className={styles.adminDashboard__statValue}>{stats.instructors}</span>
            </div>
            <div className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Courses</span>
              <span className={styles.adminDashboard__statValue}>{stats.courses}</span>
            </div>
            <div className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Assignments</span>
              <span className={styles.adminDashboard__statValue}>{stats.assignments}</span>
            </div>
            <div className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Submissions</span>
              <span className={styles.adminDashboard__statValue}>{stats.submissions}</span>
            </div>
          </section>
          {/* Top courses */}
          <section className={styles.adminDashboard__section}>
            <h2 className={styles.adminDashboard__sectionTitle}>Top Courses</h2>
            <table className={styles.adminDashboard__coursesTable}>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Enrolled</th>
                  <th>Instructor</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.enrolled}</td>
                    <td>{c.instructor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {/* Recent submissions */}
          <section className={styles.adminDashboard__section}>
            <h2 className={styles.adminDashboard__sectionTitle}>Recent Submissions</h2>
            <table className={styles.adminDashboard__submissionsTable}>
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
          {/* Grade distribution chart */}
          <section className={styles.adminDashboard__section}>
            <h2 className={styles.adminDashboard__sectionTitle}>Overall Grade Distribution</h2>
            <GradeDistributionChart grades={gradeDist} />
          </section>
          {/* Quick links row */}
          <section className={styles.adminDashboard__quickLinks}>
            <a className={styles.adminDashboard__quickLink} href="/admin/users">
              Manage Users
            </a>
            <a className={styles.adminDashboard__quickLink} href="/admin/courses">
              Manage Courses
            </a>
            <a className={styles.adminDashboard__quickLink} href="/admin/assignments">
              Manage Assignments
            </a>
          </section>
        </div>
      )}
    </div>
  );
}