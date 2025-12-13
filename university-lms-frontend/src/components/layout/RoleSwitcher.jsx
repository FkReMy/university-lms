/**
 * RoleSwitcher Component
 * ----------------------------------------------------------
 * A UI control for switching between user roles (e.g., Student, Teacher, Admin).
 *
 * Responsibilities:
 * - Displays the current active role.
 * - Allows user to select a different role from a dropdown menu.
 * - Calls onChange handler with new role.
 * - Keyboard accessible and styled with a CSS module.
 *
 * Props:
 * - roles: Array<{ label: string, value: string, icon?: ReactNode }>
 * - value: string                - Current active role value.
 * - onChange: function(newValue) - Called when a new role is selected.
 * - className: string (optional) - Extra class for wrapper.
 * - ...rest: other props for <div>.
 *
 * Usage:
 *   <RoleSwitcher
 *     roles={[
 *       { label: "Student", value: "student", icon: <StudentIcon /> },
 *       { label: "Teacher", value: "teacher", icon: <TeacherIcon /> },
 *       { label: "Admin", value: "admin", icon: <AdminIcon /> },
 *     ]}
 *     value={currentRole}
 *     onChange={setCurrentRole}
 *   />
 */

import React, { useState, useRef } from 'react';

import styles from './RoleSwitcher.module.scss';

export default function RoleSwitcher({
  roles,
  value,
  onChange,
  className = '',
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find the selected role object
  const activeRole = roles.find(r => r.value === value) || roles[0];

  // Toggle dropdown
  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  // Handle keyboard nav and focus
  const handleKeyDown = e => {
    if (e.key === "Escape") {
      close();
      btnRef.current?.focus();
    }
    if (e.key === "ArrowDown" && !open) {
      setOpen(true);
    }
  };

  // Handle click outside
  React.useEffect(() => {
    if (!open) return;
    const handleClick = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Compose class names
  const rootClass = [styles.roleSwitcher, className].filter(Boolean).join(" ");
  const btnClass = styles.roleSwitcher__btn;
  const menuClass = [
    styles.roleSwitcher__menu,
    open ? styles["roleSwitcher__menu--open"] : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClass} {...rest}>
      <button
        type="button"
        ref={btnRef}
        className={btnClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="role-switcher-menu"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        {activeRole.icon && (
          <span className={styles.roleSwitcher__icon}>{activeRole.icon}</span>
        )}
        <span className={styles.roleSwitcher__label}>{activeRole.label}</span>
        <span className={styles.roleSwitcher__chevron} aria-hidden="true">
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      <ul
        ref={dropdownRef}
        id="role-switcher-menu"
        className={menuClass}
        role="menu"
        tabIndex={-1}
        aria-label="Switch role"
        hidden={!open}
      >
        {roles.map(role => (
          <li key={role.value} role="menuitem">
            <button
              type="button"
              className={[
                styles.roleSwitcher__option,
                value === role.value ? styles['roleSwitcher__option--active'] : ''
              ].filter(Boolean).join(' ')}
              tabIndex={0}
              onClick={() => {
                if (role.value !== value) onChange?.(role.value);
                close();
              }}
            >
              {role.icon && (
                <span className={styles.roleSwitcher__icon}>{role.icon}</span>
              )}
              <span className={styles.roleSwitcher__label}>{role.label}</span>
              {value === role.value && (
                <span className={styles.roleSwitcher__check} aria-hidden="true">
                  ✔
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}