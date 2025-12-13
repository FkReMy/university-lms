/**
 * LoginPage Component
 * ----------------------------------------------------------
 * The LMS login page, handling user authentication.
 *
 * Responsibilities:
 * - Renders login form for email/username and password.
 * - Handles form state, errors, loading, and submission.
 * - On success, updates auth state and redirects the user.
 * - Can display error/success messages (e.g., invalid, password reset link sent, etc).
 * - Optionally supports "Remember me", forgot password, and social logins.
 *
 * Usage:
 *   <Route path="/login" element={<LoginPage />} />
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; // <-- Replace with the actual path to your auth store

import styles from './LoginPage.module.scss';

export default function LoginPage() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  // Auth store actions
  const loginSuccess = useAuthStore(state => state.loginSuccess);
  const loginFailure = useAuthStore(state => state.loginFailure);

  // Handler for form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Simulated API for demo; replace with real auth call
    setTimeout(() => {
      if (
        (username === 'student' && password === 'studentpass') ||
        (username === 'admin' && password === 'adminpass')
      ) {
        // Update global auth state with proper structure
        const user = {
          id: username === 'admin' ? 1 : 2,
          username,
          email: `${username}@university.edu`,
          name: username === 'admin' ? 'Admin User' : 'Student User',
          role: username === 'admin' ? 'Admin' : 'Student',
        };
        const token = `mock-jwt-token-${username}-${Date.now()}`;
        
        loginSuccess({ user, token });
        setSuccessMsg('Login successful! Redirecting…');
        setLoading(false);
        
        // Redirect user to dashboard or desired page
        setTimeout(() => {
          navigate('/');
        }, 600);
      } else {
        loginFailure('Invalid username or password.');
        setLoading(false);
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
        <form className={styles.loginPage__form} onSubmit={handleSubmit} autoComplete="on">
          {/* Username/email */}
          <label className={styles.loginPage__label}>
            Email or Username
            <input
              className={styles.loginPage__input}
              type="text"
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
            <button
              type="button"
              className={styles.loginPage__link}
              tabIndex={loading ? -1 : 0}
              onClick={handleForgot}
              disabled={loading}
            >
              Forgot password?
            </button>
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
            {loading ? 'Signing in…' : 'Sign in'}
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

/**
 * Notes:
 * - The useAuthStore hook should expose a login or setAuth type of function/object for global state.
 * - Actual login logic should use the real API; redirect path can be changed as per your routing.
 * - Replaced <a> with <button type="button"> for "Forgot password" to satisfy a11y/lint rules.
 * - Removed autoFocus for a11y compliance.
 * - You may want to tweak what is stored in the auth state (token, user, etc) based on your actual authStore.
 */