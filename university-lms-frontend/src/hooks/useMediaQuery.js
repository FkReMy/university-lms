/**
 * useMediaQuery Hook (LMS Design System/Production Utility)
 * ----------------------------------------------------------------------------
 * Subscribe to and reactively match CSS media queries for responsive UI.
 * - Accepts one or more media query strings.
 * - Returns a boolean: true if any query matches.
 * - Works in all browser/SSR/CSR environments; SSR will always return false.
 * - Global, production-grade (no sample/demo logic).
 *
 * Usage:
 *   const isTabletOrAbove = useMediaQuery(['(min-width: 768px)', '(pointer: fine)'])
 *
 * @param {string|string[]} query CSS media query or array of queries.
 * @returns {boolean} true if any query matches the viewport.
 */

import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  // Always operate on array for normalization.
  const queries = Array.isArray(query) ? query : [query];

  // Get match result for current environment.
  function getMatch() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return queries.some((q) => window.matchMedia(q).matches);
  }

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mqls = queries.map((q) => window.matchMedia(q));
    const handler = () => setMatches(getMatch);

    // Add change listeners for all queries used.
    mqls.forEach((mql) => {
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else if (mql.addListener) {
        // Legacy: Safari/old
        mql.addListener(handler);
      }
    });

    // Update on mount, in case of immediate media change.
    setMatches(getMatch);

    // Cleanup listeners on unmount or queries change
    return () => {
      mqls.forEach((mql) => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handler);
        } else if (mql.removeListener) {
          mql.removeListener(handler);
        }
      });
    };
    // It is safe to stringify queries, which will always yield same result for same arrays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queries)]);

  return matches;
}

/**
 * Production/Architecture Notes:
 * - Global, library-level hook; no demo/sample logic.
 * - Can be used for adaptive cards, layouts, menus, dialogs, forms, etc.
 * - Always safe for SSR: returns false if window not available.
 */