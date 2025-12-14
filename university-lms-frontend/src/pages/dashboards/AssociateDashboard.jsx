/**
 * AssociateDashboard Component
 * ----------------------------------------------------------
 * Main dashboard page for LMS associate staff (e.g., teaching assistants, department staff).
 *
 * Responsibilities:
 * - Summarizes staff-centered stats (courses assisted, student count, assignments involved, submissions to review).
 * - Lists upcoming sessions or duties, recent submissions or requests, and quick links to main TA/staff tools.
 * - Can show a grade distribution for assisted courses.
 *
 * Usage:
 *   <Route path="/associate" element={<AssociateDashboard />} />
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import GradeDistributionChart from '../../components/analytics/GradeDistributionChart';

import styles from './AssociateDashboard.module.scss';

import { ROUTES } from '@/lib/constants';

export default function AssociateDashboard() {
  // Example dashboard state (replace with real API fetches)
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    assignments: 0,
    submissions: 0,
  });
  const [upcoming, setUpcoming] = useState([
    // { id, type: "session"|"deadline", title, dueAt }
  ]);
  const [recentRequests, setRecentRequests] = useState([
    // { id, student, request, createdAt, status }
  ]);
  const [gradeDist, setGradeDist] = useState([88, 82, 96, 75, 79, 85, 91, 93, 68, 100, 90, 72, 81]);
  const [loading, setLoading] = useState(true);

  // Simulate async staff/TA-specific data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        courses: 3,
        students: 78,
        assignments: 12,
        submissions: 174,
      });
      setUpcoming([
        { id: 41, type: "session", title: "Tutoring Session", dueAt: "2025-04-03T15:00" },
        { id: 42, type: "deadline", title: "Lab Report Reviews Due", dueAt: "2025-04-04T17:00" },
      ]);
      setRecentRequests([
        { id: 301, student: "Grace Chen", request: "Extension Request", createdAt: "2025-03-29T14:40", status: "Pending" },
        { id: 302, student: "Jackson Hall", request: "Regrade HW 2", createdAt: "2025-03-29T14:41", status: "Resolved" },
        { id: 303, student: "Emily Kim", request: "Extra Office Hour", createdAt: "2025-03-28T19:12", status: "Pending" },
      ]);
      setGradeDist([88, 82, 96, 75, 79, 85, 91, 93, 68, 100, 90, 72, 81]);
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

  // Status color chip
  function statusChip(status) {
    if (!status) return null;
    let color;
    switch (status.toLowerCase()) {
      case "pending": color = "#e67e22"; break;
      case "resolved": color = "#179a4e"; break;
      default: color = "#64748b";
    }
    return (
      <span style={{
        background: "#f1f5f9",
        color,
        padding: "0.16em 0.9em",
        borderRadius: "0.6em",
        fontWeight: 600,
        fontSize: "0.96em",
        marginLeft: "0.43em"
      }}>
        {status}
      </span>
    );
  }

  return (
    <div className={styles.associateDashboard}>
      <h1 className={styles.associateDashboard__title}>
        Associate Dashboard
      </h1>
      {loading ? (
        <div className={styles.associateDashboard__loading}>Loading dashboard…</div>
      ) : (
        <div>
          {/* Stats grid */}
          <section className={styles.associateDashboard__statsGrid}>
            <div className={styles.associateDashboard__statBox}>
              <span className={styles.associateDashboard__statLabel}>Courses Assisted</span>
              <span className={styles.associateDashboard__statValue}>{stats.courses}</span>
            </div>
            <div className={styles.associateDashboard__statBox}>
              <span className={styles.associateDashboard__statLabel}>Students</span>
              <span className={styles.associateDashboard__statValue}>{stats.students}</span>
            </div>
            <div className={styles.associateDashboard__statBox}>
              <span className={styles.associateDashboard__statLabel}>Assignments</span>
              <span className={styles.associateDashboard__statValue}>{stats.assignments}</span>
            </div>
            <div className={styles.associateDashboard__statBox}>
              <span className={styles.associateDashboard__statLabel}>Submissions</span>
              <span className={styles.associateDashboard__statValue}>{stats.submissions}</span>
            </div>
          </section>
          {/* Upcoming sessions/deadlines */}
          <section className={styles.associateDashboard__section}>
            <h2 className={styles.associateDashboard__sectionTitle}>Upcoming</h2>
            <ul className={styles.associateDashboard__upcomingList}>
              {upcoming.map(event => (
                <li key={event.id} className={styles.associateDashboard__upcomingItem}>
                  <span className={styles.associateDashboard__upcomingType}>
                    {event.type === "session" ? "Session" : "Deadline"}
                  </span>
                  <span className={styles.associateDashboard__upcomingTitle}>{event.title}</span>
                  <span className={styles.associateDashboard__upcomingWhen}>{formatDate(event.dueAt)}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* Recent requests */}
          <section className={styles.associateDashboard__section}>
            <h2 className={styles.associateDashboard__sectionTitle}>Recent Student Requests</h2>
            <table className={styles.associateDashboard__requestsTable}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Request</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.student}</td>
                    <td>{req.request}</td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td>{statusChip(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {/* Grade distribution */}
          <section className={styles.associateDashboard__section}>
            <h2 className={styles.associateDashboard__sectionTitle}>Grade Distribution</h2>
            <GradeDistributionChart grades={gradeDist} />
          </section>
          {/* Quick links row */}
          <section className={styles.associateDashboard__quickLinks}>
            <Link className={styles.associateDashboard__quickLink} to={ROUTES.COURSES}>
              Assisted Courses
            </Link>
            <Link className={styles.associateDashboard__quickLink} to={ROUTES.ASSIGNMENTS}>
              Review Requests
            </Link>
            <Link className={styles.associateDashboard__quickLink} to={ROUTES.SECTIONS}>
              Section Calendar
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
