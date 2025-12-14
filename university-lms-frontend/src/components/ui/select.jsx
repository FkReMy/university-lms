/**
 * Select Component
 * ----------------------------------------------------------------------------
 * Global, accessible select (dropdown) for LMS UI.
 * - All style, state, and tokens are governed by select.module.scss (design system).
 * - ARIA-compliant, fully accessible for all input forms/dialogs.
 * - Controlled/uncontrolled compatible.
 * - No sample/demo logic; only production-ready code.
 *
 * Props:
 * - id?: string                         // For label association (auto-generated if omitted)
 * - label?: string | ReactNode          // Optional label for the dropdown field
 * - error?: string | ReactNode          // Error message (shown under select)
 * - help?: string | ReactNode           // Help/hint message (shown under select)
 * - options?: Array<{ value, label, disabled? }>   // Option list (optional if children used)
 * - className?: string                  // Extra class(es) for wrapper
 * - selectClassName?: string            // Extra class(es) for <select>
 * - children?: ReactNode                // Custom <option> children (optional, if options not used)
 * - ...rest: All native <select> props 
 */

import PropTypes from 'prop-types';
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
  // For accessible label association
  const generatedId = useId();
  const selectId = id || generatedId;

  // Compose design-system classes
  const wrapperClass = [styles.select__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [
    styles.select,
    error ? styles['select--error'] : '',
    selectClassName,
  ].filter(Boolean).join(' ');

  // Compute aria-describedby
  const describedByIds = [];
  if (help) describedByIds.push(`${selectId}-help`);
  if (error) describedByIds.push(`${selectId}-error`);
  const ariaDescribedBy = describedByIds.length ? describedByIds.join(' ') : undefined;

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={selectId} className={styles.select__label}>
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={fieldClass}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        {options
          ? options.map(opt => (
              <option
                value={opt.value}
                disabled={opt.disabled}
                key={typeof opt.value === 'string' || typeof opt.value === 'number'
                  ? opt.value : String(opt.label)}
              >
                {opt.label}
              </option>
            ))
          : children}
      </select>

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

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    disabled: PropTypes.bool,
  })),
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Production/Architecture Notes:
 * - Design-system styling ensures field, error, help, and label are unified.
 * - Uses auto-generated id for label/aria if not provided for a11y robustness.
 * - No local/demo/sample code; ready for dynamic backend-driven options/values.
 */