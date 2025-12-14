/**
 * Progress Component
 * ----------------------------------------------------------------------------
 * Global, accessible progress bar for LMS UI.
 * - All tokens, sizes, and color variants come from progress.module.scss.
 * - ARIA/natively accessible for screen readers.
 * - No sample/demo logic—only production-quality, scalable code.
 *
 * Props:
 * - value: number                  // Current progress value (between min/max)
 * - min?: number                   // Min value (default 0)
 * - max?: number                   // Max value (default 100)
 * - showLabel?: boolean            // Show numeric percent label inside bar (default: false)
 * - label?: string | ReactNode     // Optional label above bar (for ARIA, etc.)
 * - variant?: string               // "primary" | "success" | "warning" | "error" | "neutral" (default: primary)
 * - className?: string             // Extra wrapper classes
 * - ...rest: props for wrapper <div>
 */

import PropTypes from 'prop-types';
import React from 'react';

import styles from './progress.module.scss';

// Supported color variants, fallback to "primary" if invalid
const VARIANTS = [
  "primary",
  "success",
  "warning",
  "error",
  "neutral"
];

export default function Progress({
  value,
  min = 0,
  max = 100,
  showLabel = false,
  label,
  variant = "primary",
  className = "",
  ...rest
}) {
  // Clamp and compute percent
  const safeVal = isNaN(value) ? min : Math.min(Math.max(value, min), max);
  const pct = ((safeVal - min) / (max - min)) * 100;

  // Variants for color/style
  const safeVariant = VARIANTS.includes(variant) ? variant : "primary";
  const variantClass = styles[`progress--${safeVariant}`];

  // Unique ID for aria-labelledby association
  const barId = React.useId();

  return (
    <div className={[styles.progress__wrapper, className].filter(Boolean).join(' ')} {...rest}>
      {label && (
        <div className={styles.progress__label} id={`${barId}-label`}>
          {label}
        </div>
      )}
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuenow={safeVal}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-labelledby={label ? `${barId}-label` : undefined}
        tabIndex={0}
      >
        <div
          className={[styles.progress__bar, variantClass].filter(Boolean).join(' ')}
          style={{ width: `${pct}%` }}
        >
          {showLabel && (
            <span className={styles.progress__value}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  showLabel: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  variant: PropTypes.oneOf(VARIANTS),
  className: PropTypes.string,
};

/**
 * Production/Architecture Notes:
 * - Only design-system tokens/colors, and ARIA accessible.
 * - Safe for use in dashboards, cards, forms, and feedback UIs.
 * - No sample/demo/local usage, only scalable component logic.
 */