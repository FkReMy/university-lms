/**
 * Button Component
 * ----------------------------------------------------------
 * A reusable, themeable button for the LMS UI using CSS modules for styling.
 *
 * Responsibilities:
 * - Provide a customizable button with primary/secondary/danger/default styles.
 * - Handle loading and disabled states in both styling and accessibility.
 * - Accept extra className from props for further customization.
 *
 * Props:
 * - type: "button" | "submit" | "reset" (default: "button")
 * - variant: "primary" | "secondary" | "danger" | "default" (styling variant)
 * - loading: boolean (shows spinner, disables interaction)
 * - disabled: boolean (disables interaction)
 * - className: string (extra custom classes)
 * - children: ReactNode (button content)
 * - ...rest: All other button props (onClick, value, form, etc)
 *
 * Usage:
 *   <Button variant="primary" onClick={handleClick}>Submit</Button>
 *   <Button variant="danger" loading>Deleting…</Button>
 */

import styles from './button.module.scss';

/**
 * Spinner icon for loading state.
 * Uses the .button__spinner class from the CSS module.
 */
function Spinner() {
  return (
    <span className={styles.button__spinner} aria-label="Loading…">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        <path
          d="M15 8A7 7 0 1 1 8 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </span>
  );
}

/**
 * Main Button component.
 */
export default function Button({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  // Combine SCSS module classes for base, variant, disabled, and user-supplied className
  const baseClass = styles.button;
  const variantClass = styles[`button--${variant}`] || '';
  // Use an is-disabled class for visual style (also handled by :disabled)
  const isDisabledClass = (loading || disabled) ? styles['is-disabled'] : '';
  const combinedClassName = [
    baseClass,
    variantClass,
    isDisabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {/* Show spinner if loading */}
      {loading && <Spinner />}
      {children}
    </button>
  );
}