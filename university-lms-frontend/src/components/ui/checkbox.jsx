/**
 * Checkbox Component
 * ----------------------------------------------------------------------------
 * Global, accessible, and production-ready checkbox component for the LMS UI.
 * - All styles/theme are driven by checkbox.module.scss (global design system).
 * - Supports full accessibility: uses id, label, ARIA, help/error association.
 * - Can be used as controlled (checked/onChange) or uncontrolled (defaultChecked).
 * - Passes all extra props to <input type="checkbox"> (e.g. aria, tabIndex).
 * - Never includes sample/demo logic.
 *
 * Props:
 * - id?: string                       // For accessibility and label association (auto-generated if omitted)
 * - label?: string | ReactNode        // Label (optional)
 * - error?: string | ReactNode        // Error text/message (optional)
 * - help?: string | ReactNode         // Help/hint text (optional)
 * - className?: string                // Extra classes for wrapper
 * - checkboxClassName?: string        // Extra classes for checkbox field only
 * - ...rest: All other native <input> props (checked, onChange, etc.)
 */

import PropTypes from 'prop-types';
import { useId } from 'react';

import styles from './checkbox.module.scss';

export default function Checkbox({
  id,
  label,
  error,
  help,
  className = '',
  checkboxClassName = '',
  ...rest
}) {
  // Generate a unique id if not supplied for labeling/input
  const generatedId = useId();
  const checkboxId = id || generatedId;

  // Root and field class names (design-system only)
  const wrapperClass = [styles.checkbox__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [styles.checkbox, checkboxClassName].filter(Boolean).join(' ');

  // ARIA described-by logic
  const describedByIds = [];
  if (help) describedByIds.push(`${checkboxId}-help`);
  if (error) describedByIds.push(`${checkboxId}-error`);
  const ariaDescribedBy = describedByIds.length ? describedByIds.join(' ') : undefined;

  return (
    <div className={wrapperClass}>
      <div className={styles.checkbox__inputRow}>
        <input
          type="checkbox"
          id={checkboxId}
          className={fieldClass}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...rest}
        />
        {label && (
          <label htmlFor={checkboxId} className={styles.checkbox__label}>
            {label}
          </label>
        )}
      </div>

      {/* Help/Hint message */}
      {help && (
        <div id={`${checkboxId}-help`} className={styles.checkbox__help}>
          {help}
        </div>
      )}
      {/* Error message */}
      {error && (
        <div id={`${checkboxId}-error`} className={styles.checkbox__error}>
          {error}
        </div>
      )}
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  checkboxClassName: PropTypes.string,
};

/**
 * Production/Architecture Notes:
 * - All label, error, help, and ARIA states use one global logic model.
 * - Styling, spacing, checked/disabled are from checkbox.module.scss.
 * - Ready for use in forms, quizzes, settings, and dynamic content.
 */