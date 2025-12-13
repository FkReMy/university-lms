/**
 * Select Component
 * ----------------------------------------------------------
 * A reusable, accessible select (dropdown) component for the LMS UI using CSS modules.
 *
 * Responsibilities:
 * - Provide a styled <select> dropdown with support for label, help, and error.
 * - Forward all props to the native <select> for flexibility.
 * - Allow custom className, selectClassName, and options.
 * - Support both controlled and uncontrolled usage.
 * - Accessible: label association, ARIA for error/help.
 *
 * Props:
 * - id: string (required for accessibility if label is provided)
 * - label: string or ReactNode (optional field label)
 * - error: string or ReactNode (optional error message)
 * - help: string or ReactNode (optional help text)
 * - options: array of { value, label, disabled? }   OR   ReactNode children
 * - className: string (extra class to wrapper)
 * - selectClassName: string (extra class for the select element)
 * - children: ReactNode (for custom <option> elements instead of options array)
 * - ...rest: all other native <select> props
 *
 * Usage:
 *   <Select
 *     id="role"
 *     label="Role"
 *     options={[
 *       { value: 'student', label: 'Student' },
 *       { value: 'professor', label: 'Professor' },
 *       { value: 'admin', label: 'Admin', disabled: true }
 *     ]}
 *     value={role}
 *     onChange={e => setRole(e.target.value)}
 *     error={error}
 *   />
 */

import { useId } from 'react';

import styles from './select.module.scss';

export default function Select({
  id,
  label,
  error,
  help,
  options,
  children,
  className = '',
  selectClassName = '',
  ...rest
}) {
  // Unique fallback id (for associating label) if not provided
  const generatedId = useId();
  const selectId = id || generatedId;

  // CSS modules: combine classes for wrapper and <select>
  const wrapperClass = [styles.select__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [
    styles.select,
    error ? styles['select--error'] : '',
    selectClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {/* Optional label */}
      {label && (
        <label htmlFor={selectId} className={styles.select__label}>
          {label}
        </label>
      )}

      {/* The select dropdown */}
      <select
        id={selectId}
        className={fieldClass}
        aria-invalid={!!error}
        aria-describedby={help ? `${selectId}-help` : error ? `${selectId}-error` : undefined}
        {...rest}
      >
        {/* Render options: via props.options array or direct children */}
        {options
          ? options.map(opt => (
              <option
                value={opt.value}
                disabled={opt.disabled}
                key={typeof opt.value === 'string' || typeof opt.value === 'number' ? opt.value : String(opt.label)}
              >
                {opt.label}
              </option>
            ))
          : children}
      </select>

      {/* Help and error messaging */}
      {help && (
        <div id={`${selectId}-help`} className={styles.select__help}>
          {help}
        </div>
      )}
      {error && (
        <div id={`${selectId}-error`} className={styles.select__error}>
          {error}
        </div>
      )}
    </div>
  );
}