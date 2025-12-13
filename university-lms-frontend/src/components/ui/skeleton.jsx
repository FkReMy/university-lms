/**
 * Skeleton Component
 * ----------------------------------------------------------
 * A simple skeleton/loading placeholder for the LMS UI using CSS modules.
 *
 * Responsibilities:
 * - Render a block, line, circle, or custom skeleton shape for loading states.
 * - Supports width, height, circle, and custom style.
 * - Animates with shimmer effect for better perception.
 *
 * Props:
 * - width: string|number (optional)   - e.g. "100%", 120 (px)
 * - height: string|number (optional)  - e.g. "2em", 40 (px)
 * - circle: boolean (optional)        - Makes the skeleton a circle (default: false)
 * - className: string (optional)      - Extra classes for the root div
 * - style: object (optional)          - Inline styles
 * - ...rest: any other props for <div>
 *
 * Usage:
 *   <Skeleton width={120} height={22} />
 *   <Skeleton circle width={48} height={48} />
 *   <Skeleton width="100%" height="1.5em" className="mt-2" />
 */

import styles from './skeleton.module.scss';

export default function Skeleton({
  width,
  height,
  circle = false,
  className = '',
  style = {},
  ...rest
}) {
  const inlineStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: circle ? "50%" : "0.36em",
    ...style
  };

  const skeletonClass = [
    styles.skeleton,
    circle ? styles.skeleton__circle : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={skeletonClass}
      style={inlineStyle}
      aria-busy="true"
      aria-label="Loading..."
      {...rest}
    />
  );
}