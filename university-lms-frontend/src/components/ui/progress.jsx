/**
 * Progress Component
 * ----------------------------------------------------------
 * A reusable, accessible progress bar for the LMS UI, styled with CSS modules.
 *
 * Responsibilities:
 * - Displays a horizontal progress bar with optional label/text.
 * - Fully accessible (ARIA & native semantics).
 * - Accepts value (percentage), min, max, and variant/color.
 * - Optionally shows percentage/value label.
 *
 * Props:
 * - value: number            - Current value (e.g., 60 for 60%)
 * - min: number (default 0)  - Minimum value
 * - max: number (default 100)- Maximum value
 * - showLabel: boolean       - Show value label (default false)
 * - label: string/ReactNode  - Optional descriptive label above bar
 * - variant: string          - Optional ("primary" | "success" | "warning" | "error" | "neutral")
 * - className: string        - Extra classes for wrapper
 * - ...rest: other props for the <div> wrapper
 *
 * Usage:
 *   <Progress value={44} label="Course Completion" showLabel variant="success" />
 */

import React from 'react';

import styles from './progress.module.scss';

// Supported color variants (primary is default)
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
  // Calculate percentage, clamp value between min and max
  const safeVal = isNaN(value) ? min : Math.min(Math.max(value, min), max);
  const pct = ((safeVal - min) / (max - min)) * 100;

  // CSS variant class
  const variantClass = styles[`progress--${VARIANTS.includes(variant) ? variant : "primary"}`];

  // ARIA
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