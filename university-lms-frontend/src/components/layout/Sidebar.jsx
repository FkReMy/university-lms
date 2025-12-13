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

import { useLocation, Link } from 'react-router-dom';

import styles from './Sidebar.module.scss'; // Correct import for sidebar-specific styles

export default function Sidebar({
  nav = [],
  brand,
  bottom,
  open = false,
  onClose,
  className = '',
  ...rest
}) {
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
        {nav.map(item => (
          <Link
            key={item.href}
            to={item.href}
            className={[
              styles.sidebar__navitem,
              location.pathname === item.href ? styles['sidebar__navitem--active'] : '',
            ].filter(Boolean).join(' ')}
            aria-current={location.pathname === item.href ? 'page' : undefined}
            tabIndex={0}
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
          </Link>
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