/**
 * NotificationCenter Component
 * ----------------------------------------------------------------------------
 * A production-ready, global notification center for the LMS.
 * - Lists all user notifications with a global style, mark all as read/clear controls.
 * - Only design-system layout/UX and global tokens (no inline/sample/demo logic).
 * - Handles "loading", "empty", and main notification states.
 *
 * Props:
 * - notifications: Array<{
 *     id: string|number,
 *     title: string,
 *     description?: string,
 *     time?: string,
 *     icon?: ReactNode,
 *     read?: boolean,
 *   }>
 * - loading?: boolean
 * - onClear?: function       // "Clear all" handler (optional)
 * - onMarkAllRead?: function // "Mark all as read" handler (optional)
 * - renderNotification?: fn(notification) => ReactNode (custom item renderer)
 * - emptyContent?: ReactNode // Custom empty-state
 * - className?: string
 * - style?: object
 * - ...rest: props for root <section>
 */

import PropTypes from 'prop-types';

import styles from './NotificationCenter.module.scss';

export default function NotificationCenter({
  notifications = [],
  loading = false,
  onClear,
  onMarkAllRead,
  renderNotification,
  emptyContent,
  className = "",
  style = {},
  ...rest
}) {
  // Unified design-system notification item component
  function DefaultItem({ n }) {
    return (
      <div
        className={[
          styles.notificationCenter__item,
          n.read ? styles['notificationCenter__item--read'] : ''
        ].filter(Boolean).join(' ')}
        role="listitem"
      >
        {n.icon && (
          <span className={styles.notificationCenter__itemIcon}>{n.icon}</span>
        )}
        <div className={styles.notificationCenter__itemText}>
          <strong className={styles.notificationCenter__itemTitle}>{n.title}</strong>
          {n.description && <div className={styles.notificationCenter__itemDescription}>{n.description}</div>}
          {n.time && <div className={styles.notificationCenter__itemTime}>{n.time}</div>}
        </div>
      </div>
    );
  }

  DefaultItem.propTypes = {
    n: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      time: PropTypes.string,
      icon: PropTypes.node,
      read: PropTypes.bool,
    }).isRequired,
  };

  return (
    <section
      className={[styles.notificationCenter, className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Notification Center"
      {...rest}
    >
      <header className={styles.notificationCenter__bar}>
        <span className={styles.notificationCenter__barTitle}>Notifications</span>
        <div className={styles.notificationCenter__barActions}>
          {onMarkAllRead && (
            <button
              className={styles.notificationCenter__barButton}
              type="button"
              onClick={onMarkAllRead}
            >
              Mark all as read
            </button>
          )}
          {onClear && (
            <button
              className={styles.notificationCenter__barButton}
              type="button"
              onClick={onClear}
            >
              Clear all
            </button>
          )}
        </div>
      </header>

      <div className={styles.notificationCenter__main}>
        {loading ? (
          <div className={styles.notificationCenter__loading}>
            <div className={styles.notificationCenter__spinner} aria-hidden="true" />
            Loading…
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.notificationCenter__empty}>
            {emptyContent || "No notifications."}
          </div>
        ) : (
          // Accessible notification list
          <div role="list">
            {notifications.map(n =>
              renderNotification
                ? renderNotification(n)
                : <DefaultItem key={n.id ?? n.title} n={n} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

NotificationCenter.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      time: PropTypes.string,
      icon: PropTypes.node,
      read: PropTypes.bool,
    })
  ),
  loading: PropTypes.bool,
  onClear: PropTypes.func,
  onMarkAllRead: PropTypes.func,
  renderNotification: PropTypes.func,
  emptyContent: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - No sample demo code, hardcoded mock data, or local style.
 * - All items, buttons, and structure are design-system compliant.
 * - May be extended for grouped/sorted notifications or advanced filtering.
 * - Handles empty/loading gracefully.
 */