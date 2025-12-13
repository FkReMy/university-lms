/**
 * ProfessorDashboard Component
 * ----------------------------------------------------------
 * Main dashboard page for LMS professors/instructors.
 *
 * Responsibilities:
 * - Summarizes instructor-centered LMS stats (courses, students, assignments, submissions).
 * - Shows upcoming classes/deadlines, recent submissions, and quick links.
 * - Uses design system components (Card, Table, Badge).
 * - SPA navigation with <Link> from react-router-dom (not <a>).
 *
 * Usage:
 *   <Route path="/professor" element={<ProfessorDashboard />} />
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import GradeDistributionChart from '@/components/analytics/GradeDistributionChart';
import Card from '@/components/ui/card';      // design-system Card
import Table from '@/components/ui/table';    // design-system Table
import Badge from '@/components/ui/badge';    // design-system Badge

import styles from './ProfessorDashboard.module.scss';

export default function ProfessorDashboard() {
  // Example dashboard state (replace with real API fetches)
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    assignments: 0,
    submissions: 0,
  });
  const [upcoming, setUpcoming] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
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
            <Card style={{padding: "1.2em 1.8em"}}>
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
 * Key refactors:
 * - All stat/data/quick-links use Card, Table, Badge from your design system.
 * - Navigation is by SPA <Link> components.
 * - The dashboard page structure, logic, and accessibility are preserved.
 */