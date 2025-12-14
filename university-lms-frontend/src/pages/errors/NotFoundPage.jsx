/**
 * NotFoundPage Component (Production)
 * ----------------------------------------------------------------------------
 * Unified 404 error page for invalid routes.
 * - Uses global design system and SPA navigation.
 * - Shows code, description, and a home button.
 * - Styled/accessibility-ready for all roles/devices.
 *
 * Usage:
 *   <Route path="*" element={<NotFoundPage />} />
 */

import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';
import { ROUTES } from '@/lib/constants';

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundPage__card}>
        <h1 className={styles.notFoundPage__number}>404</h1>
        <h2 className={styles.notFoundPage__title}>Page Not Found</h2>
        <div className={styles.notFoundPage__desc}>
          Sorry, the page you requested could not be found.
        </div>
        <div className={styles.notFoundPage__actions}>
          <Link to={ROUTES.HOME} className={styles.notFoundPage__homeBtn}>
            Go to Home
          </Link>
          {/* Optionally: add more navigation links here if needed */}
        </div>
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - Uses clean SPA navigation: no hardcoded <a>, always <Link> from react-router.
 * - Button layout and error number/title/class is visually consistent system-wide.
 * - Use to catch all invalid and broken routes in the app.
 */