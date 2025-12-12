/**
 * useMediaQuery
 * ----------------------------------------------------------
 * React hook for matching CSS media queries in the LMS frontend.
 *
 * Responsibilities:
 * - Accept a media query string or array of strings.
 * - Return a boolean indicating whether the query matches the current viewport.
 * - Provide a stable ref that updates on viewport changes or input changes.
 *
 * Usage:
 *   const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 *
 * Notes:
 * - Falls back to false during SSR.
 * - If you use an array, returns true if ANY query matches.
 */

import { useEffect, useState } from 'react';

/**
 * Returns true if the CSS media query (or any query in the array) matches.
 * @param {string|string[]} query One or more media query strings.
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  // Normalize to array for easier logic
  const queries = Array.isArray(query) ? query : [query];

  // Only evaluate in browser
  function getMatch() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return queries.some((q) => window.matchMedia(q).matches);
  }

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    // If we're not in a DOM environment, skip
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Create media query lists and attach listeners
    const mqls = queries.map((q) => window.matchMedia(q));
    const handler = () => setMatches(getMatch);

    mqls.forEach((mql) => {
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else if (mql.addListener) {
        // Support Safari and old browsers
        mql.addListener(handler);
      }
    });

    // Set initial state in case of changes since mount
    setMatches(getMatch);

    // Cleanup: remove all listeners
    return () => {
      mqls.forEach((mql) => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handler);
        } else if (mql.removeListener) {
          mql.removeListener(handler);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* stable: */ JSON.stringify(queries)]);

  return matches;
}