/**
 * LoadingState Component
 * ----------------------------------------------------------
 * Simple, reusable loading indicator for async content.
 *
 * Responsibilities:
 * - Shows a centered spinner (SVG or custom) and optional label.
 * - Can be used in place of page/section content during data loading.
 * - Accessible with ARIA label and roles.
 *
 * Props:
 * - label: string (optional, defaults to "Loading…")
 * - spinner: ReactNode (optional, supply custom spinner, overrides default SVG)
 * - className: string (optional wrapper class)
 * - style: object (optional inline style)
 * - ...rest: any other props for <section>
 *
 * Usage:
 *   <LoadingState />
 *   <LoadingState label="Loading assignments…" />
 *   <LoadingState spinner={<PulseLoader />} />
 */

import styles from './LoadingState.module.scss';

function DefaultSpinner() {
  // A simple animated SVG spinner (12-dot fade)
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