/**
 * Skeleton Component
 * ----------------------------------------------------------------------------
 * Global, animated loading skeleton placeholder for LMS UI.
 * - Provides block, line, or circle visual skeletons for loading feedback.
 * - Fully design-system driven—class names and shimmer effect only via CSS module.
 * - No sample/demo/inline logic; all shapes and styles unified.
 *
 * Props:
 * - width?: string|number        // Accepts "100%", 120, etc.
 * - height?: string|number       // Accepts "2em", 40, etc.
 * - circle?: boolean             // If true, renders as a circle
 * - className?: string           // Extra classes to root
 * - style?: object               // Custom inline style for fine-tuning
 * - ...rest: any props on <div>
 */

import PropTypes from 'prop-types';
import styles from './skeleton.module.scss';

export default function Skeleton({
  width,
  height,
  circle = false,
  className = '',
  style = {},
  ...rest
}) {
  // Merge inline/circle/size styles
  const inlineStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: circle ? "50%" : "0.36em",
    ...style,
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

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  circle: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - All animation/tokens/colors use skeleton.module.scss (no inline CSS for shimmer).
 * - Fully accessible for screen readers.
 * - Safe for use in cards, tables, lists, avatars, and all async UI.
 */