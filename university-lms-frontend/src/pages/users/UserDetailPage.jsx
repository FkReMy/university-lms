/**
 * UserDetailPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin or profile details page for viewing a user's information and course activity.
 * - Shows personal info: full name, email, role badge, status badge, join date.
 * - Activity summary: current/completed/enrolled courses.
 * - Unified UI: all badges/buttons use the global design system.
 * - Purely API-driven and robust against schema changes.
 * - No sample/demo logic; ready for extension.
 *
 * Usage:
 *   <Route path="/admin/users/:userId" element={<UserDetailPage />} />
 *   or as user profile details page.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './UserDetailPage.module.scss';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import enrollmentApi from '@/services/api/enrollmentApi';
import userApi from '@/services/api/userApi';

/**
 * Extracts a user role name string for display, supporting:
 * - A string: e.g., "student"
 * - An object: { name: "Student" }
 * - An object: { role_name: "Student" }
 * - role_id (number): returns "Unknown"
 */
function extractRoleName(role) {
  if (!role) return "Unknown";
  if (typeof role === "string") return role;
  if (typeof role === "object") {
    if (role.name) return role.name;
    if (role.role_name) return role.role_name;
  }
  return "Unknown";
}

export default function UserDetailPage() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user and enrollment info
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        // Backend production: {full_name, email, status, created_at, role, ...}
        const u = await userApi.get(userId);
        const enr = await enrollmentApi.listForUser(userId);
        if (isMounted) {
          setUser(u || {});
          setEnrollments(Array.isArray(enr) ? enr : []);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setEnrollments([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [userId]);

  function formatDate(dt) {
    if (!dt) return '';
    return new Date(dt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Unified status badge (production: always map backend status)
  function statusBadge(status) {
    let variant = 'secondary';
    if (/active/i.test(status)) variant = 'success';
    else if (/inactive|disabled|suspended/i.test(status)) variant = 'danger';
    else if (/invited|pending/i.test(status)) variant = 'warning';
    return <Badge variant={variant}>{status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Unknown'}</Badge>;
  }

  /**
   * Unified role badge.
   * Robust: supports role strings ("student"), objects ({name, role_name}), or missing/null values.
   */
  function roleBadge(role) {
    const name = extractRoleName(role);
    let variant = "secondary";
    if (/student/i.test(name)) variant = "primary";
    else if (/professor|instructor/i.test(name)) variant = "success";
    else if (/associate/i.test(name)) variant = "warning";
    else if (/admin/i.test(name)) variant = "info";
    return <Badge variant={variant}>{name.charAt(0).toUpperCase() + name.slice(1)}</Badge>;
  }

  // Normalize role using backend schema. Accepts flexible input for future proofing.
  const roleValue = user && ("role" in user ? user.role : user.role_name);

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
              {user.full_name}
              {roleBadge(roleValue)}
              {statusBadge(user.status)}
            </h1>
            <div className={styles.userDetailPage__infoRow}>
              <span className={styles.userDetailPage__label}>Email:</span>{' '}
              <span className={styles.userDetailPage__email}>{user.email}</span>
            </div>
            <div className={styles.userDetailPage__infoRow}>
              <span className={styles.userDetailPage__label}>Member Since:</span>{' '}
              <span>{formatDate(user.created_at)}</span>
            </div>
          </header>
          {/* Enrollments/teaching info */}
          <section className={styles.userDetailPage__section}>
            <h2 className={styles.userDetailPage__sectionTitle}>
              {/student/i.test(extractRoleName(roleValue))
                ? 'Current Courses'
                : 'Courses Teaching/Assisting'}
            </h2>
            {enrollments.length === 0 ? (
              <div className={styles.userDetailPage__empty}>No courses found.</div>
            ) : (
              <table className={styles.userDetailPage__coursesTable}>
                <thead>
                  <tr>
                    <th>Course</th>
                    {!/student/i.test(extractRoleName(roleValue)) && <th>Role</th>}
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr) => (
                    <tr key={enr.id}>
                      <td>{enr.course}</td>
                      {!/student/i.test(extractRoleName(roleValue)) && <td>{enr.role ?? '—'}</td>}
                      <td>{statusBadge(enr.status)}</td>
                      <td>{enr.grade ?? '—'}</td>
                      <td>{enr.instructor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          {/* Admin actions: ready for future expansion */}
          <section className={styles.userDetailPage__actions}>
            <Button
              className={styles.userDetailPage__actionBtn}
              type="button"
              size="sm"
              variant="outline"
            >
              Edit Info
            </Button>
            <Button
              className={styles.userDetailPage__actionBtn}
              type="button"
              size="sm"
              variant="outline"
              disabled={user.status !== 'active'}
            >
              Deactivate
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Production Notes:
 * - Handles all role input variants (string, object, missing) to prevent runtime errors.
 * - Only references production API fields, and robust to backend schema changes.
 * - Unified use of global badge and button UI components.
 * - Ready for admin/user expansion and additional actions.
 */