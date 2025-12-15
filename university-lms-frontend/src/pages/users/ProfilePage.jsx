/**
 * ProfilePage Component (Production)
 * ----------------------------------------------------------------------------
 * View and optionally edit the authenticated user's own LMS profile.
 * - Shows all personal info (name, email, role, status, join date).
 * - Optionally allows editing name/email.
 * - Shows enrolled/teaching courses and dashboard progress.
 * - All elements use unified/global components.
 * - No sample/demo logic; 100% backend data.
 *
 * Usage:
 *   <Route path="/profile" element={<ProfilePage />} />
 */

import { useEffect, useState } from 'react';

import styles from './ProfilePage.module.scss';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import enrollmentApi from '@/services/api/enrollmentApi'; // Should provide .listMine()
import profileApi from '@/services/api/profileApi';     // Should provide .getProfile(), .updateProfile()

export default function ProfilePage() {
  // Internal state for user/courses, loading, and UI
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load user profile and courses on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        // Profile
        const u = await profileApi.getProfile();
        // Courses/enrollments
        const cs = await enrollmentApi.listMine();
        if (isMounted) {
          setUser(u || {});
          setForm({ name: u?.full_name || '', email: u?.email || '' });
          setCourses(Array.isArray(cs) ? cs : []);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setCourses([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  function handleEdit(e) {
    e.preventDefault();
    setEditing(true);
    setSuccessMsg('');
    setErrorMsg('');
  }

  function handleCancel(e) {
    e.preventDefault();
    setForm({ name: user.full_name, email: user.email });
    setEditing(false);
    setSuccessMsg('');
    setErrorMsg('');
  }

  // Save to backend (profile update)
  async function handleSave(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!form.name || !form.email) {
      setErrorMsg("Name and email cannot be empty.");
      return;
    }
    try {
      const updated = await profileApi.updateProfile({
        name: form.name,
        email: form.email,
      });
      setUser(updated || { ...user, ...form });
      setEditing(false);
      setSuccessMsg("Profile updated!");
    } catch (err) {
      setErrorMsg("Update failed, please try again.");
    }
  }

  function formatDate(dt) {
    if (!dt) return "";
    return new Date(dt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function roleBadge(role) {
    let variant = "secondary";
    if (/student/i.test(role)) variant = "primary";
    else if (/instructor/i.test(role)) variant = "success";
    else if (/associate/i.test(role)) variant = "warning";
    return <Badge variant={variant}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
  }

  function statusBadge(status) {
    let variant = "secondary";
    if (/active/i.test(status)) variant = "success";
    else if (/inactive/i.test(status)) variant = "danger";
    else if (/invited/i.test(status)) variant = "warning";
    return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.profilePage__title}>My Profile</h1>
      {loading ? (
        <div className={styles.profilePage__loading}>Loading profile…</div>
      ) : (
        <div className={styles.profilePage__container}>
          {/* Profile head/info */}
          <section className={styles.profilePage__section}>
            <h2 className={styles.profilePage__sectionTitle}>Personal Information</h2>
            {editing ? (
              <form className={styles.profilePage__form} onSubmit={handleSave}>
                <label>
                  Name
                  <Input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Email
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </label>
                <div className={styles.profilePage__formBtns}>
                  <Button type="submit" variant="primary" className={styles.profilePage__actionBtn}>Save</Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className={styles.profilePage__actionBtn}>Cancel</Button>
                </div>
                {errorMsg && <div className={styles.profilePage__errorMsg}>{errorMsg}</div>}
                {successMsg && <div className={styles.profilePage__successMsg}>{successMsg}</div>}
              </form>
            ) : (
              <div>
                <div className={styles.profilePage__infoRow}>
                  <span className={styles.profilePage__label}>Name:</span> {user.full_name}
                  {roleBadge(user.role)} {statusBadge(user.status)}
                </div>
                <div className={styles.profilePage__infoRow}>
                  <span className={styles.profilePage__label}>Email:</span>{" "}
                  <span className={styles.profilePage__email}>{user.email}</span>
                </div>
                <div className={styles.profilePage__infoRow}>
                  <span className={styles.profilePage__label}>Member Since:</span>{" "}
                  {formatDate(user.created_at)}
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className={styles.profilePage__actionBtn}
                  onClick={handleEdit}
                  style={{ marginTop: "1.15em" }}
                >Edit Profile</Button>
                {successMsg && <div className={styles.profilePage__successMsg}>{successMsg}</div>}
              </div>
            )}
          </section>
          {/* Courses/Teaching */}
          <section className={styles.profilePage__section}>
            <h2 className={styles.profilePage__sectionTitle}>
              {user.role && /student/i.test(user.role)
                ? 'My Courses'
                : 'Courses Teaching/Assisting'}
            </h2>
            {courses.length === 0 ? (
              <div className={styles.profilePage__empty}>No courses yet.</div>
            ) : (
              <table className={styles.profilePage__coursesTable}>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.role ?? '—'}</td>
                      <td>
                        <div className={styles.profilePage__progressBarWrap}>
                          <div
                            className={styles.profilePage__progressBar}
                            style={{ width: `${c.progress}%` }}
                           />
                        </div>
                        <span>{c.progress}%</span>
                      </td>
                      <td>{c.grade ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Production Notes:
 * - All user/courses info is loaded from real APIs.
 * - All form fields/buttons/badges use unified design system.
 * - Ready for scalable UX: all error/success UI is in place and extensible.
 */