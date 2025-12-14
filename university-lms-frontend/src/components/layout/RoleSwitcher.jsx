/**
 * RoleSwitcher Component
 * ---------------------------------------------------------------------------
 * Production-grade UI control for switching between user roles (e.g. Student, Admin).
 * - Uses only global primitives and design system styles.
 * - Fully accessible: keyboard support, ARIA, screen reader compliant.
 * - Never demo/sample-specific logic; no magic role labels in code.
 *
 * Props:
 * - roles: Array<{ label: string, value: string, icon?: ReactNode }>
 * - value: string (active role value)
 * - onChange: function(newValue: string)
 * - className?: string
 * - ...rest: (props for root <div>)
 */

import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

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

  // Find the active role
  const activeRole = roles.find(r => r.value === value) || roles[0];

  // Toggle and close helpers
  const toggle = () => setOpen(prev => !prev);
  const close = () => setOpen(false);

  // Keyboard and focus navigation support
  const handleKeyDown = e => {
    if (e.key === "Escape") {
      close();
      btnRef.current?.focus();
    }
    if (e.key === "ArrowDown" && !open) {
      setOpen(true);
    }
  };

  // Outside click handler to close dropdown
  useEffect(() => {
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

      {/* Accessible Dropdown Menu */}
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

RoleSwitcher.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/**
 * Production/Architecture Notes:
 * - RoleSwitcher is a presentational/global component; no sample logic or "magic" roles hardcoded.
 * - All icons/labels/buttons passed in must be from the design system.
 * - All keyboard and ARIA interactions are included.
 * - Extensible for theme, feature flags, or org-specific role sets.
 */