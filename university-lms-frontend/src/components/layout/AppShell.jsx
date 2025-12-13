/**
 * AppShell Component
 * ----------------------------------------------------------
 * Main layout shell for the LMS UI.
 *
 * Responsibilities:
 * - Provides application-wide layout structure: header, sidebar/nav, and page content area.
 * - Handles basic responsive layout for desktop/mobile.
 * - Manages skip-link, main wrapper, and props for routing.
 * - Integrates modular Sidebar and Topbar components to allow design consistency.
 *
 * Props:
 * - children: ReactNode             - Main page content.
 * - header: ReactNode (optional)    - Header (defaults to imported Topbar).
 * - sidebar: ReactNode (optional)   - Sidebar/Nav (defaults to imported Sidebar).
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

// Correct case-sensitive import!
import styles from './AppShell.module.scss';

// Use dedicated Sidebar and Topbar components for modularity
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Simple skip link for accessibility
function SkipToContent() {
  return (
    <a href="#main-content" className={styles.skiplink}>
      Skip to main content
    </a>
  );
}

/**
 * Main AppShell component.
 * Accepts optional custom header/sidebar (or uses modular defaults).
 * Handles sidebar toggle state for responsiveness.
 */
export default function AppShell({
  children,
  header,
  sidebar,
  className = '',
  contentClassName = '',
  ...rest
}) {
  // Sidebar Responsiveness (open/close for mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compose class names for layout
  const shellClass = [styles.shell, className].filter(Boolean).join(' ');
  const mainClass = [styles.main, contentClassName].filter(Boolean).join(' ');

  // Overlay for mobile nav when sidebar is open
  const showOverlay = sidebarOpen;

  return (
    <div className={shellClass} {...rest}>
      <SkipToContent />

      {/* Sidebar, allow override or use shared component */}
      {sidebar !== undefined ? (
        sidebar
      ) : (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

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
        {/* Header, allow override or use shared component */}
        {header !== undefined ? (
          header
        ) : (
          <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

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

/**
 * Notes:
 * - The Sidebar and Topbar components should handle their own semantics, nav links, and menu toggling as needed.
 * - Make sure ./Sidebar.jsx and ./Topbar.jsx exist and are implemented for design consistency.
 * - Always use the correct file case when importing (case sensitive filesystems).
 * - This shell is flexible enough to allow direct overrides for header/sidebar, useful for modals or special routes.
 */