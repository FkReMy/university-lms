// General utility helpers for the LMS frontend.
// These functions are small, side-effect free (except debounce timers), and
// return sensible fallbacks so UI components can fail gracefully.

/** Internal: normalize value to a valid Date or return null. */
function toDateSafe(input) {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format a date string or Date to a readable format.
 * Returns an empty string if the input cannot be parsed.
 *
 * @param {string|Date} input
 * @param {Intl.DateTimeFormatOptions} options Intl.DateTimeFormat options
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
 * Truncate text to a maximum length, appending an ellipsis if needed.
 * Returns an empty string for falsy inputs.
 *
 * @param {string} text
 * @param {number} max
 */
export function truncate(text, max = 120) {
  if (!text) return '';
  const str = String(text);
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

/**
 * Build a query string from an object, ignoring undefined, null, or empty-string values.
 * Example: toQueryString({ page: 2, q: 'math' }) -> "?page=2&q=math"
 *
 * @param {Record<string, any>} params
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
 * Simple debounce helper.
 * Returns a debounced function with a `cancel` method to clear pending calls.
 *
 * @param {Function} fn
 * @param {number} delay
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
 * Generate a semi-unique ID (client-side only).
 * Uses a prefix plus random segment and timestamp to reduce collision likelihood.
 *
 * @param {string} prefix
 */
export function uid(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 8);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${random}`;
}