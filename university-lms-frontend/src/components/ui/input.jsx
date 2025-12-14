/**
 * Input Component
 * ----------------------------------------------------------------------------
 * A production-ready, unified input field for the LMS UI.
 * - Applies all design system styles with input.module.scss.
 * - Fully accessible (label association, describedBy, aria-invalid, etc.).
 * - Controlled/uncontrolled and flexible in all forms and panels.
 * - Accepts all native input props and wrapper/input classname overrides.
 * - No sample/demo logic; prod architecture only.
 *
 * Props:
 * - type?: string (e.g., "text" | "email" | "password" | "number") (Default: "text")
 * - id?: string                     // Required if label given, else auto-generated
 * - label?: string | ReactNode      // Optional field label
 * - error?: string | ReactNode      // Error message (below input)
 * - help?: string | ReactNode       // Help/hint message (below input)
 * - className?: string              // Wrapper classes
 * - inputClassName?: string         // Field (input) classes
 * - ...rest: All native input props (value, onChange, placeholder, etc.)
 */

import PropTypes from 'prop-types';
import { useId } from 'react';
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
  // For a11y: auto-generate ID if none provided
  const generatedId = useId();
  const inputId = id || generatedId;

  // Design-system classes for inputs and wrapper
  const wrapperClass = [styles.input__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [
    styles.input,
    error ? styles['input--error'] : '',
    inputClassName,
  ].filter(Boolean).join(' ');

  // Compose aria-describedby chain
  const describedByIds = [];
  if (help) describedByIds.push(`${inputId}-help`);
  if (error) describedByIds.push(`${inputId}-error`);
  const ariaDescribedBy = describedByIds.length ? describedByIds.join(' ') : undefined;

  return (
    <div className={wrapperClass}>
      {label && (
        <label className={styles.input__label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={fieldClass}
        type={type}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />

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

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

/**
 * Production/Architecture Notes:
 * - No local/sample/demo markup, only production-ready global input/label layout.
 * - All accessible/ARIA logic is global and composable.
 * - Can be used for forms, modals, panels, filters, and search.
 */