/**
 * Badge Component
 * ----------------------------------------------------------------------------
 * Production-grade, design-system badge for LMS.
 * - Shows a colored status/label with unified size/typography and variant coloring.
 * - Supports variants: info, success, warning, error, neutral, (and design-system extension).
 * - No sample/demo logic; only props+design-system classes.
 *
 * Props:
 * - children: ReactNode              // Badge content (text or icon+text)
 * - variant?: string                 // "info" | "success" | "warning" | "error" | "neutral" (default: info)
 * - className?: string
 * - style?: object
 * - ...rest: attributes for root <span>
 */

import PropTypes from 'prop-types';

import styles from './badge.module.scss';

// Valid variant list, fallback to "info"
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
  // Use only supported variants for strict design-system coloring
  const safeVariant = VARIANTS.includes(variant) ? variant : "info";
  const variantClass = styles[`badge--${safeVariant}`];
  const badgeClass = [styles.badge, variantClass, className].filter(Boolean).join(" ");

  return (
    <span className={badgeClass} style={style} {...rest}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(VARIANTS),
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - All colors and layout come from badge.module.scss (no inline styles except "style" prop).
 * - Only approved global variants are supported.
 * - 100% design-system scalable and ready for prod data.
 */