/**
 * Tooltip Component
 * ----------------------------------------------------------
 * A simple, accessible tooltip component for the LMS UI using CSS modules.
 *
 * Responsibilities:
 * - Show a label-type floating tooltip on hover or focus of a child element.
 * - Handles aria-describedby and keyboard accessibility.
 * - Supports positioning: top, right, bottom, left (default: top).
 * - Customizable delay for appearance.
 *
 * Props:
 * - content: string | ReactNode (the tooltip text/element)
 * - position: "top" | "right" | "bottom" | "left" (default: "top")
 * - delay: number (ms, optional, how long to wait before showing)
 * - className: string (extra class for tooltip)
 * - children: ReactNode (the element to trigger tooltip on)
 * - ...rest: other props for wrapper
 *
 * Usage:
 *   <Tooltip content="Go to settings">
 *     <button>⚙️</button>
 *   </Tooltip>
 */

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

  // Show with optional delay
  const show = () => {
    if (delay) {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  };
  // Hide
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // Clone the child to attach a11y/handlers (& aria-describedby)
  const child = React.Children.only(children);
  const triggerProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-describedby': visible ? tooltipId : undefined,
    tabIndex: child.props.tabIndex ?? 0, // Ensure it's focusable if not already
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