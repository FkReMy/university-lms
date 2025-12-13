/**
 * UserManagementPage Component
 * ----------------------------------------------------------
 * LMS admin page for managing users (students, instructors, staff).
 *
 * Responsibilities:
 * - Lists all users in a table with filter/search controls.
 * - Allows admin to add, edit, deactivate, or remove users.
 * - Shows roles, enrollment count, and status badges in list.
 * - Ready for future mutation actions (edit, remove, etc).
 *
 * Usage:
 *   <Route path="/admin/users" element={<UserManagementPage />} />
 */

import { useEffect, useState } from 'react';
import styles from './UserManagementPage.module.scss';

export default function UserManagementPage() {
  // User data and search/filter state (replace with API in production)
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate fetching all users for management
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers([
        { id: 1, name: "Olivia Brown", email: "olivia.brown@example.edu", role: "student", enrolled: 5, status: "active" },
        { id: 2, name: "Samuel Green", email: "sam.g@faculty.edu", role: "instructor", enrolled: 2, status: "active" },
        { id: 3, name: "Maya Lee", email: "maya.lee@staff.edu", role: "associate", enrolled: 0, status: "invited" },
        { id: 4, name: "Noah Clark", email: "clark.noah@alumni.edu", role: "student", enrolled: 0, status: "inactive" }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Filtered list
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === "all" || u.role === role;
    return matchesSearch && matchesRole;
  });

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
          fontSize: "0.97em",
          marginLeft: "0.32em"
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  // Role badge (student, instructor, associate)
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
          fontSize: "0.97em",
          borderRadius: "0.87em",
          padding: "0.15em 0.95em",
          marginRight: "0.32em",
        }}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  }

  return (
    <div className={styles.userManagementPage}>
      <h1 className={styles.userManagementPage__title}>User Management</h1>
      <div className={styles.userManagementPage__controls}>
        <input
          type="text"
          className={styles.userManagementPage__search}
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.userManagementPage__roleSelect}
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="associate">Associates</option>
        </select>
        <button
          type="button"
          className={styles.userManagementPage__addBtn}
          // onClick={() => ... future add modal ...}
        >
          + Add User
        </button>
      </div>
      <div className={styles.userManagementPage__listArea}>
        {loading ? (
          <div className={styles.userManagementPage__loading}>Loading users…</div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.userManagementPage__empty}>No users found.</div>
        ) : (
          <table className={styles.userManagementPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Enrollments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>{roleBadge(user.role)}</td>
                  <td>{user.enrolled}</td>
                  <td>{statusBadge(user.status)}</td>
                  <td>
                    <button
                      className={styles.userManagementPage__actionBtn}
                      title="Edit user"
                      // onClick={() => ... future edit modal ...}
                    >Edit</button>
                    <button
                      className={styles.userManagementPage__actionBtn}
                      disabled={user.status === "inactive"}
                      title={user.status === "inactive" ? "User is inactive" : "Remove user"}
                      // onClick={() => ... future remove logic ...}
                    >Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}