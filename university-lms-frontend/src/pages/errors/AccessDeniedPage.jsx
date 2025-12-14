/**
 * AccessDeniedPage Component (Production)
 * ----------------------------------------------------------------------------
 * Unified LMS 403 (forbidden) error page.
 * - Shows code, title, and clear access denied message.
 * - SPA navigation link(s) for recovery (home/login).
 * - All styles and navigation use global conventions.
 *
 * Usage:
 *   <Route path="/denied" element={<AccessDeniedPage />} />
 */

import { Link } from 'react-router-dom';

import styles from './AccessDeniedPage.module.scss';

import { ROUTES } from '@/lib/constants';

export default function AccessDeniedPage() {
  return (
    <div className={styles.accessDeniedPage}>
      <div className={styles.accessDeniedPage__card}>
        <h1 className={styles.accessDeniedPage__number}>403</h1>
        <h2 className={styles.accessDeniedPage__title}>Access Denied</h2>
        <div className={styles.accessDeniedPage__desc}>
          Sorry, you don&apos;t have permission to view this page.
        </div>
        <div className={styles.accessDeniedPage__actions}>
          <Link to={ROUTES.HOME} className={styles.accessDeniedPage__homeBtn}>
            Go to Home
          </Link>
          {/* Optionally add a login link if user is not authenticated */}
          {/* <Link to={ROUTES.LOGIN} className={styles.accessDeniedPage__homeBtn}>
            Login
          </Link> */}
        </div>
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - Navigation and button styles are unified and ready for global use.
 * - You can add role-based or global links for flexible access recovery.
 * - The layout is accessible, visually centered, and scalable for all error contexts.
 */