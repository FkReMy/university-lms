import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.scss';
import { ROUTES } from '@/lib/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setMessage('Account created! You can sign in now.');
      setTimeout(() => navigate(ROUTES.LOGIN), 500);
    }, 400);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage__box}>
        <h1 className={styles.loginPage__title}>Create your account</h1>
        <form className={styles.loginPage__form} onSubmit={handleSubmit} autoComplete="on">
          <label className={styles.loginPage__label}>
            Full name
            <input
              className={styles.loginPage__input}
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              required
              disabled={submitting}
            />
          </label>
          <label className={styles.loginPage__label}>
            Email
            <input
              className={styles.loginPage__input}
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              disabled={submitting}
            />
          </label>
          <label className={styles.loginPage__label}>
            Password
            <input
              className={styles.loginPage__input}
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              required
              disabled={submitting}
              autoComplete="new-password"
            />
          </label>
          <label className={styles.loginPage__label}>
            Confirm password
            <input
              className={styles.loginPage__input}
              type="password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              required
              disabled={submitting}
              autoComplete="new-password"
            />
          </label>
          {error && <div className={styles.loginPage__errorMsg}>{error}</div>}
          {message && <div className={styles.loginPage__successMsg}>{message}</div>}
          <button className={styles.loginPage__submit} type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <div className={styles.loginPage__footer}>
          Already have an account?{' '}
          <Link className={styles.loginPage__link} to={ROUTES.LOGIN}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
