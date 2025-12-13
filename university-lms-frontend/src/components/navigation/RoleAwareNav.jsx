/**
 * RoleAwareNav Component
 * ----------------------------------------------------------
 * Navigation menu that adapts links/items to the active user role.
 *
 * Responsibilities:
 * - Renders nav structure (list or sidebar) based on a user's current role.
 * - Accepts a mapping of role → nav items.
 * - Provides ARIA attributes and accessibility.
 *
 * Props:
 * - role: string                                 - The current/active role (e.g. 'student', 'teacher', 'admin')
 * - navConfig: object (role: array of nav items) - Example: { student: [...], teacher: [...], admin: [...] }
 *   Each nav item: { label, href, icon?: ReactNode, external?: bool }
 * - className: string (optional)                 - Wrapper classes
 * - navProps: object (optional)                  - Extra props for the <nav> element
 * - ...rest: props for root div
 *
 * Usage:
 *   <RoleAwareNav
 *     role="student"
 *     navConfig={{
 *       student: [
 *         { label: "My Courses", href: "/courses" },
 *         { label: "Profile", href: "/profile", icon: <UserIcon /> }
 *       ],
 *       teacher: [
 *         { label: "Teach", href: "/teach" },
 *       ]
 *     }}
 *   />
 */

import styles from './RoleAwareNav.module.scss';

export default function RoleAwareNav({
  role,
  navConfig,
  className = "",
  navProps = {},
  ...rest
}) {
  // Get list for current role, fallback to empty array
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
                <a
                  href={item.href}
                  className={styles.roleAwareNav__link}
                >
                  {item.icon && (<span className={styles.roleAwareNav__icon}>{item.icon}</span>)}
                  <span className={styles.roleAwareNav__label}>{item.label}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}