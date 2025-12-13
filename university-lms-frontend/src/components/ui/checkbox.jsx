/**
 * Checkbox Component
 * ----------------------------------------------------------
 * A reusable, accessible checkbox component for the LMS UI, styled with CSS modules.
 *
 * Responsibilities:
 * - Render a box with optional label, help, and error message.
 * - Fully accessible (keyboard, ARIA, label).
 * - Controlled (checked/onChange) or uncontrolled (defaultChecked) usage.
 * - Forwards all props to the underlying <input type="checkbox">.
 *
 * Props:
 * - id:   string                 (for accessibility and label association)
 * - label: string or ReactNode   (optional text or element after the box)
 * - error: string or ReactNode   (optional error message below)
 * - help: string or ReactNode    (optional help/hint below)
 * - className: string            (extra classes for wrapper)
 * - checkboxClassName: string    (extra classes for the checkbox input itself)
 * - ...rest: all other native <input> props (checked, onChange, etc.)
 *
 * Usage:
 *   <Checkbox
 *     id="accept"
 *     label="I accept the terms"
 *     checked={accepted}
 *     onChange={e => setAccepted(e.target.checked)}
 *     error={accepted === false ? "You must accept." : undefined}
 *   />
 */

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
  // Unique fallback id for accessibility if not specified
  const generatedId = useId();
  const checkboxId = id || generatedId;

  // Compose wrapper and checkbox field classes
  const wrapperClass = [styles.checkbox__wrapper, className].filter(Boolean).join(' ');
  const fieldClass = [styles.checkbox, checkboxClassName].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <div className={styles.checkbox__inputRow}>
        <input
          type="checkbox"
          id={checkboxId}
          className={fieldClass}
          aria-invalid={!!error}
          aria-describedby={
            help
              ? `${checkboxId}-help`
              : error
              ? `${checkboxId}-error`
              : undefined
          }
          {...rest}
        />
        {label && (
          <label htmlFor={checkboxId} className={styles.checkbox__label}>
            {label}
          </label>
        )}
      </div>

      {/* Help and error messaging below */}
      {help && (
        <div id={`${checkboxId}-help`} className={styles.checkbox__help}>
          {help}
        </div>
      )}
      {error && (
        <div id={`${checkboxId}-error`} className={styles.checkbox__error}>
          {error}
        </div>
      )}
    </div>
  );
}