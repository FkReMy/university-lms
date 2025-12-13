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
      </div>
    </div>
  );
}
