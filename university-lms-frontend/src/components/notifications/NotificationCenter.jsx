/**
 * NotificationCenter Component
 * ----------------------------------------------------------
 * A panel listing all notifications, often used as a page or slide-out sheet.
 *
 * Responsibilities:
 * - Renders a list of notifications, grouped or flat.
 * - Shows status (empty, loading).
 * - Mark all as read, or remove/clear notifications.
 *
 * Props:
 * - notifications: array of notification objects
 *     notification: { id, title, description, time, icon?, read? }
 * - loading: boolean (optional, show loading spinner)
 * - onClear: function (optional, called to clear all notifications)
 * - onMarkAllRead: function (optional, called to mark all as read)
 * - renderNotification: fn(notification) => ReactNode (optional custom rendering)
 * - emptyContent: ReactNode (optional, override for empty state)
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (applied to <section>)
 *
 * Usage:
 *   <NotificationCenter
 *     notifications={[ ... ]}
 *     loading={false}
 *     onMarkAllRead={() => {}}
 *     onClear={() => {}}
 *   />
 */

import React from 'react';
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
  // Default notification item rendering
  function DefaultItem({ n }) {
    return (
      <div
        className={[
          styles.notificationCenter__item,
          n.read ? styles['notificationCenter__item--read'] : ''
        ].filter(Boolean).join(' ')}
        tabIndex={0}
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
            <div className={styles.notificationCenter__spinner} aria-hidden="true"></div>
            Loading…
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.notificationCenter__empty}>
            {emptyContent || "No notifications."}
          </div>
        ) : (
          notifications.map(n =>
            renderNotification
              ? renderNotification(n)
              : <DefaultItem key={n.id ?? n.title} n={n} />
          )
        )}
      </div>
    </section>
  );
}