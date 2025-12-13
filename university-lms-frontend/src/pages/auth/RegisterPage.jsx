/**
 * RegisterPage Component
 * ----------------------------------------------------------
 * User registration page for the LMS.
 *
 * Responsibilities:
 * - Renders registration form for new users.
 * - Handles form state, validation, and submission.
 * - On success, redirects to login or dashboard.
 *
 * Usage:
 *   <Route path="/register" element={<RegisterPage />} />
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import styles from './LoginPage.module.scss';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulated API call - replace with actual registration logic
    setTimeout(() => {
      setSuccessMsg('Registration successful! Redirecting to login...');
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }, 1100);
  }
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
        <h1 className={styles.loginPage__title}>Create Account</h1>
        <form className={styles.loginPage__form} onSubmit={handleSubmit}>
          {/* Email */}
          <label className={styles.loginPage__label}>
            Email
            <input
              className={styles.loginPage__input}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="jane@student.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>

          {/* Username */}
          <label className={styles.loginPage__label}>
            Username
            <input
              className={styles.loginPage__input}
              type="text"
              name="username"
              autoComplete="username"
              placeholder="janedoe"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>

          {/* Password */}
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
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>

          {/* Confirm Password */}
          <label className={styles.loginPage__label}>
            Confirm Password
            <input
              className={styles.loginPage__input}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>

          {/* Error/Success messages */}
          {errorMsg && <div className={styles.loginPage__errorMsg}>{errorMsg}</div>}
          {successMsg && <div className={styles.loginPage__successMsg}>{successMsg}</div>}

          {/* Submit */}
          <button
            className={styles.loginPage__submit}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          {/* Link to login */}
          <div className={styles.loginPage__row}>
            <span>Already have an account? </span>
            <Link to="/login" className={styles.loginPage__link}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
      <div className={styles.loginPage__footer}>
        © {new Date().getFullYear()} LMS University. All rights reserved.
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
