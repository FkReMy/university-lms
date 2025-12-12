/**
 * useDebounce
 * ----------------------------------------------------------
 * React hook for debouncing changing values or inputs.
 *
 * Responsibilities:
 * - Accept a value and a delay.
 * - Return a debounced "stable" value that only updates after the delay.
 * - Useful for input fields, search queries, typeahead, etc.
 *
 * Usage:
 *   const debouncedValue = useDebounce(value, 300);
 *
 * Notes:
 * - If `value` changes before the delay, the timer resets.
 * - Only updates the returned value after delay ms of inactivity.
 */

import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of the input value.
 *
 * @param {*} value         The value to debounce.
 * @param {number} delay    Debounce delay (in ms). Default: 300.
 * @returns {*}             The "debounced" value.
 */
export function useDebounce(value, delay = 300) {
  // State for the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes before delay elapses
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}