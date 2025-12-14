/**
 * Global Numeric Formatting Utilities (LMS)
 * ----------------------------------------------------------------------------
 * Provides consistent, production-ready numeric/currency/percent/compact formatters for all UI.
 * - Returns empty string "" for invalid inputs, so all consuming components are robust.
 * - No sample/demo code—importable anywhere in the app.
 */

/**
 * Safely coerce a value to a finite number.
 * Returns `null` if value is NaN or not finite.
 *
 * @param {number|string} value
 * @returns {number|null}
 */
function toFiniteNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

/**
 * Format a number as currency (default: USD).
 * Returns "" for invalid input.
 *
 * @param {number|string} value      The value to format.
 * @param {Intl.NumberFormatOptions} [options] Additional format options.
 * @returns {string}
 */
export function formatCurrency(value, options = {}) {
  const num = toFiniteNumber(value);
  if (num === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    ...options,
  }).format(num);
}

/**
 * Format a percent from decimal (0-1) or whole integer.
 * Returns "" for invalid input.
 *
 * @param {number|string} value  Value to format (e.g., 0.75 or 75)
 * @param {number} [fractionDigits=1]  Number of digits after decimal
 * @returns {string}
 */
export function formatPercent(value, fractionDigits = 1) {
  if (value === null || value === undefined || value === '') return '';
  const num = toFiniteNumber(value);
  if (num === null) return '';

  const normalized = Math.abs(num) <= 1 ? num * 100 : num;
  return `${normalized.toFixed(fractionDigits)}%`;
}

/**
 * Compact notation for large integers, e.g., 1200 => "1.2K"
 * Returns "" for invalid input.
 *
 * @param {number|string} value
 * @param {Intl.NumberFormatOptions} [options]
 * @returns {string}
 */
export function formatCompact(value, options = {}) {
  const num = toFiniteNumber(value);
  if (num === null) return '';
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
    ...options,
  }).format(num);
}

/**
 * Production/Architecture Notes:
 * - All formatters are global, pure, and side-effect-free.
 * - No demo/sample code, and all results are safe for direct UI use.
 */