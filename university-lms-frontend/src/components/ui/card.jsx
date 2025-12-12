/**
 * Card Component
 * ----------------------------------------------------------
 * A simple, reusable Card component for the LMS UI, using CSS modules for styling.
 *
 * Responsibilities:
 * - Provide a visually distinct container for content (e.g., in dashboards, lists, forms).
 * - Support optional header, footer, and body sections.
 * - Accept className and style props for customization.
 *
 * Props:
 * - className: string     - Additional custom classes for the card wrapper.
 * - style: object         - React style object for inline styles.
 * - header: ReactNode     - Card header content (optional).
 * - footer: ReactNode     - Card footer content (optional).
 * - children: ReactNode   - Card main/body content.
 * - ...rest:              - Other props passed to the root div.
 *
 * Usage:
 *  <Card header="Course Overview" footer={<ActionBtns />}>
 *    <div>Main content here…</div>
 *  </Card>
 */

import styles from './card.module.scss';

export default function Card({
  className = '',
  style = {},
  header,
  footer,
  children,
  ...rest
}) {
  // Combine base and any user-supplied classes
  const combinedClassName = [
    styles.card,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} style={style} {...rest}>
      {/* Optional header */}
      {header && (
        <div className={styles.card__header}>
          {header}
        </div>
      )}

      {/* Body/children */}
      <div className={styles.card__body}>
        {children}
      </div>

      {/* Optional footer */}
      {footer && (
        <div className={styles.card__footer}>
          {footer}
        </div>
      )}
    </div>
  );
}