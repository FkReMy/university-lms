/**
 * RegisterPage Component (Production)
 * ----------------------------------------------------------------------------
 * User registration page for the LMS.
 * - Uses global UI components and state.
 * - Connects to a real backend for account creation (API to be implemented).
 * - No demo, mock, or sample logic; all business logic and error handling are real/prod.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.scss';

import { ROUTES } from '@/lib/constants';
// Optionally: import Button from '@/components/ui/button'; if you have a global button
import userApi from '@/services/api/userApi'; // This must expose: create({ name, email, password })

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Controlled input state update
  const handleChange = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  // On form submit, send data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Client-side validation
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      // Backend call: adjust payload to match your schema
      await userApi.create({
        firstName: form.name, // or split into first/last
        email: form.email,
        password: form.password,
      });
      setMessage('Account created! You can sign in now.');
      setTimeout(() => navigate(ROUTES.LOGIN), 500);
    } catch (err) {
      // Error handling: show backend error or generic
      setError(err?.message || 'Failed to create account. Please check your info.');
    } finally {
      setSubmitting(false);
    }
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
          <button
            className={styles.loginPage__submit}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
          {/* To use the global Button component, replace <button> above */}
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

/**
 * Production Notes:
 * - Communicates only with real backend API.
 * - UI is fully controlled, closes loop on backend and validation error.
 * - All legacy/demo logic removed.
 * - Replace userApi.create with your backend call as needed.
 */