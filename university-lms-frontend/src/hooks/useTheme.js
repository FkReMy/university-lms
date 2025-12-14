/**
 * useTheme (LMS Production Hook)
 * ----------------------------------------------------------------------------
 * Hook for color mode (light/dark/system) management in LMS global UI.
 * - Reads and persists theme to localStorage.
 * - Applies color mode as CSS class and data attribute on <html>.
 * - Reacts to both user and system preference changes.
 * - No sample/demo logic—global/production-unified by design.
 *
 * Usage:
 *   const { theme, setTheme, isDark } = useTheme();
 *
 * theme: 'light' | 'dark' | 'system'
 * setTheme: (newTheme) => void
 * isDark: boolean (resolved)
 */

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'lms.theme.v1';
const THEME_VALUES = ['light', 'dark', 'system'];

/**
 * Load preferred theme from localStorage; fallback to system if missing.
 */
function getStoredTheme() {
  try {
    const val = window.localStorage.getItem(STORAGE_KEY);
    if (val && THEME_VALUES.includes(val)) return val;
  } catch {
    // Ignore errors on storage read
  }
  return 'system';
}

/**
 * Returns true if user's system prefers dark mode.
 */
function getSystemDark() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function useTheme() {
  // State: 'light', 'dark', or 'system'
  const [theme, setThemeState] = useState(getStoredTheme);

  // State for dark/light boolean (computed)
  const [isDark, setIsDark] = useState(
    theme === 'system' ? getSystemDark() : theme === 'dark'
  );

  // Reactively update <html> color theme class and data attr on theme/system change
  useEffect(() => {
    const colorMode =
      theme === 'system' ? (getSystemDark() ? 'dark' : 'light') : theme;

    // Set global theme class (for CSS variables/themes)
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
    document.documentElement.classList.toggle('light', colorMode === 'light');
    document.documentElement.setAttribute('data-theme', colorMode);

    setIsDark(colorMode === 'dark');
  }, [theme]);

  // Sync if user's system color mode changes (when 'system' is selected)
  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDark(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
      document.documentElement.classList.toggle('light', !e.matches);
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [theme]);

  /**
   * Update theme: will re-render global UI and persist to storage.
   * @param {'light'|'dark'|'system'} next
   */
  const setTheme = useCallback((next) => {
    if (!THEME_VALUES.includes(next)) return;
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  return { theme, setTheme, isDark };
}

/**
 * Production/Architecture Notes:
 * - No demo/sample code; ready for SSR, MPA, and CSR UI flows.
 * - Upgrades HTML theme class/data attr and safely stores selection.
 * - isDark is always up to date, so child themes adapt instantly.
 */