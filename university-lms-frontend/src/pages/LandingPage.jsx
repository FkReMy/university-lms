import { Link } from 'react-router-dom';

import styles from './LandingPage.module.scss';

import { ROUTES } from '@/lib/constants';

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
          <Link className={styles.primary} to={ROUTES.LOGIN}>
            Sign in
          </Link>
          <Link className={styles.secondary} to={ROUTES.REGISTER}>
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}
