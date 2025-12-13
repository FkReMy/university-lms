import { Link } from 'react-router-dom';

import { ROUTES } from '@/lib/constants';

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="landing__hero">
        <p className="landing__eyebrow">University LMS</p>
        <h1 className="landing__title">Learn, teach, and manage in one place.</h1>
        <p className="landing__subtitle">
          A streamlined hub for courses, assignments, quizzes, grades, and resources.
        </p>
        <div className="landing__actions">
          <Link className="landing__primary" to={ROUTES.LOGIN}>
            Sign in
          </Link>
          <Link className="landing__secondary" to={ROUTES.REGISTER}>
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}
