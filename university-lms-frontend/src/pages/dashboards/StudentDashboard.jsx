/**
 * StudentDashboard Component
 * ----------------------------------------------------------
 * Main dashboard page for LMS students.
 *
 * Responsibilities:
 * - Summarizes student's enrolled courses, assignments, grades, and progress.
 * - Shows upcoming deadlines/classes, recent activity, and quick links.
 * - Includes grade distribution for the student's assignments.
 * - Responsive and ready for future expansion.
 *
 * Usage:
 *   <Route path="/student" element={<StudentDashboard />} />
 */

import { useEffect, useState } from 'react';
import styles from './StudentDashboard.module.scss';
import GradeDistributionChart from '../../components/analytics/GradeDistributionChart';

export default function StudentDashboard() {
  // Student dashboard state (replace with real API in production)
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    completed: 0,
    avgGrade: null,
  });
  const [upcoming, setUpcoming] = useState([
    // { id, type: "class"|"deadline", title, dueAt }
  ]);
  const [recent, setRecent] = useState([
    // { id, course, activity, date }
  ]);
  const [gradeDist, setGradeDist] = useState([90, 82, 70, 88, 85, 75, 79, 100, 97, 92, 81]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        courses: 6,
        assignments: 19,
        completed: 13,
        avgGrade: 86
      });
      setUpcoming([
        { id: 51, type: "class", title: "Modern Art - Lecture", dueAt: "2025-04-01T11:00" },
        { id: 52, type: "deadline", title: "HW 3 due", dueAt: "2025-04-02T23:59" },
        { id: 53, type: "class", title: "Science Seminar", dueAt: "2025-04-03T09:00" },
      ]);
      setRecent([
        { id: 401, course: "Biology 101", activity: "Quiz 2 graded (87)", date: "2025-03-29T14:41" },
        { id: 402, course: "Modern Art", activity: "Essay 1 submitted", date: "2025-03-29T19:52" },
        { id: 403, course: "Statistics", activity: "HW 2 scored (91)", date: "2025-03-28T21:12" },
      ]);
      setGradeDist([90, 82, 70, 88, 85, 75, 79, 100, 97, 92, 81]);
      setLoading(false);
    }, 1100);
  }, []);

  function formatDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      year: '2-digit', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  return (
    <div className={styles.studentDashboard}>
      <h1 className={styles.studentDashboard__title}>
        My Dashboard
      </h1>
      {loading ? (
        <div className={styles.studentDashboard__loading}>Loading dashboard…</div>
      ) : (
        <div>
          {/* Stats grid */}
          <section className={styles.studentDashboard__statsGrid}>
            <div className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Courses</span>
              <span className={styles.studentDashboard__statValue}>{stats.courses}</span>
            </div>
            <div className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Assignments</span>
              <span className={styles.studentDashboard__statValue}>{stats.assignments}</span>
            </div>
            <div className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Completed</span>
              <span className={styles.studentDashboard__statValue}>{stats.completed}</span>
            </div>
            <div className={styles.studentDashboard__statBox}>
              <span className={styles.studentDashboard__statLabel}>Avg. Grade</span>
              <span className={styles.studentDashboard__statValue}>
                {stats.avgGrade == null ? '—' : stats.avgGrade}
              </span>
            </div>
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
            <GradeDistributionChart grades={gradeDist} />
          </section>
          {/* Quick links row */}
          <section className={styles.studentDashboard__quickLinks}>
            <a className={styles.studentDashboard__quickLink} href="/student/courses">
              My Courses
            </a>
            <a className={styles.studentDashboard__quickLink} href="/student/assignments">
              Assignments
            </a>
            <a className={styles.studentDashboard__quickLink} href="/student/grades">
              Grades & Progress
            </a>
          </section>
        </div>
      )}
    </div>
  );
}