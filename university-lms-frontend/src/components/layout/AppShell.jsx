/**
 * AppShell Component
 * ----------------------------------------------------------
 * Main layout shell for the LMS UI.
 *
 * Responsibilities:
 * - Provides application-wide layout structure: header, sidebar/nav, and page content area.
 * - Handles basic responsive layout for desktop/mobile.
 * - Can manage sidebar toggle, user profile dropdown, etc.
 * - Manages skip-link, main wrapper, and props for routing.
 *
 * Props:
 * - children: ReactNode             - Main page content.
 * - header: ReactNode (optional)    - Header (defaults to built-in AppHeader).
 * - sidebar: ReactNode (optional)   - Sidebar/Nav (optional, defaults to built-in AppSidebar for main layout).
 * - className: string (optional)    - Wrapper class for custom layout.
 * - contentClassName: string        - For main content area.
 * - ...rest:                        - Extra props for root div.
 *
 * Usage:
 *   <AppShell>
 *     <YourPageComponent />
 *   </AppShell>
 */

import { useState } from 'react';

import styles from './appShell.module.scss';

// Example: simple skip link for accessibility
function SkipToContent() {
  return (
    <a href="#main-content" className={styles.skiplink}>
      Skip to main content
    </a>
  );
}

/**
 * Main AppShell component.
 * Accepts optional custom header/sidebar (or uses built-in).
 * Handles sidebar toggle for responsiveness.
 */
export default function AppShell({
  children,
  header,
  sidebar,
  className = '',
  contentClassName = '',
  ...rest
}) {
  // Sidebar Responsiveness (open/close)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Optionally, you can import and use your own Header or Sidebar components here.
  // For this template: they're just blank boxes with area labels.
  const DefaultHeader = () => (
    <header className={styles.header}>
      <button
        className={styles.header__menubtn}
        type="button"
        aria-label="Open sidebar"
        aria-controls="app-sidebar"
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen(o => !o)}
      >
        {/* Menu Hamburger SVG */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect y="6" width="28" height="2.5" rx="1.25" fill="#374151"/>
          <rect y="13" width="28" height="2.5" rx="1.25" fill="#374151"/>
          <rect y="20" width="28" height="2.5" rx="1.25" fill="#374151"/>
        </svg>
      </button>
      <span className={styles.header__brand}>LMS</span>
      {/* Add profile button or notification icons here */}
    </header>
  );

  const DefaultSidebar = () => (
    <aside
      className={[
        styles.sidebar,
        sidebarOpen ? styles['sidebar--open'] : '',
      ].filter(Boolean).join(' ')}
      id="app-sidebar"
      aria-hidden={!sidebarOpen}
    >
      <div className={styles.sidebar__header}>
        <span className={styles.sidebar__title}>Menu</span>
        <button
          className={styles.sidebar__closebtn}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </button>
      </div>
      <nav className={styles.sidebar__nav}>
        <a className={styles.sidebar__navitem} href="/">Dashboard</a>
        <a className={styles.sidebar__navitem} href="/courses">Courses</a>
        <a className={styles.sidebar__navitem} href="/settings">Settings</a>
        {/* Add more navigation links as needed */}
      </nav>
    </aside>
  );

  // Compose class names for layout
  const shellClass = [styles.shell, className].filter(Boolean).join(' ');
  const mainClass = [styles.main, contentClassName].filter(Boolean).join(' ');

  // Overlay for mobile nav when sidebar is open
  const showOverlay = sidebarOpen;

  return (
    <div className={shellClass} {...rest}>
      <SkipToContent />

      {/* Sidebar */}
      {sidebar !== undefined ? sidebar
        : <DefaultSidebar />}

      {/* Overlay for sidebar on mobile */}
      {showOverlay && (
        <div
          className={styles.sidebar__overlay}
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main layout panel */}
      <div className={styles.shell__main}>
        {/* Header */}
        {header !== undefined ? header : <DefaultHeader />}

        {/* Page Content */}
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