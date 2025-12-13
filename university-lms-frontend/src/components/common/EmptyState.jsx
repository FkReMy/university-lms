/**
 * EmptyState Component
 * ----------------------------------------------------------
 * A reusable empty state UI for cases where there is no data to display.
 *
 * Responsibilities:
 * - Shows an illustration, label, and optional description/cta when a page or section is empty.
 * - Provides a consistently branded, cheerful fallback UI.
 *
 * Props:
 * - icon: ReactNode (optional)        - Illustration or icon to show.
 * - label: string (required)          - Main message/title.
 * - description: ReactNode (optional) - Subtext or instructions.
 * - action: ReactNode (optional)      - Button or link for call to action.
 * - className: string (optional)      - Extra wrapper class.
 * - style: object (optional)          - Inline style.
 * - ...rest: (other props for <section>)
 *
 * Usage:
 *   <EmptyState
 *     icon={<ArchiveIcon />}
 *     label="No assignments yet"
 *     description="You haven't been assigned any tasks for this course."
 *     action={<button>Add Task</button>}
 *   />
 */

import styles from './EmptyState.module.scss';

export default function EmptyState({
  icon,
  label,
  description,
  action,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <section
      className={[styles.emptyState, className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Empty state"
      {...rest}
    >
      {icon && (
        <div className={styles.emptyState__icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <div className={styles.emptyState__main}>
        <h2 className={styles.emptyState__label}>{label}</h2>
        {description && (
          <div className={styles.emptyState__description}>
            {description}
          </div>
        )}
        {action && (
          <div className={styles.emptyState__action}>
            {action}
          </div>
        )}
      </div>
    </section>
  );
}