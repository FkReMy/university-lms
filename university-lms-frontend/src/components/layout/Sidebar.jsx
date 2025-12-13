/**
 * Sidebar Component
 * ----------------------------------------------------------
 * Reusable application sidebar for your LMS UI.
 *
 * Responsibilities:
 * - Renders a navigation menu, (optional) app branding, and controls.
 * - Provides a consistent place for navigation links.
 * - Handles active link highlighting, accessibility, and theming.
 *
 * Props:
 * - nav: Array<{ label: string, href: string, icon?: ReactNode }>
 * - brand: ReactNode (optional top logo/section)
 * - bottom: ReactNode (optional footer/bottom content)
 * - open: boolean (for responsive sidebar visibility)
 * - onClose: function (called when sidebar wants to close, e.g., on small screens)
 * - className: string (extra wrapper classes)
 * - ...rest:  Other props for the aside element
 *
 * Usage:
 *   <Sidebar
 *     nav={[
 *       { label: "Dashboard", href: "/", icon: <HomeIcon /> },
 *       { label: "Courses", href: "/courses" },
 *     ]}
 *     brand={<Logo />}
 *     open={sidebarOpen}
 *     onClose={() => setSidebarOpen(false)}
 *   />
 */

import { NavLink, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import styles from './Sidebar.module.scss'; // Correct import for sidebar-specific styles

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
    }),
    []
  );

  const navItems = nav.length
    ? nav
    : navConfig?.[role] || defaultNavConfig[role] || defaultNavConfig.student;

  // Get current path for "active" highlighting
  const location = useLocation();

  // Sidebar class: includes open state for mobile
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
      aria-hidden={!open}
      {...rest}
    >
      {/* Optional branding/logo/header area */}
      {brand && (
        <div className={styles.sidebar__header}>
          {brand}
          {/* Optional close button for mobile sidebar */}
          {onClose && (
            <button
              className={styles.sidebar__closebtn}
              aria-label="Close sidebar"
              onClick={onClose}
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Navigation menu */}
      <nav className={styles.sidebar__nav}>
        {navItems.map(item => (
          <NavLink
            key={item.to || item.href}
            to={item.to || item.href}
            end={item.end}
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
              <span
                style={{ marginRight: 10, display: "inline-flex", alignItems: "center" }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
            )}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Optional bottom/footer area */}
      {bottom && (
        <div className={styles.sidebar__bottom}>
          {bottom}
        </div>
      )}
    </aside>
  );
}

/**
 * Notes:
 * - Fixed styles import to Sidebar.module.scss for correct sidebar class names and theming.
 * - Ensures correct .sidebar--open responsive class and .sidebar__navitem highlighting.
 * - onClose is optional; only rendered if provided (for mobile/tablet toggle UX).
 * - If no brand/footer given, only nav menu will show.
 */
