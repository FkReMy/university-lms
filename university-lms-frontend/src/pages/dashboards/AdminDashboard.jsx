/**
 * AdminDashboard Component (Production)
 * ----------------------------------------------------------------------------
 * LMS administrator home/dashboard.
 * - Summarizes LMS stats (users, courses, assignments, submissions)
 * - Shows top courses, recent activity, analytics (grade chart)
 * - All elements use design-system components & SPA navigation.
 * - All data wired for backend; samples/mocks removed.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './AdminDashboard.module.scss';

import GradeDistributionChart from '@/components/analytics/GradeDistributionChart';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import Table from '@/components/ui/table';

import statsApi from '@/services/api/dashboardApi'; // Expected .getStats(), .getTopCourses(), .getRecentSubmissions(), .getGrades()

export default function AdminDashboard() {
  // Dashboard data state
  const [stats, setStats] = useState({
    users: 0,
    instructors: 0,
    courses: 0,
    assignments: 0,
    submissions: 0,
  });
  const [topCourses, setTopCourses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [gradeDist, setGradeDist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [
          statsRes,
          topCoursesRes,
          recentSubsRes,
          gradeDistRes
        ] = await Promise.all([
          statsApi.getStats(),
          statsApi.getTopCourses(),
          statsApi.getRecentSubmissions(),
          statsApi.getGrades(),
        ]);
        if (isMounted) {
          setStats(statsRes || {});
          setTopCourses(Array.isArray(topCoursesRes) ? topCoursesRes : []);
          setRecentSubmissions(Array.isArray(recentSubsRes) ? recentSubsRes : []);
          setGradeDist(Array.isArray(gradeDistRes) ? gradeDistRes : []);
        }
      } catch (err) {
        // Optionally: handle error globally or per-component
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { isMounted = false; };
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

          {/* Top courses */}
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
            <Card style={{ padding: "1.2em 1.8em" }}>
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
 * Production Notes:
 * - All sections use real backend APIs for stats and analytics.
 * - Uses global Card, Table, Badge components for unified design.
 * - Navigation is SPA-friendly for seamless admin UX.
 * - No sample/demo data: all state is production.
 */