/**
 * ProfessorDashboard Component (Production)
 * ----------------------------------------------------------------------------
 * Instructor home dashboard: unified LMS analytics and navigation for faculty.
 * - Summarizes courses, students, assignments, submissions.
 * - Shows upcoming classes/deadlines, recent activity, and grade distribution.
 * - All layout/controls use global design system (Card, Table, Badge).
 * - No demo/sample logic; All state/data should be fetched from API in production.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfessorDashboard.module.scss';

import GradeDistributionChart from '@/components/analytics/GradeDistributionChart';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import Table from '@/components/ui/table';

import professorDashboardApi from '@/services/api/professorDashboardApi'; // Expects: .getStats(), .getUpcoming(), .getRecentSubmissions(), .getGrades()

export default function ProfessorDashboard() {
  // All dashboard state is fetched or loading
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    assignments: 0,
    submissions: 0,
  });
  const [upcoming, setUpcoming] = useState([]);
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
          upcomingRes,
          recentSubsRes,
          gradesRes,
        ] = await Promise.all([
          professorDashboardApi.getStats(),
          professorDashboardApi.getUpcoming(),
          professorDashboardApi.getRecentSubmissions(),
          professorDashboardApi.getGrades(),
        ]);
        if (isMounted) {
          setStats(statsRes || {});
          setUpcoming(Array.isArray(upcomingRes) ? upcomingRes : []);
          setRecentSubmissions(Array.isArray(recentSubsRes) ? recentSubsRes : []);
          setGradeDist(Array.isArray(gradesRes) ? gradesRes : []);
        }
      } catch (err) {
        // Optionally: global error handling/UI message
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  // Format date for display
  function formatDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      year: '2-digit', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }

  return (
    <div className={styles.professorDashboard}>
      <h1 className={styles.professorDashboard__title}>Professor Dashboard</h1>
      {loading ? (
        <div className={styles.professorDashboard__loading}>Loading dashboard…</div>
      ) : (
        <div>
          {/* Stats grid */}
          <section className={styles.professorDashboard__statsGrid}>
            <Card className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Courses</span>
              <span className={styles.professorDashboard__statValue}>{stats.courses}</span>
            </Card>
            <Card className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Students</span>
              <span className={styles.professorDashboard__statValue}>{stats.students}</span>
            </Card>
            <Card className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Assignments</span>
              <span className={styles.professorDashboard__statValue}>{stats.assignments}</span>
            </Card>
            <Card className={styles.professorDashboard__statBox}>
              <span className={styles.professorDashboard__statLabel}>Submissions</span>
              <span className={styles.professorDashboard__statValue}>{stats.submissions}</span>
            </Card>
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
            <Table className={styles.professorDashboard__submissionsTable}>
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
                      {sub.grade === "N/A"
                        ? <Badge variant="secondary">N/A</Badge>
                        : <Badge variant="success">{sub.grade}</Badge>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>

          {/* Grade distribution */}
          <section className={styles.professorDashboard__section}>
            <h2 className={styles.professorDashboard__sectionTitle}>Grade Distribution</h2>
            <Card style={{ padding: "1.2em 1.8em" }}>
              <GradeDistributionChart grades={gradeDist} />
            </Card>
          </section>

          {/* Quick links row, must use SPA links */}
          <section className={styles.professorDashboard__quickLinks}>
            <Link className={styles.professorDashboard__quickLink} to="/courses">
              My Courses
            </Link>
            <Link className={styles.professorDashboard__quickLink} to="/assignments">
              Manage Assignments
            </Link>
            <Link className={styles.professorDashboard__quickLink} to="/students">
              Student List
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Production Notes:
 * - All stats, upcoming, grades, and submissions come from real APIs.
 * - Navigation: uses SPA <Link> for every quick-link.
 * - All elements use the global design system for styling and accessibility.
 * - No demo or sample logic; fully backend-integrated structure.
 */