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

import { useLocation } from 'react-router-dom'; // Remove or replace if not using react-router

import styles from './AppShell.module.scss';

export default function Sidebar({
  nav = [],
  brand,
  bottom,
  open = false,
  onClose,
  className = '',
  ...rest
}) {
  // Get current path for "active" highlighting.
  // If not using react-router, pass current path as prop or use window.location
  let location = { pathname: "/" };
  try {
    location = useLocation();
  } catch {
    // No router context; fallback.
    location.pathname = window.location?.pathname || "/";
  }

  // Wrapper sidebar classes (open on small screens)
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
      {brand && (
        <div className={styles.sidebar__header}>
          {brand}
          {/* Optional close button for mobile UX */}
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
          <a
            key={item.href}
            href={item.href}
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
          </a>
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