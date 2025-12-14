/**
 * Tooltip Component
 * ----------------------------------------------------------------------------
 * Production-ready, accessible floating tooltip for LMS UI.
 * - Uses global CSS module for positioning, theme, and animation.
 * - ARIA and keyboard accessible; works on any focusable element.
 * - No sample/demo logic; code is scalable, backend-ready, and clean.
 *
 * Props:
 * - content: string | ReactNode        // Tooltip label/element
 * - position?: "top" | "right" | "bottom" | "left"   // Tooltip position (default: "top")
 * - delay?: number                    // Show delay in ms (default: 0)
 * - className?: string                // Extra class for tooltip
 * - children: ReactNode               // Tooltip trigger (must be a single focusable React element)
 * - ...rest: other props for outer <span>
 */

import PropTypes from 'prop-types';
import React, { useRef, useState, useId } from 'react';

import styles from './tooltip.module.scss';

export default function Tooltip({
  content,
  position = "top",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef();
  const tooltipId = useId();

  // Show tooltip with optional delay
  const show = () => {
    if (delay) {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  };

  // Hide tooltip and clear pending timeout
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // Clone only the single child (must be focusable)
  const child = React.Children.only(children);
  const triggerProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-describedby': visible ? tooltipId : undefined,
    tabIndex: child.props.tabIndex ?? 0,
  };

  return (
    <span className={styles.tooltip__wrapper} {...rest}>
      {React.cloneElement(child, triggerProps)}
      {visible && (
        <span
          className={[
            styles.tooltip,
            styles[`tooltip--${position}`],
            className,
          ].filter(Boolean).join(" ")}
          role="tooltip"
          id={tooltipId}
        >
          {content}
          <span className={styles.tooltip__arrow} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

Tooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  position: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  delay: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};

/**
 * Production/Architecture Notes:
 * - All tokens, color, arrow, and z-index handled by tooltip.module.scss
 * - Trigger is always keyboard and mouse accessible
 * - Only supports one child (enforced by cloneElement / Children.only)
 * - Safe for forms, icons, navigation, status, and anywhere extra explanation is needed
 */