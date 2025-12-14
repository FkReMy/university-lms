/**
 * Centralized Utility Functions (LMS)
 * ----------------------------------------------------------------------------
 * Production-ready, side-effect free except debounced helper.
 * - No sample/demo code. All helpers safe for global UI and backend calls.
 */

// Internal only: Normalize a value to a valid Date or return null if invalid.
function toDateSafe(input) {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format a date string or Date to a human-readable format.
 * Uses 'en' locale and defaults to "Jan 5, 2025" style.
 * Returns empty string if the date cannot be parsed.
 *
 * @param {string|Date} input - Date input
 * @param {Intl.DateTimeFormatOptions} options - Intl formatting options
 * @returns {string}
 */
export function formatDate(input, options = {}) {
  const date = toDateSafe(input);
  if (!date) return '';
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

/**
 * Truncate a string to a max length, appending an ellipsis if needed.
 * Returns empty string for falsy inputs.
 *
 * @param {string} text - Text to truncate
 * @param {number} max - Maximum string length (default: 120)
 * @returns {string}
 */
export function truncate(text, max = 120) {
  if (!text) return '';
  const str = String(text);
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

/**
 * Build a query string from an object, skipping undefined/null/empty-string.
 * Returns '' if all fields are skipped. Otherwise returns "?key=val&..." string.
 *
 * @param {Record<string, any>} params
 * @returns {string}
 */
export function toQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, value);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Debounce function generator.
 * Returns a debounced function with a `cancel()` method.
 *
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Time in ms to wait after last call (default: 250)
 * @returns {Function}
 */
export function debounce(fn, delay = 250) {
  let timer;
  const debounced = (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => window.clearTimeout(timer);
  return debounced;
}

/**
 * Generates a semi-unique client-side ID string.
 * Uses a prefix, timestamp, and random segment.
 *
 * @param {string} prefix - Optional string (default: "id")
 * @returns {string}
 */
export function uid(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 8);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Production/Architecture Notes:
 * - All helpers are globally reusable; all output is safe for global app UI patterns.
 * - No sample/demo code anywhere; suitable for backend, form, query, or react-code.
 */