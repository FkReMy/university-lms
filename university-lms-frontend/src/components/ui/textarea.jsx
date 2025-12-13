/**
 * Textarea Component
 * ----------------------------------------------------------
 * A reusable, accessible textarea component for the LMS UI, styled with CSS modules.
 *
 * Responsibilities:
 * - Provide a styled textarea field with optional label, help, and error messages.
 * - Fully accessible (label association, ARIA attributes).
 * - Supports controlled/uncontrolled usage.
 * - Forwards all props to the underlying <textarea>.
 *
 * Props:
 * - id: string              (required if label is used; for accessibility)
 * - label: ReactNode/string (optional label shown above textarea)
 * - error: ReactNode/string (optional error message below textarea)
 * - help: ReactNode/string  (optional help or hint below textarea)
 * - className: string       (extra classes for wrapper)
 * - textareaClassName: string (extra classes for textarea element)
 * - ...rest: all props passed to <textarea> (value, onChange, rows, etc)
 *
 * Usage:
 *   <Textarea
 *     id="bio"
 *     label="About you"
 *     rows={5}
 *     value={bio}
 *     onChange={e => setBio(e.target.value)}
 *     error={bioError}
 *     help="Tell us a little about yourself."
 *   />
 */

import { useId } from 'react';

import styles from './textarea.module.scss';

export default function Textarea({
  id,
  label,
  error,
  help,
  className = '',
  textareaClassName = '',
  ...rest
}) {
  // Generate a unique fallback id for accessibility if not provided
  const generatedId = useId();
  const textareaId = id || generatedId;

  // Wrapper and field class names using CSS modules & custom classes
  const wrapperClass = [styles.textarea__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [
    styles.textarea,
    error ? styles['textarea--error'] : '',
    textareaClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {/* Optional label above the textarea */}
      {label && (
        <label htmlFor={textareaId} className={styles.textarea__label}>
          {label}
        </label>
      )}

      {/* The textarea element */}
      <textarea
        id={textareaId}
        className={fieldClass}
        aria-invalid={!!error}
        aria-describedby={
          help
            ? `${textareaId}-help`
            : error
            ? `${textareaId}-error`
            : undefined
        }
        {...rest}
      />

      {/* Optional help or error message shown below the textarea */}
      {help && (
        <div id={`${textareaId}-help`} className={styles.textarea__help}>
          {help}
        </div>
      )}
      {error && (
        <div id={`${textareaId}-error`} className={styles.textarea__error}>
          {error}
        </div>
      )}
    </div>
  );
}