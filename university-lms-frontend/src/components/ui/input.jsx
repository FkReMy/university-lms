/**
 * Input Component
 * ----------------------------------------------------------
 * A reusable, accessible input field for the LMS UI using CSS modules.
 *
 * Responsibilities:
 * - Provide a styled, consistent input element for text, email, password, etc.
 * - Forward all props for flexibility (placeholder, type, onChange, etc.).
 * - Allow custom label, error, and help message.
 * - Support controlled and uncontrolled usage.
 * - Fully accessible with label association and ARIA.
 *
 * Props:
 * - type: string ("text" | "email" | "password" | etc., default: "text")
 * - id: string (required for accessibility if using label)
 * - label: ReactNode or string (optional label, rendered if provided)
 * - error: string or ReactNode (optional error message, shown under input)
 * - help: string or ReactNode (optional help text under input)
 * - className: string (to add to wrapper)
 * - inputClassName: string (to add to the input element)
 * - ...rest: All other input props (value, onChange, placeholder, etc.)
 *
 * Usage:
 *   <Input
 *     id="email"
 *     type="email"
 *     label="Email Address"
 *     value={email}
 *     onChange={e => setEmail(e.target.value)}
 *     error={error}
 *   />
 */

import React from 'react';
import styles from './input.module.scss';

export default function Input({
  type = 'text',
  id,
  label,
  error,
  help,
  className = '',
  inputClassName = '',
  ...rest
}) {
  // Unique id fallback for label/input association, if no id is passed
  const inputId = id || React.useId();

  // Compose base classes for input and wrapper
  const wrapperClass = [styles.input__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [
    styles.input,
    error ? styles['input--error'] : '',
    inputClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {/* Optional label */}
      {label && (
        <label className={styles.input__label} htmlFor={inputId}>
          {label}
        </label>
      )}

      {/* The input element */}
      <input
        id={inputId}
        className={fieldClass}
        type={type}
        aria-invalid={!!error}
        aria-describedby={help ? `${inputId}-help` : error ? `${inputId}-error` : undefined}
        {...rest}
      />

      {/* Help or error message */}
      {help && (
        <div id={`${inputId}-help`} className={styles.input__help}>
          {help}
        </div>
      )}
      {error && (
        <div id={`${inputId}-error`} className={styles.input__error}>
          {error}
        </div>
      )}
    </div>
  );
}