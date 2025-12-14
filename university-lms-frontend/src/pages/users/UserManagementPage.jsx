/**
 * UserManagementPage Component (Production)
 * ----------------------------------------------------------------------------
 * LMS admin view for managing all users (students, instructors, associates).
 * - Lists all users with filtering/searching (by name/email/role).
 * - All badges, buttons, filters use the global design system.
 * - No sample/demo logic, fully API/DB-driven.
 * - Ready for add/edit/deactivate/remove actions.
 *
 * Usage:
 *   <Route path="/admin/users" element={<UserManagementPage />} />
 */

import { useEffect, useMemo, useState, useCallback } from 'react';

import styles from './UserManagementPage.module.scss';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import userApi from '@/services/api/userApi'; // Should provide .list(), .remove(id), etc.

export default function UserManagementPage() {
  // User data and search/filter state
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load all users from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      setLoading(true);
      try {
        const usersResult = await userApi.list();
        if (isMounted) setUsers(Array.isArray(usersResult) ? usersResult : []);
      } catch {
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  // Filter users by search and role
  const filteredUsers = useMemo(
    () =>
      users.filter(u => {
        const matchesSearch =
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = role === "all" || u.role === role;
        return matchesSearch && matchesRole;
      }),
    [users, search, role]
  );

  // Status badge
  function statusBadge(status) {
    if (!status) return null;
    let variant = "default";
    if (status === "active") variant = "success";
    else if (status === "inactive") variant = "danger";
    else if (status === "invited") variant = "warning";
    return (
      <Badge variant={variant} style={{ marginLeft: "0.32em" }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }

  // Role badge with variants
  function roleBadge(role) {
    let variant = "secondary";
    if (role === "student") variant = "primary";
    else if (role === "instructor") variant = "success";
    else if (role === "associate") variant = "warning";
    return (
      <Badge variant={variant} style={{ marginRight: "0.32em", fontWeight: 700 }}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  }

  // Action button handlers for future mutations (add/edit/remove)
  const handleAdd = useCallback(() => {
    // TODO: open add user dialog modal
  }, []);
  const handleEdit = useCallback((id) => {
    // TODO: open edit user dialog modal
  }, []);
  const handleRemove = useCallback((id) => {
    // TODO: open delete/remove/confirm dialog modal
  }, []);

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
          onClick={handleAdd}
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
                      onClick={() => handleEdit(user.id)}
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
                      onClick={() => handleRemove(user.id)}
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
 * Production Notes:
 * - All data/UI is backend-driven and unified via your global design system.
 * - Button, badge, and filter patterns are ready for real mutations/modals.
 * - No sample/demo values remain anywhere.
 */