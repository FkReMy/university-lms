/**
 * UserDetailPage Component
 * ----------------------------------------------------------
 * Admin or profile page to view a user's details.
 *
 * Responsibilities:
 * - Displays user's info: name, email, role, status, membership info, etc.
 * - Shows activity summary (enrollments, graded, etc.).
 * - Optionally shows courses enrolled/teaching or admin actions.
 * - Ready for extension/editing/deactivation logic.
 *
 * Usage:
 *   <Route path="/admin/users/:userId" element={<UserDetailPage />} />
 *   or as user profile details page.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './UserDetailPage.module.scss';

export default function UserDetailPage() {
  const { userId } = useParams();
  // User state (in real app, fetch API)
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]); // List of courses
  const [loading, setLoading] = useState(true);

  // Demo: simulate loading user data for detail page
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Simulated: select by userId (or generic if not provided)
      const demoUser = {
        id: userId ?? 6,
        name: "Ava Davis",
        email: "ava.davis@student.edu",
        role: "student",
        status: "active",
        memberSince: "2023-09-14",
      };
      setUser(demoUser);
      setEnrollments([
        { id: 11, course: "World History", status: "active", grade: "92", instructor: "Prof. Lee" },
        { id: 12, course: "Statistics", status: "active", grade: "88", instructor: "Dr. Kapoor" },
        { id: 13, course: "Modern Art", status: "completed", grade: "90", instructor: "Dr. Smith" }
      ]);
      setLoading(false);
    }, 800);
  }, [userId]);

  // Status badge color
  function statusBadge(status) {
    let bg = "#dedede", color = "#213050";
    if (status === "active") { bg = "#e5ffe9"; color = "#179a4e"; }
    if (status === "inactive") { bg = "#fbeaea"; color = "#e62727"; }
    if (status === "invited") { bg = "#fff6e0"; color = "#e67e22"; }
    return (
      <span
        style={{
          background: bg,
          color: color,
          borderRadius: "1em",
          padding: "0.15em 0.9em",
          fontWeight: 600,
          fontSize: "0.99em",
          marginLeft: "0.35em"
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  // Role badge
  function roleBadge(role) {
    let color;
    switch (role) {
      case "student": color = "#2563eb"; break;
      case "instructor": color = "#9c27b0"; break;
      case "associate": color = "#e67e22"; break;
      default: color = "#485471";
    }
    return (
      <span
        style={{
          color,
          background: "#f4f7fd",
          fontWeight: 700,
          fontSize: "0.99em",
          borderRadius: "0.87em",
          padding: "0.14em 0.95em",
          marginRight: "0.3em",
        }}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  }

  function formatDate(dt) {
    if (!dt) return "";
    return new Date(dt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  return (
    <div className={styles.userDetailPage}>
      {loading ? (
        <div className={styles.userDetailPage__loading}>Loading user details…</div>
      ) : !user ? (
        <div className={styles.userDetailPage__empty}>User not found.</div>
      ) : (
        <div className={styles.userDetailPage__container}>
          <header className={styles.userDetailPage__header}>
            <h1 className={styles.userDetailPage__title}>
              {user.name}
              {roleBadge(user.role)}
              {statusBadge(user.status)}
            </h1>
            <div className={styles.userDetailPage__infoRow}>
              <span className={styles.userDetailPage__label}>Email:</span>{" "}
              <span className={styles.userDetailPage__email}>{user.email}</span>
            </div>
            <div className={styles.userDetailPage__infoRow}>
              <span className={styles.userDetailPage__label}>Member Since:</span>{" "}
              <span>{formatDate(user.memberSince)}</span>
            </div>
          </header>
          {/* Enrollments/teaching info */}
          <section className={styles.userDetailPage__section}>
            <h2 className={styles.userDetailPage__sectionTitle}>
              {user.role === "student" ? "Current Courses" : "Courses Teaching/Assisting"}
            </h2>
            {enrollments.length === 0 ? (
              <div className={styles.userDetailPage__empty}>No courses found.</div>
            ) : (
              <table className={styles.userDetailPage__coursesTable}>
                <thead>
                  <tr>
                    <th>Course</th>
                    {user.role !== "student" && <th>Role</th>}
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(enr => (
                    <tr key={enr.id}>
                      <td>{enr.course}</td>
                      {user.role !== "student" && <td>{enr.role ?? "—"}</td>}
                      <td>{statusBadge(enr.status)}</td>
                      <td>{enr.grade ?? "—"}</td>
                      <td>{enr.instructor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          {/* Optional: admin actions */}
          <section className={styles.userDetailPage__actions}>
            <button className={styles.userDetailPage__actionBtn}
              // onClick={() => ... future edit ...}
            >Edit Info</button>
            <button className={styles.userDetailPage__actionBtn}
              disabled={user.status !== "active"}
              // onClick={() => ... future deactivate ...}
            >Deactivate</button>
          </section>
        </div>
      )}
    </div>
  );
}
