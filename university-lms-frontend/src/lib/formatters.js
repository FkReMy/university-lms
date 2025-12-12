// Numeric formatting helpers for consistent UI display across the LMS.
// These utilities are intentionally small, side-effect free, and return
// empty strings when input is invalid so UI components can render gracefully.

/**
 * Safely coerce a value to a finite number.
 * Returns `null` when the result is NaN or not finite.
 */
function toFiniteNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

/**
 * Format a number as a currency string (default: USD).
 * Returns an empty string for invalid input.
 *
 * @param {number|string} value - The numeric value to format.
 * @param {Intl.NumberFormatOptions} [options] - Additional Intl options to override defaults.
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
 * Format a percentage from a decimal (0–1) or whole number.
 * Examples:
 *  - 0.42  -> "42.0%"
 *  - 42    -> "42.0%"
 * Returns an empty string for invalid input.
 *
 * @param {number|string} value - Decimal or whole-number percentage.
 * @param {number} [fractionDigits=1] - Number of decimal places to keep.
 */
export function formatPercent(value, fractionDigits = 1) {
  if (value === null || value === undefined || value === '') return '';
  const num = toFiniteNumber(value);
  if (num === null) return '';

  const normalized = Math.abs(num) <= 1 ? num * 100 : num;
  return `${normalized.toFixed(fractionDigits)}%`;
}

/**
 * Compact format for large integers (e.g., 1.2K, 3.4M).
 * Returns an empty string for invalid input.
 *
 * @param {number|string} value - The numeric value to format.
 * @param {Intl.NumberFormatOptions} [options] - Additional Intl options to override defaults.
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