// Date utility helpers for consistent date handling across the app.
// These functions are intentionally small and side-effect free.

// Normalize input into a Date or return null if falsy/invalid.
export function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Format as ISO string (UTC). Returns empty string if invalid.
export function formatDateISO(value) {
  const date = toDate(value);
  return date ? date.toISOString() : '';
}

// Human-readable short date, e.g., "Jan 5, 2025".
export function formatDateShort(value) {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Human-readable date/time, e.g., "Jan 5, 2025, 3:15 PM".
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

// Return a new Date offset by the given number of days.
export function addDays(value, days = 0) {
  const date = toDate(value);
  if (!date) return null;
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Temporal helpers
export function isPast(value) {
  const date = toDate(value);
  if (!date) return false;
  const now = new Date();
  return date.getTime() < now.getTime();
}

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

export function isFuture(value) {
  const date = toDate(value);
  if (!date) return false;
  const now = new Date();
  return date.getTime() > now.getTime();
}