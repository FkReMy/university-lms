/**
 * AppShell Component
 * ---------------------------------------------------------------------------
 * Main application shell for the LMS UI.
 * - Provides global layout consistency (sidebar/nav, topbar, content).
 * - Integrates shared Sidebar/Topbar from the global design system.
 * - Handles accessibility (skip link, roles, focus management).
 * - Full responsive/mobile sidebar support.
 * - No samples/demos; content and layout are production-grade.
 *
 * Props:
 * - children: ReactNode                 - Main content for the shell.
 * - header?: ReactNode                  - Custom header/topbar, defaults to global Topbar.
 * - sidebar?: ReactNode                 - Custom sidebar, defaults to global Sidebar.
 * - className?: string                  - Extra wrapper class for root div.
 * - contentClassName?: string           - For main content area.
 * - ...rest: any other props for root div.
 */

import { useState } from 'react';

import styles from './AppShell.module.scss';
import Sidebar from './Sidebar';   // Import your unified Sidebar component
import Topbar from './Topbar';     // Import your unified Topbar component

// Skip link for accessibility, always visible for keyboard/screenreader users
function SkipToContent() {
  return (
    <a href="#main-content" className={styles.skiplink}>
      Skip to main content
    </a>
  );
}

export default function AppShell({
  children,
  header,
  sidebar,
  className = '',
  contentClassName = '',
  ...rest
}) {
  // State for sidebar open/closed (responsive hamburger menu)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form wrapper and panel class names
  const shellClass = [styles.shell, className].filter(Boolean).join(' ');
  const mainClass = [styles.main, contentClassName].filter(Boolean).join(' ');

  // Show a dark overlay for modal sidebar when open on mobile screens
  const showOverlay = sidebarOpen;

  return (
    <div className={shellClass} {...rest}>
      {/* Keyboard-accessible skip link for a11y */}
      <SkipToContent />

      {/* Sidebar: allow injection/override or unify with shared Sidebar */}
      {sidebar !== undefined ? (
        sidebar
      ) : (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Responsive overlay: blocks background when nav is open on mobile */}
      {showOverlay && (
        <div
          className={styles.sidebar__overlay}
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main page content panel */}
      <div className={styles.shell__main}>
        {/* Header/topbar: allow injection or default to shared Topbar */}
        {header !== undefined ? (
          header
        ) : (
          <Topbar
            brand={<span className={styles.shell__brand}>University LMS</span>}
            actions={(
              <button
                type="button"
                className={styles.shell__menuBtn}
                aria-label={sidebarOpen ? 'Hide navigation' : 'Show navigation'}
                onClick={() => setSidebarOpen(open => !open)}
              >
                ☰
              </button>
            )}
          />
        )}

        {/* Main page area */}
        <main
          className={mainClass}
          id="main-content"
          tabIndex={-1}
          role="main"
          aria-label="Main content area"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * Design/Architecture Notes:
 * - Sidebar and Topbar components must use your global/shared components only.
 * - No demo/sample content; production-grade layout for all pages.
 * - Accessibility: skip link, roles, and focusable main.
 * - Sidebar header are customizable for flexibility, but always default to the global design system.
 * - Mobile/desktop responsiveness handled by CSS (see AppShell.module.scss).
 * - Layout overrides via props, but all navigation and shell should be consistent.
 */