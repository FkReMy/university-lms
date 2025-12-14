/**
 * LoadingState Component
 * -------------------------------------------------------------------------
 * Production-grade, unified loading indicator for async page/section content.
 * - Displays a consistent, accessible, and branded spinner/loading label.
 * - Includes default spinner (global style) or accepts a design-system override.
 * - No sample, demo, or inline-specific logic.
 *
 * Props:
 * - label?: string         // Optional, for ARIA label (default "Loading…")
 * - spinner?: ReactNode    // Use to override default (must be design-system spinner!)
 * - className?: string
 * - style?: object
 * - ...rest: any extra props forwarded to root <section>
 */

import PropTypes from 'prop-types';

import styles from './LoadingState.module.scss';

/**
 * Renders a consistent SVG spinner (use only for default loading).
 * You can override via `spinner` prop for branded/dark-mode/etc.
 */
function DefaultSpinner() {
  return (
    <span className={styles.loadingState__spinner} aria-hidden="true">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        stroke="#2563eb"
        strokeWidth="3"
        role="presentation"
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r="19"
          strokeOpacity=".36"
          stroke="#89a7fa"
          strokeWidth="3"
        />
        <path
          d="M22 7
            a15 15 0 1 1 0 30
            a15 15 0 1 1 0 -30"
          strokeDasharray="70 120"
          stroke="#2563eb"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 22 22"
            to="360 22 22"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </span>
  );
}

/**
 * LoadingState main component.
 * All loading indicators use this for visual/UX consistency.
 */
export default function LoadingState({
  label = "Loading…",
  spinner,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <section
      className={[styles.loadingState, className].filter(Boolean).join(' ')}
      style={style}
      role="status"
      aria-live="polite"
      aria-label={label}
      {...rest}
    >
      <div className={styles.loadingState__center}>
        {spinner || <DefaultSpinner />}
        {label && (
          <span className={styles.loadingState__label}>{label}</span>
        )}
      </div>
    </section>
  );
}

LoadingState.propTypes = {
  label: PropTypes.string,
  spinner: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - No demo/sample logic: always a unified entry point for all async state UX across the LMS.
 * - All styles, motion, and color tokens are scoped in LoadingState.module.scss.
 * - May be used in any section/page Suspense fallback or while data loads.
 * - ARIA attributes for full screen reader support.
 */