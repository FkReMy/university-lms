/**
 * PageHeader Component
 * ----------------------------------------------------------
 * Consistent section/page header bar for LMS UI.
 *
 * Responsibilities:
 * - Shows page or section title with optional subtitle, icon, and action area.
 * - Can render right-side actions (buttons, menus, etc).
 * - Flexible for cards, modal headers, or major page titles.
 *
 * Props:
 * - title: string | ReactNode (required)     - Main headline/title.
 * - subtitle: string | ReactNode (optional)  - Smaller text under headline.
 * - icon: ReactNode (optional)               - Icon or illustration left of headline.
 * - actions: ReactNode (optional)            - Right-aligned actions (buttons, menus, etc).
 * - children: ReactNode (optional)           - Insert extra content below (e.g., filter bar).
 * - className: string (optional)             - Extra wrapper class.
 * - style: object (optional)                 - Inline CSS.
 * - ...rest: any other props for <header>.
 *
 * Usage:
 *   <PageHeader
 *     title="Assignments"
 *     subtitle="All for this semester"
 *     icon={<BookIcon />}
 *     actions={<Button>Add</Button>}
 *   />
 */

import styles from './PageHeader.module.scss';

export default function PageHeader({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <header
      className={[styles.pageHeader, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      <div className={styles.pageHeader__main}>
        {icon && (
          <div className={styles.pageHeader__icon} aria-hidden="true">
            {icon}
          </div>
        )}
        <div>
          <h1 className={styles.pageHeader__title}>{title}</h1>
          {subtitle && (
            <div className={styles.pageHeader__subtitle}>{subtitle}</div>
          )}
        </div>
      </div>
      {actions && (
        <div className={styles.pageHeader__actions}>
          {actions}
        </div>
      )}
      {children && (
        <div className={styles.pageHeader__extra}>
          {children}
        </div>
      )}
    </header>
  );
}