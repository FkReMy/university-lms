/**
 * RoleAwareNav Component
 * ----------------------------------------------------------------------------
 * Role-driven navigation container for LMS.
 * - Uses global class styles for layout and color.
 * - Accessible nav presentation with ARIA roles.
 * - No demo/sample logic; all links/labels/icons are passed in via navConfig.
 *
 * Props:
 * - role: string (required)       // Current user role ("student", "teacher", "admin", etc)
 * - navConfig: object (required)  // { [role]: [ { label, href, icon?, external? } ] }
 * - className?: string
 * - navProps?: object             // Extra props for <nav>
 * - ...rest: passed to root <div>
 */

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import styles from './RoleAwareNav.module.scss';

export default function RoleAwareNav({
  role,
  navConfig,
  className = "",
  navProps = {},
  ...rest
}) {
  // Get the array of nav items for the current role, or an empty array if missing.
  const navList = navConfig?.[role] || [];

  return (
    <div className={[styles.roleAwareNav, className].filter(Boolean).join(' ')} {...rest}>
      <nav
        className={styles.roleAwareNav__nav}
        aria-label="Main navigation"
        {...navProps}
      >
        <ul className={styles.roleAwareNav__list}>
          {navList.map(item => (
            <li className={styles.roleAwareNav__item} key={item.href || item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  className={styles.roleAwareNav__link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.icon && (<span className={styles.roleAwareNav__icon}>{item.icon}</span>)}
                  <span className={styles.roleAwareNav__label}>{item.label}</span>
                </a>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) => [
                    styles.roleAwareNav__link,
                    isActive ? styles.roleAwareNav__linkActive : ''
                  ].filter(Boolean).join(' ')}
                  aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                >
                  {item.icon && (<span className={styles.roleAwareNav__icon}>{item.icon}</span>)}
                  <span className={styles.roleAwareNav__label}>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

RoleAwareNav.propTypes = {
  role: PropTypes.string.isRequired,
  navConfig: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
        icon: PropTypes.node,
        external: PropTypes.bool,
      })
    )
  ).isRequired,
  className: PropTypes.string,
  navProps: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - No magic static links or in-component demo logic: all data comes from props.
 * - Styling, active state, focus, hover, etc., are defined in RoleAwareNav.module.scss.
 * - Fully ARIA/accessible and global design-system compliant.
 * - Role-driven, scalable, and ready for backend/content-driven navigation.
 */