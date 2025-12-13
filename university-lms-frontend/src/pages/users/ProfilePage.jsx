/**
 * ProfilePage Component
 * ----------------------------------------------------------
 * A page for users to view and optionally edit their own LMS profile.
 *
 * Responsibilities:
 * - Show user’s personal info: name, email, role, status, join date.
 * - (Optionally) Allow editing name, email, password, etc.
 * - Show courses currently enrolled/teaching.
 * - Summary stats about progress, grades, etc.
 *
 * Usage:
 *   <Route path="/profile" element={<ProfilePage />} />
 */

import { useEffect, useState } from 'react';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
  // State for user profile and courses (would be loaded via API in real app)
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  // Form (edit) state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Simulated profile loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const demoUser = {
        id: 18,
        name: "Jane Student",
        email: "jane.smith@student.edu",
        role: "student",
        status: "active",
        memberSince: "2023-09-14",
      };
      setUser(demoUser);
      setForm({ name: demoUser.name, email: demoUser.email });
      setCourses([
        { id: 101, name: "Biology 101", role: "Enrolled", progress: 73, grade: 88 },
        { id: 102, name: "Modern Art", role: "Enrolled", progress: 94, grade: 92 },
        { id: 103, name: "Statistics", role: "Enrolled", progress: 41, grade: 80 }
      ]);
      setLoading(false);
    }, 850);
  }, []);

  function handleEdit(e) {
    e.preventDefault();
    setEditing(true);
    setSuccessMsg('');
    setErrorMsg('');
  }

  function handleCancel(e) {
    e.preventDefault();
    setForm({ name: user.name, email: user.email });
    setEditing(false);
    setSuccessMsg('');
    setErrorMsg('');
  }

  // Simulated save
  function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setErrorMsg("Name and email cannot be empty.");
      setSuccessMsg('');
      return;
    }
    setUser(u => ({ ...u, name: form.name, email: form.email }));
    setEditing(false);
    setSuccessMsg("Profile updated!");
    setErrorMsg('');
  }

  function formatDate(dt) {
    if (!dt) return "";
    return new Date(dt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

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
          marginLeft: "0.5em"
        }}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  }

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
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </label>
                <div className={styles.profilePage__formBtns}>
                  <button type="submit" className={styles.profilePage__actionBtn}>Save</button>
                  <button type="button" onClick={handleCancel} className={styles.profilePage__actionBtn}>Cancel</button>
                </div>
                {errorMsg && <div className={styles.profilePage__errorMsg}>{errorMsg}</div>}
                {successMsg && <div className={styles.profilePage__successMsg}>{successMsg}</div>}
              </form>
            ) : (
              <div>
                <div className={styles.profilePage__infoRow}>
                  <span className={styles.profilePage__label}>Name:</span> {user.name}
                  {roleBadge(user.role)} {statusBadge(user.status)}
                </div>
                <div className={styles.profilePage__infoRow}>
                  <span className={styles.profilePage__label}>Email:</span>{" "}
                  <span className={styles.profilePage__email}>{user.email}</span>
                </div>
                <div className={styles.profilePage__infoRow}>
                  <span className={styles.profilePage__label}>Member Since:</span>{" "}
                  {formatDate(user.memberSince)}
                </div>
                <button
                  type="button"
                  className={styles.profilePage__actionBtn}
                  onClick={handleEdit}
                  style={{ marginTop: "1.15em" }}
                >Edit Profile</button>
                {successMsg && <div className={styles.profilePage__successMsg}>{successMsg}</div>}
              </div>
            )}
          </section>
          {/* Courses/teaching */}
          <section className={styles.profilePage__section}>
            <h2 className={styles.profilePage__sectionTitle}>
              {user.role === 'student' ? 'My Courses' : 'Courses Teaching/Assisting'}
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
                          ></div>
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