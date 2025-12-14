/**
 * AdminDashboard Component
 * ----------------------------------------------------------
 * Main dashboard page for LMS administrators.
 *
 * Responsibilities:
 * - Summarizes high-level LMS stats (users, courses, assignments, submissions)
 * - Shows most-popular courses and recent activity.
 * - Links to user/course/assignment management sections with SPA navigation.
 * - Uses design system components (Badge, Card, Table) for a consistent UI.
 * - May show visualizations (grade chart, recent submissions, etc).
 *
 * Usage:
 *   <Route path="/admin" element={<AdminDashboard />} />
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './AdminDashboard.module.scss';

import GradeDistributionChart from '@/components/analytics/GradeDistributionChart';
import Badge from '@/components/ui/badge';    // design-system Badge
import Card from '@/components/ui/card';      // design-system Card
import Table from '@/components/ui/table';    // design-system Table
// You may need to provide simple Card and Table wrappers if not present.


export default function AdminDashboard() {
  // Example dashboard state (replace with real data fetching)
  const [stats, setStats] = useState({
    users: 0,
    instructors: 0,
    courses: 0,
    assignments: 0,
    submissions: 0,
  });
  const [topCourses, setTopCourses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
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
      <h1 className={styles.adminDashboard__title}>Admin Dashboard</h1>
      {loading ? (
        <div className={styles.adminDashboard__loading}>Loading LMS stats…</div>
      ) : (
        <div>
          {/* Top stats grid */}
          <section className={styles.adminDashboard__statsGrid}>
            <Card className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Users</span>
              <span className={styles.adminDashboard__statValue}>
                {stats.users}
              </span>
            </Card>
            <Card className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Instructors</span>
              <span className={styles.adminDashboard__statValue}>{stats.instructors}</span>
            </Card>
            <Card className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Courses</span>
              <span className={styles.adminDashboard__statValue}>{stats.courses}</span>
            </Card>
            <Card className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Assignments</span>
              <span className={styles.adminDashboard__statValue}>{stats.assignments}</span>
            </Card>
            <Card className={styles.adminDashboard__statBox}>
              <span className={styles.adminDashboard__statLabel}>Submissions</span>
              <span className={styles.adminDashboard__statValue}>{stats.submissions}</span>
            </Card>
          </section>

          {/* Most popular/top courses */}
          <section className={styles.adminDashboard__section}>
            <h2 className={styles.adminDashboard__sectionTitle}>Top Courses</h2>
            <Table className={styles.adminDashboard__coursesTable}>
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
                    <td>
                      <Badge variant="primary">{c.enrolled}</Badge>
                    </td>
                    <td>{c.instructor}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>

          {/* Recent submissions */}
          <section className={styles.adminDashboard__section}>
            <h2 className={styles.adminDashboard__sectionTitle}>Recent Submissions</h2>
            <Table className={styles.adminDashboard__submissionsTable}>
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
                    <td>
                      <Badge variant="success">{sub.grade}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>

          {/* Overall grade distribution */}
          <section className={styles.adminDashboard__section}>
            <h2 className={styles.adminDashboard__sectionTitle}>Overall Grade Distribution</h2>
            <Card style={{padding: "1.2em 1.8em"}}>
              <GradeDistributionChart grades={gradeDist} />
            </Card>
          </section>

          {/* Quick links row */}
          <section className={styles.adminDashboard__quickLinks}>
            <Link className={styles.adminDashboard__quickLink} to="/admin/users">
              Manage Users
            </Link>
            <Link className={styles.adminDashboard__quickLink} to="/admin/courses">
              Manage Courses
            </Link>
            <Link className={styles.adminDashboard__quickLink} to="/admin/assignments">
              Manage Assignments
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Notes:
 * - Card, Table, and Badge are shared UI components and should be implemented if not present (replace with <div>, <table>, <span> if needed).
 * - Navigation to `/admin/users`, etc., uses SPA-friendly <Link> for smooth transitions and state preservation.
 * - All statistics and small data/labels use design system components for visual harmony.
 * - Uses the @ alias for shared components.
 */