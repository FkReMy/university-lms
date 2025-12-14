/**
 * LandingPage Component (Production)
 * ----------------------------------------------------------------------------
 * Modern, unified landing page for the University LMS.
 * - Uses only global styles/components.
 * - All navigation/actions use SPA routing, always work with React Router.
 * - Ready for marketing/expansion blocks.
 *
 * Usage:
 *   <Route path="/" element={<LandingPage />} />
 */

import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

import styles from './LandingPage.module.scss';

import Button from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

/**
 * LandingPage: University LMS entry point, globally styled and unified.
 * Sign In/Sign Up buttons use direct navigation for maximum reliability.
 */
export default function LandingPage() {
  const navigate = useNavigate();

  // Use navigate for robust integration with all router configs
  const handleLoginClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(ROUTES.LOGIN);
    },
    [navigate]
  );
  const handleRegisterClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(ROUTES.REGISTER);
    },
    [navigate]
  );

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>University LMS</p>
        <h1 className={styles.title}>Learn, teach, and manage in one place.</h1>
        <p className={styles.subtitle}>
          A streamlined hub for courses, assignments, quizzes, grades, and resources.
        </p>
        <div className={styles.actions}>
          <Button
            className={styles.primary}
            size="lg"
            variant="primary"
            type="button"
            onClick={handleLoginClick}
          >
            Sign in
          </Button>
          <Button
            className={styles.secondary}
            size="lg"
            variant="outline"
            type="button"
            onClick={handleRegisterClick}
          >
            Create account
          </Button>
        </div>
      </section>
    </div>
  );
}

/**
 * Production Notes:
 * - Navigation uses useNavigate for reliability regardless of linker config.
 * - All actions are unified and scale with the global button system.
 * - Ready for further expansion/content.
 */