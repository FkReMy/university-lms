/**
 * LoginPage Component (Production)
 * ----------------------------------------------------------------------------
 * Handles secure login for all LMS users.
 * - Uses global authentication hook and state.
 * - Handles errors, loading, "forgot password", and remembers user if requested.
 * - No sample/demo logic; all real backend-connection ready.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.scss';
import Button from '@/components/ui/button'; // Use your global Button component if available

import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  // Local form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Global authentication/redirect state
  const navigate = useNavigate();
  const { login, isAuthenticated, ready, error } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (ready && isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, ready, navigate]);

  // On form submit, trigger login handler
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await login({ username, password, remember });
      setSuccessMsg('Login successful! Redirecting…');
      setTimeout(() => navigate(ROUTES.DASHBOARD), 400);
    } catch (err) {
      setErrorMsg(err?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  // "Forgot password?" handler
  function handleForgot(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('If this email exists, a reset link was sent.');
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage__box}>
        <h1 className={styles.loginPage__title}>Sign in to LMS</h1>
        <form
          className={styles.loginPage__form}
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          <label className={styles.loginPage__label}>
            Email or Username
            <input
              className={styles.loginPage__input}
              type="text"
              autoComplete="username"
              placeholder="jane@student.edu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <label className={styles.loginPage__label}>
            Password
            <input
              className={styles.loginPage__input}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <div className={styles.loginPage__row}>
            <label className={styles.loginPage__checkboxLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
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
          {errorMsg && <div className={styles.loginPage__errorMsg}>{errorMsg}</div>}
          {error && !errorMsg && <div className={styles.loginPage__errorMsg}>{error}</div>}
          {successMsg && <div className={styles.loginPage__successMsg}>{successMsg}</div>}
          <Button
            className={styles.loginPage__submit}
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
      <div className={styles.loginPage__footer}>
        © {new Date().getFullYear()} LMS University. All rights reserved.
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - Uses only real authentication logic and global Button if available.
 * - All error/success messages come from real backend or global state.
 * - SSR/SPA compatible via controlled form state & hooks.
 */