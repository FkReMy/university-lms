/**
 * LandingPage Component (Production)
 * ----------------------------------------------------------------------------
 * Modern, unified landing page for the University LMS.
 * - Uses only global styles/components.
 * - All navigation/actions are via SPA <Link>.
 * - Ready for expansion (marketing, FAQ, support).
 *
 * Usage:
 *   <Route path="/" element={<LandingPage />} />
 */

import { Link } from 'react-router-dom';

import styles from './LandingPage.module.scss';

import { ROUTES } from '@/lib/constants';
import Button from '@/components/ui/button';

export default function LandingPage() {
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
            as={Link}
            className={styles.primary}
            to={ROUTES.LOGIN}
            size="lg"
            variant="primary"
          >
            Sign in
          </Button>
          <Button
            as={Link}
            className={styles.secondary}
            to={ROUTES.REGISTER}
            size="lg"
            variant="outline"
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
 * - Uses only design-system Button (as=Link) for unified SPA navigation.
 * - The layout is ready for further content blocks or support panels.
 * - No samples or demos; real navigation everywhere.
 */