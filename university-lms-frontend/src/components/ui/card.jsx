/**
 * Card Component
 * ----------------------------------------------------------------------------
 * Unified, reusable card container for LMS UI.
 * - Encapsulates all card style/layout via card.module.scss (global design system).
 * - Supports optional header, footer, and flexible body slots.
 * - No sample/demo logic; ready for scalable/production use in all UI patterns.
 *
 * Props:
 * - className?: string                 // Additional classes for the card wrapper
 * - style?: object                     // Inline style for card wrapper
 * - header?: ReactNode                 // Optional card header area
 * - footer?: ReactNode                 // Optional card footer area
 * - children?: ReactNode               // Main body content
 * - as?: element/String                // Polymorphic wrapper (default: div)
 * - ...rest: Other props (passed to root)
 */

import PropTypes from 'prop-types';

import styles from './card.module.scss';

export default function Card({
  className = '',
  style = {},
  header,
  footer,
  children,
  as: Component = 'div',
  ...rest
}) {
  const cardClass = [
    styles.card,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={cardClass} style={style} {...rest}>
      {/* Header slot */}
      {header && (
        <div className={styles.card__header}>
          {header}
        </div>
      )}

      {/* Body/content */}
      <div className={styles.card__body}>
        {children}
      </div>

      {/* Footer slot */}
      {footer && (
        <div className={styles.card__footer}>
          {footer}
        </div>
      )}
    </Component>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  as: PropTypes.elementType,
};

/**
 * Production/Architecture Notes:
 * - All layout, colors, radii, and slots governed by card.module.scss.
 * - Supports polymorphic rendering via `as` prop for accessibility and flexibility.
 * - Only global/unified patterns - no ad hoc markup or sample/demo code.
 */