/**
 * UserDetailPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin or profile details page for viewing a user's information and course activity.
 * - Shows personal info: full name, email, role badge, status badge, join date.
 * - Activity summary: current/completed/enrolled courses.
 * - Unified UI: all badges/buttons use the global design system.
 * - No sample/demo logic, purely API-driven.
 * - Ready for further extension: edit, deactivate, etc.
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
        // Backend returns {full_name, email, status, created_at, role_name, ...}
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

  // Unified role badge (production: always use backend-sent role_name)
  function roleBadge(roleName) {
    let variant = 'secondary';
    if (/student/i.test(roleName)) variant = 'primary';
    else if (/professor|instructor/i.test(roleName)) variant = 'success';
    else if (/associate/i.test(roleName)) variant = 'warning';
    else if (/admin/i.test(roleName)) variant = 'info';
    return <Badge variant={variant}>{roleName ? (roleName.charAt(0).toUpperCase() + roleName.slice(1)) : 'Role'}</Badge>;
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
              {user.full_name}
              {roleBadge(user.role_name)}
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
              {user.role_name === 'student'
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
                    {user.role_name !== 'student' && <th>Role</th>}
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr) => (
                    <tr key={enr.id}>
                      <td>{enr.course}</td>
                      {user.role_name !== 'student' && <td>{enr.role ?? '—'}</td>}
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
              // onClick={() => ... future edit ...}
            >
              Edit Info
            </Button>
            <Button
              className={styles.userDetailPage__actionBtn}
              type="button"
              size="sm"
              variant="outline"
              disabled={user.status !== 'active'}
              // onClick={() => ... future deactivate ...}
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
 * - All state/data is fetched from production API (user/courses).
 * - Only references API fields present in unified backend schema.
 * - No sample/demo values; unified badges and buttons.
 * - Ready for future mutation/expansion logic (edit, deactivate, etc).
 */