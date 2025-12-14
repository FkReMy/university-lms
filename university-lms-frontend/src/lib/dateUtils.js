/**
 * Centralized Date Utilities (LMS)
 * ----------------------------------------------------------------------------
 * Production-ready, side-effect free date helpers.
 * - Unifies date parsing/formatting across the app.
 * - All functions stable, no sample/demo logic.
 */

// Convert input into a valid Date object or return null for invalid/falsy.
export function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Format a date as ISO string (UTC), or empty string for invalid.
export function formatDateISO(value) {
  const date = toDate(value);
  return date ? date.toISOString() : '';
}

// Format as short human date, e.g., "Jan 5, 2025".
export function formatDateShort(value) {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format as readable date and time, e.g., "Jan 5, 2025, 3:15 PM".
export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Return a new Date offset by the given number of days, or null if invalid.
export function addDays(value, days = 0) {
  const date = toDate(value);
  if (!date) return null;
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Returns true if the given date is in the past.
export function isPast(value) {
  const date = toDate(value);
  if (!date) return false;
  const now = new Date();
  return date.getTime() < now.getTime();
}

// Returns true if the given date is today (local calendar).
export function isToday(value) {
  const date = toDate(value);
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

// Returns true if the given date is in the future.
export function isFuture(value) {
  const date = toDate(value);
  if (!date) return false;
  const now = new Date();
  return date.getTime() > now.getTime();
}

/**
 * Production/Architecture Notes:
 * - All helpers are pure, side-effect free, and unified globally.
 * - No sample/demo logic—functions are importable anywhere for consistent UX.
 */