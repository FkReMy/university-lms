// Common form validators for the LMS frontend.
// These are pure, synchronous helpers designed to work with typical form libs
// (react-hook-form, Formik, custom hooks). They return booleans and avoid
// throwing so the caller can decide how to surface errors.

/** True when the value is present (non-empty string/array or any non-nullish). */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Validate minimum length for strings/numbers (after trimming). */
export function minLength(value, min = 3) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length >= min;
}

/** Validate maximum length for strings/numbers (after trimming). */
export function maxLength(value, max = 255) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length <= max;
}

/** Basic email pattern check (case-insensitive). */
export function isEmail(value) {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  return emailRegex.test(String(value));
}

/**
 * Strong password: length >= min, contains upper, lower, number, and symbol.
 * Adjust the regexes if your policy changes.
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

/** Strict equality comparison (useful for confirm-password fields). */
export function matches(value, other) {
  return value === other;
}

/** URL validator using the URL constructor (catches most invalid inputs). */
export function isUrl(value) {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}