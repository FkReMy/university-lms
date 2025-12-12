/**
 * useTheme
 * ----------------------------------------------------------
 * Hook for controlling color mode (light/dark/system) in the LMS frontend.
 *
 * Responsibilities:
 * - Read user's preferred theme from localStorage or system preference.
 * - Provide a setter to update and persist the theme.
 * - Apply theme class to <html> for global CSS variables/themes.
 * - Expose the theme and a resolved 'isDark' boolean for components.
 *
 * Usage:
 *   const { theme, setTheme, isDark } = useTheme();
 *
 * Notes:
 * - Theme is one of: 'light', 'dark', or 'system'.
 * - Follows system color-scheme if 'system' is selected.
 * - Persists preference in localStorage.
 */

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'lms.theme.v1';

const THEME_VALUES = ['light', 'dark', 'system'];

/**
 * Returns preferred theme ('light', 'dark', 'system') from user or defaults.
 */
function getStoredTheme() {
  try {
    const val = window.localStorage.getItem(STORAGE_KEY);
    if (val && THEME_VALUES.includes(val)) return val;
  } catch {
    // Ignore storage errors
  }
  return 'system';
}

/**
 * Returns true if system prefers dark mode.
 */
function getSystemDark() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function useTheme() {
  // theme: 'light', 'dark', or 'system'
  const [theme, setThemeState] = useState(getStoredTheme);

  // Track whether resolved value is dark (for UI helpers)
  const [isDark, setIsDark] = useState(() =>
    theme === 'system' ? getSystemDark() : theme === 'dark'
  );

  // On theme or system change: update HTML class and isDark
  useEffect(() => {
    // Figure out true theme (force vs. system auto)
    const colorMode =
      theme === 'system' ? (getSystemDark() ? 'dark' : 'light') : theme;

    // Update <html> class for CSS theming
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
    document.documentElement.classList.toggle('light', colorMode === 'light');

    // Also update aria attributes (optional)
    document.documentElement.setAttribute('data-theme', colorMode);

    setIsDark(colorMode === 'dark');
  }, [theme]);

  // Re-sync theme if system preference changes and we're in 'system' mode.
  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      setIsDark(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
      document.documentElement.classList.toggle('light', !e.matches);
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  /**
   * Set theme and persist to localStorage.
   * @param {'light'|'dark'|'system'} next
   */
  const setTheme = useCallback((next) => {
    if (!THEME_VALUES.includes(next)) return;
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore
    }
  }, []);

  return { theme, setTheme, isDark };
}