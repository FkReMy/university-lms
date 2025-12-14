/**
 * StudentDashboard Component (Production)
 * ----------------------------------------------------------------------------
 * Student dashboard for the LMS.
 * - Summarize student's enrolled courses, assignments, grades, and recent progress.
 * - Shows upcoming deadlines/classes, recent activity, and grade distribution.
 * - Quick SPA navigation with <Link>.
 * - Uses only unified/global UI components.
 * - No sample/demo data; production API ready.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './StudentDashboard.module.scss';

import GradeDistributionChart from '@/components/analytics/GradeDistributionChart';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

// Production: connect these to backend APIs:
import studentDashboardApi from '@/services/api/studentDashboardApi'; // getStats, getUpcoming, getRecent, getGrades

export default function StudentDashboard() {
  // State for dashboard numbers/lists
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    completed: 0,
    avgGrade: null,
  });
  const [upcoming, setUpcoming] = useState([]);
  const [recent, setRecent] = useState([]);
  const [gradeDist, setGradeDist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all student dashboard data from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [
          statsData,
          upcomingData,
          recentData,
          gradesData,
        ] = await Promise.all([
          studentDashboardApi.getStats(),
          studentDashboardApi.getUpcoming(),
          studentDashboardApi.getRecent(),
          studentDashboardApi.getGrades(),
        ]);
        if (isMounted) {
          setStats(statsData || {});
          setUpcoming(Array.isArray(upcomingData) ? upcomingData : []);
          setRecent(Array.isArray(recentData) ? recentData : []);
          setGradeDist(Array.isArray(gradesData) ? gradesData : []);
        }
      } catch (err) {
        // Optionally: set global error
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  // Format a date string for display
  function formatDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return (
    <div className={styles.studentDashboard}>
      <h1 className={styles.studentDashboard__title}>My Dashboard</h1>
      {loading ? (
        <div className={styles.studentDashboard__loading}>Loading dashboard…</div>
      ) : (
        <div>
          {/* Stats grid */}
          <section className={styles.studentDashboard__statsGrid}>
            <Card className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Courses</span>
              <span className={styles.studentDashboard__statValue}>{stats.courses}</span>
            </Card>
            <Card className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Assignments</span>
              <span className={styles.studentDashboard__statValue}>{stats.assignments}</span>
            </Card>
            <Card className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Completed</span>
              <span className={styles.studentDashboard__statValue}>{stats.completed}</span>
            </Card>
            <Card className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Avg. Grade</span>
              <span className={styles.studentDashboard__statValue}>
                {stats.avgGrade == null ? '—' : stats.avgGrade}
              </span>
            </Card>
          </section>
          {/* Upcoming classes/deadlines */}
          <section className={styles.studentDashboard__section}>
            <h2 className={styles.studentDashboard__sectionTitle}>Upcoming</h2>
            <ul className={styles.studentDashboard__upcomingList}>
              {upcoming.map(event => (
                <li key={event.id} className={styles.studentDashboard__upcomingItem}>
                  <span className={styles.studentDashboard__upcomingType}>
                    {event.type === 'class' ? 'Class' : 'Deadline'}
                  </span>
                  <span className={styles.studentDashboard__upcomingTitle}>{event.title}</span>
                  <span className={styles.studentDashboard__upcomingWhen}>{formatDate(event.dueAt)}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* Recent activity */}
          <section className={styles.studentDashboard__section}>
            <h2 className={styles.studentDashboard__sectionTitle}>Recent Activity</h2>
            <ul className={styles.studentDashboard__recentList}>
              {recent.map(act => (
                <li key={act.id} className={styles.studentDashboard__recentItem}>
                  <span className={styles.studentDashboard__recentCourse}>{act.course}</span>
                  <span className={styles.studentDashboard__recentActivity}>{act.activity}</span>
                  <span className={styles.studentDashboard__recentWhen}>{formatDate(act.date)}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* Grade distribution */}
          <section className={styles.studentDashboard__section}>
            <h2 className={styles.studentDashboard__sectionTitle}>My Grade Distribution</h2>
            <Card style={{ padding: '1.2em 1.8em' }}>
              <GradeDistributionChart grades={gradeDist} />
            </Card>
          </section>
          {/* Quick links row */}
          <section className={styles.studentDashboard__quickLinks}>
            {/* SPA links matching Route definitions */}
            <Link className={styles.studentDashboard__quickLink} to={ROUTES.COURSES}>
              My Courses
            </Link>
            <Link className={styles.studentDashboard__quickLink} to={ROUTES.ASSIGNMENTS}>
              Assignments
            </Link>
            <Link className={styles.studentDashboard__quickLink} to={ROUTES.GRADES}>
              Grades & Progress
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Production Notes:
 * - All dashboard data (stats, upcoming, grades, recent) comes from production API.
 * - Responsive dashboard for modern SPA.
 * - Uses only unified LMS UI components and routing.
 * - No demo/mock logic remains; all hooks/states wire to real backend.
 */