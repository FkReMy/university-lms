/**
 * Badge Component
 * ----------------------------------------------------------
 * A reusable badge component for the LMS UI using CSS modules.
 *
 * Responsibilities:
 * - Display a small, colored label for status, tags, categories, etc.
 * - Supports several color variants (info, success, warning, error, etc).
 * - Accepts a custom className and inline style.
 *
 * Props:
 * - children: ReactNode             - The badge content/text.
 * - variant: string                 - Visual style (info | success | warning | error | neutral | custom). Default: "info"
 * - className: string               - Additional classes for the badge.
 * - style: object                   - Inline style.
 * - ...rest:                        - Other props for <span>.
 *
 * Usage:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="error" className="ml-2">Failed</Badge>
 */

import styles from './badge.module.scss';

const VARIANTS = [
  "info",
  "success",
  "warning",
  "error",
  "neutral"
];

export default function Badge({
  children,
  variant = "info",
  className = "",
  style = {},
  ...rest
}) {
  // Variant CSS: fallback to "info" for unknown values, renders ".badge--[variant]"
  const variantClass = styles[`badge--${VARIANTS.includes(variant) ? variant : "info"}`];
  const badgeClass = [styles.badge, variantClass, className].filter(Boolean).join(" ");

  return (
    <span className={badgeClass} style={style} {...rest}>
      {children}
    </span>
  );
}