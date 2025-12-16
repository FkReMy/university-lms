/**
 * Button Component
 * ----------------------------------------------------------------------------
 * Production-grade, global button for LMS.
 * - Fully design-system compliant (CSS module: button.module.scss).
 * - Supports primary/secondary/danger/default/etc. via variant prop.
 * - Handles loading (spinner, ARIA) and disabled states.
 * - NO demo/sample logic.
 *
 * Props:
 * - type?: "button" | "submit" | "reset"     // Default: "button"
 * - variant?: "primary" | "secondary" | "danger" | "default" (Default: "primary")
 * - loading?: boolean                        // Spinner + disables interaction
 * - disabled?: boolean
 * - className?: string                       // Extra/override class names
 * - children?: ReactNode                     // Button content
 * - ...rest: All native button props (onClick, value, etc)
 */

import PropTypes from 'prop-types';

import styles from './button.module.scss';

/**
 * Unified design-system loading spinner (16x16).
 */
function Spinner() {
  return (
    <span className={styles.button__spinner} aria-label="Loading…">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
 * Global Button component.
 */
export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  // Class composition: global base, variant, size, disabled, additional
  const baseClass = styles.button;
  const variantClass = styles[`button--${variant}`] || '';
  const sizeClass = styles[`button--${size}`] || '';
  const isDisabledClass = (loading || disabled) ? styles['is-disabled'] : '';
  const finalClassName = [
    baseClass,
    variantClass,
    sizeClass,
    isDisabledClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={finalClassName}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {/* Loader spinner (design system only) */}
      {loading && <Spinner />}
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'default', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Production/Architecture Notes:
 * - NO demo/sample/local markup - only unified, scalable, backend-ready UI.
 * - All variants, loading, and disabled are styled and handled globally.
 * - Additional tokens/variants are easily added in the design system.
 */