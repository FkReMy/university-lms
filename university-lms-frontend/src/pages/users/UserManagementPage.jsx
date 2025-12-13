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
 * - Uses Badge, Button, Input, Select components from the UI kit for consistency.
 *
 * Usage:
 *   <Route path="/admin/users" element={<UserManagementPage />} />
 */

import { useEffect, useState } from 'react';

import Input from '../../components/ui/input';   // UI consistent input
import Select from '../../components/ui/select'; // UI consistent select
import Button from '../../components/ui/button'; // UI consistent button
import Badge from '../../components/ui/badge';   // UI consistent badge

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

  // Filter users by search and role
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === "all" || u.role === role;
    return matchesSearch && matchesRole;
  });

  // Status badge using Badge component
  function statusBadge(status) {
    if(!status) return null;
    let variant = "default";
    if (status === "active") variant = "success";
    else if (status === "inactive") variant = "danger";
    else if (status === "invited") variant = "warning";
    return (
      <Badge variant={variant} style={{marginLeft: "0.32em"}}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }

  // Role badge using Badge component with custom color variants
  function roleBadge(role) {
    let variant = "secondary";
    if (role === "student") variant = "info";
    else if (role === "instructor") variant = "purple";
    else if (role === "associate") variant = "warning";
    return (
      <Badge variant={variant} style={{marginRight: "0.32em", fontWeight: 700}}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  }

  return (
    <div className={styles.userManagementPage}>
      <h1 className={styles.userManagementPage__title}>User Management</h1>
      <div className={styles.userManagementPage__controls}>
        <Input
          type="text"
          className={styles.userManagementPage__search}
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.userManagementPage__roleSelect}
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="associate">Associates</option>
        </Select>
        <Button
          type="button"
          className={styles.userManagementPage__addBtn}
          variant="primary"
          // onClick={() => ... future add modal ...}
        >
          + Add User
        </Button>
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
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roleBadge(user.role)}</td>
                  <td>{user.enrolled}</td>
                  <td>{statusBadge(user.status)}</td>
                  <td>
                    <Button
                      className={styles.userManagementPage__actionBtn}
                      size="sm"
                      variant="outline"
                      title="Edit user"
                      type="button"
                      // onClick={() => ... future edit modal ...}
                    >
                      Edit
                    </Button>
                    <Button
                      className={styles.userManagementPage__actionBtn}
                      size="sm"
                      variant="outline"
                      title={user.status === "inactive" ? "User is inactive" : "Remove user"}
                      type="button"
                      disabled={user.status === "inactive"}
                      // onClick={() => ... future remove logic ...}
                    >
                      Remove
                    </Button>
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

/**
 * Key refactors:
 * - Status/role badges now use the shared Badge component for a design-system look.
 * - Search, select, and buttons all use your UI library so app-wide look is unified.
 * - Table layout/controls pattern remains the same, but styling/manual colors are eliminated in favor of theme variants.
 */