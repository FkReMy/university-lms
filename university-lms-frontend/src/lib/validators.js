/**
 * Global Synchronous Form Validators (LMS)
 * ----------------------------------------------------------------------------
 * Centralized pure helpers for validation logic.
 * - Returns booleans only (never throws).
 * - Suitable for all form libs (react-hook-form, Formik, custom hooks).
 * - No sample/demo logic. All checks are prod-stable.
 */

/**
 * True when value is present: non-empty string, filled array, or non-nullish.
 * @param {*} value
 * @returns {boolean}
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate minimum trimmed length for string/number value.
 * @param {*} value
 * @param {number} min
 * @returns {boolean}
 */
export function minLength(value, min = 3) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length >= min;
}

/**
 * Validate maximum trimmed length for string/number value.
 * @param {*} value
 * @param {number} max
 * @returns {boolean}
 */
export function maxLength(value, max = 255) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length <= max;
}

/**
 * Basic email format validation (case insensitive).
 * @param {*} value
 * @returns {boolean}
 */
export function isEmail(value) {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  return emailRegex.test(String(value));
}

/**
 * Strong password checker:
 * - Minimum length, and must contain upper/lower/number/symbol.
 * - Adjust regex policies for your security guidelines.
 * @param {string} value
 * @param {number} min
 * @returns {boolean}
 */
export function isStrongPassword(value, min = 8) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  const hasLength = trimmed.length >= min;
  const hasUpper = /[A-Z]/.test(trimmed);
  const hasLower = /[a-z]/.test(trimmed);
  const hasNumber = /\d/.test(trimmed);
  const hasSymbol = /[^A-Za-z0-9]/.test(trimmed);
  return hasLength && hasUpper && hasLower && hasNumber && hasSymbol;
}

/**
 * Strict equality (useful for confirm password fields).
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function matches(value, other) {
  return value === other;
}

/**
 * URL validation using try/catch and URL constructor.
 * @param {*} value
 * @returns {boolean}
 */
export function isUrl(value) {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Production/Architecture Notes:
 * - Designed for use in global form validation, always returns a boolean.
 * - Can be composed in any form/hooks library for all field types.
 * - No demo/sample code, only import real logic in production UI.
 */