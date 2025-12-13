/**
 * LoginPage Component
 * ----------------------------------------------------------
 * The LMS login page, handling user authentication.
 *
 * Responsibilities:
 * - Renders login form for email/username and password.
 * - Handles form state, errors, loading, and submission.
 * - Can display error/success messages (e.g., invalid, password reset link sent, etc).
 * - Optionally supports "Remember me", forgot password, and social logins.
 *
 * Usage:
 *   <Route path="/login" element={<LoginPage />} />
 */

import React, { useState } from 'react';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handler for form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    // Simulate API for demo; replace with real auth call
    setTimeout(() => {
      setLoading(false);
      if ((username === "student" && password === "studentpass") ||
          (username === "admin" && password === "adminpass")) {
        setSuccessMsg('Login successful! Redirecting…');
        // Put navigation here (history.push or navigate('...'))
      } else {
        setErrorMsg('Invalid username or password.');
      }
    }, 1100);
  }

  // Handler for forgot password
  function handleForgot(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('If this email exists, a reset link was sent.');
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage__box}>
        <h1 className={styles.loginPage__title}>Sign in to LMS</h1>
        <form className={styles.loginPage__form} onSubmit={handleSubmit}>
          {/* Username/email */}
          <label className={styles.loginPage__label}>
            Email or Username
            <input
              className={styles.loginPage__input}
              type="text"
              autoFocus
              autoComplete="username"
              placeholder="jane@student.edu"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          {/* Remember me + forgot password */}
          <div className={styles.loginPage__row}>
            <label className={styles.loginPage__checkboxLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>
            <a
              href="#"
              className={styles.loginPage__link}
              tabIndex={loading ? -1 : 0}
              onClick={handleForgot}
            >
              Forgot password?
            </a>
          </div>
          {/* Error/message */}
          {errorMsg && <div className={styles.loginPage__errorMsg}>{errorMsg}</div>}
          {successMsg && <div className={styles.loginPage__successMsg}>{successMsg}</div>}
          {/* Submit */}
          <button
            className={styles.loginPage__submit}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Optional: Social login providers */}
        {/* 
        <div className={styles.loginPage__divider}><span>OR</span></div>
        <div className={styles.loginPage__social}>
          <button>Sign in with Google</button>
        </div>
        */}
      </div>
      <div className={styles.loginPage__footer}>
        © {new Date().getFullYear()} LMS University. All rights reserved.
      </div>
    </div>
  );
}