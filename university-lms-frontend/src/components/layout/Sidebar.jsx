/**
 * Sidebar Component
 * ----------------------------------------------------------------------------
 * Global application sidebar navigation for LMS UI.
 * - Renders main navigation (dashboard, courses, users, etc) with design-system classes.
 * - Highlights the active link using global color/style tokens; brand and bottom slots.
 * - Supports mobile "open/close" state for responsive layouts.
 * - 100% production, scalable, and demo-free.
 *
 * Props:
 * - nav: Array<{ label, to|href, icon? }>
 * - navConfig: object      // Custom nav per-role. If not present, uses sane defaults.
 * - brand: ReactNode       // Optional logo or top branding area.
 * - bottom: ReactNode      // Optional footer slot (user profile, logout, etc).
 * - open: boolean          // Controls sidebar visibility on small screens.
 * - onClose: function      // Called on close (for mobile/hamburger sidebar).
 * - className: string
 * - ...rest: aside props.
 */

import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './Sidebar.module.scss';

import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

export default function Sidebar({
  nav = [],
  navConfig,
  brand,
  bottom,
  open = false,
  onClose,
  className = '',
  ...rest
}) {
  const { user } = useAuth();
  const role = (user?.role || 'student').toLowerCase();

  // Global default menu config: updated only for new features/pages.
  const defaultNavConfig = useMemo(
    () => ({
      student: [
        { label: 'Dashboard', to: ROUTES.DASHBOARD },
        { label: 'Courses', to: ROUTES.COURSES },
        { label: 'Assignments', to: ROUTES.ASSIGNMENTS },
        { label: 'Quizzes', to: ROUTES.QUIZZES },
        { label: 'Grades', to: ROUTES.GRADES },
        { label: 'Files', to: ROUTES.FILE_LIBRARY },
        { label: 'Settings', to: ROUTES.SETTINGS },
      ],
      admin: [
        { label: 'Dashboard', to: ROUTES.DASHBOARD },
        { label: 'Courses', to: ROUTES.COURSES },
        { label: 'Users', to: ROUTES.USERS },
        { label: 'Departments', to: ROUTES.DEPARTMENTS },
        { label: 'Files', to: ROUTES.FILE_LIBRARY },
        { label: 'Settings', to: ROUTES.SETTINGS },
      ],
      teacher: [
        { label: 'Dashboard', to: ROUTES.DASHBOARD },
        { label: 'Courses', to: ROUTES.COURSES },
        { label: 'Assignments', to: ROUTES.ASSIGNMENTS },
        { label: 'Quizzes', to: ROUTES.QUIZZES },
        { label: 'Grades', to: ROUTES.GRADES },
        { label: 'Files', to: ROUTES.FILE_LIBRARY },
        { label: 'Settings', to: ROUTES.SETTINGS },
      ],
    }),
    []
  );

  // Use (1) custom nav list, (2) nav config for role, or (3) sane role defaults
  const navItems = nav.length
    ? nav
    : navConfig?.[role] || defaultNavConfig[role] || defaultNavConfig.student;

  const location = useLocation();

  // Sidebar classes, include open/closed state for mobile.
  const sidebarClass = [
    styles.sidebar,
    open ? styles['sidebar--open'] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <aside
      className={sidebarClass}
      tabIndex={-1}
      aria-label="Application Sidebar"
      aria-hidden={!open ? undefined : false}
      {...rest}
    >
      {/* Brand/logo area (design system/global only) */}
      {brand && (
        <div className={styles.sidebar__header}>
          {brand}
          {onClose && (
            <button
              className={styles.sidebar__closebtn}
              aria-label="Close sidebar"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Global navigation (with active highlighting) */}
      <nav className={styles.sidebar__nav}>
        {navItems.map(item => (
          <NavLink
            key={item.to || item.href}
            to={item.to || item.href}
            end={!!item.end}
            className={({ isActive }) => [
              styles.sidebar__navitem,
              isActive || location.pathname === (item.to || item.href)
                ? styles['sidebar__navitem--active']
                : '',
            ].filter(Boolean).join(' ')}
            aria-current={location.pathname === (item.to || item.href) ? 'page' : undefined}
            tabIndex={0}
            onClick={onClose}
          >
            {item.icon && (
              <span className={styles.sidebar__icon} aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className={styles.sidebar__label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer/bottom slot (global component only: e.g., avatar/userpanel/logout) */}
      {bottom && (
        <div className={styles.sidebar__bottom}>
          {bottom}
        </div>
      )}
    </aside>
  );
}

/**
 * Production/Architecture Notes:
 * - No local, sample, or demo logic. All navigation is production/role aware.
 * - Brand, nav, and bottom slots are global/shared UI (no ad hoc markup).
 * - Default navConfig is extendable in one code location.
 * - Mobile open/close handled by parent shell and sidebar responsive classes.
 * - All icons, links, highlight, and typography are controlled by Sidebar.module.scss.
 */