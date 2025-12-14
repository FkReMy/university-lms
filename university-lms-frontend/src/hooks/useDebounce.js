/**
 * useDebounce Hook (LMS Design System/Production Utility)
 * ----------------------------------------------------------------------------
 * Debounces any changing value and returns a stable version after a set delay.
 * - Use for async search, debounced backend requests, input UX, etc.
 * - No sample/demo logic—just scalable, global hook for all UI flows.
 *
 * @param {*} value         Value to debounce (input, query, object, etc.)
 * @param {number} delay    Milliseconds to wait after last change (default: 300)
 * @returns {*}             Debounced value, updates only after delay
 */

import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 300) {
  // State to store the debounced version of incoming value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // On value or delay change, debounce setDebouncedValue
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up: cancel timer on value or delay change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Production/Architecture Notes:
 * - Global and composable, safe for all UI/UX scenarios.
 * - Only updates value after delay ms of inactivity/reset.
 * - No local/sample/demo logic; suitable for input, search, validation, etc.
 */