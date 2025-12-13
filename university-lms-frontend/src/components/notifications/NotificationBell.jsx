/**
 * NotificationBell Component
 * ----------------------------------------------------------
 * A bell icon/button that shows a notification count and opens a dropdown panel of notifications.
 *
 * Responsibilities:
 * - Shows a notification bell (with badge for unread count).
 * - Opens/closes notifications panel on click.
 * - Handles keyboard accessibility (Esc closes, focus trap, etc).
 * - Renders a list of notification items (supplied as prop or children).
 *
 * Props:
 * - count: number (optional, for unread badge)
 * - notifications: array (optional, list of notification objects)
 *      notification: { id, title, description, time, icon? }
 * - renderNotification: fn(notification) => ReactNode (optional, custom render)
 * - children: ReactNode (optional, to override default dropdown panel)
 * - label: string (optional, aria-label/title, default: "Notifications")
 * - className: string (optional, for root)
 * - bellIcon: ReactNode (optional, use custom icon)
 * - ...rest: (other button props)
 *
 * Usage:
 *   <NotificationBell
 *     count={3}
 *     notifications={[
 *       { id: 1, title: "Assignment graded", description: "Your quiz was graded.", time: "2h ago" }
 *     ]}
 *   />
 */

import { useState, useRef, useEffect } from 'react';

import styles from './NotificationBell.module.scss';

// Default bell SVG icon
function BellIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M8.25 20.5v.08a4 4 0 007.99 0V20.5m-8.3-1.72a5.75 5.75 0 01-2.19-4.53V11.5
        c0-3.29 2.44-5.89 5.5-6.33V4a1.75 1.75 0 013.5 0v1.17c3.06.44 5.5 3.04 5.5 6.33v2.75c0 1.81-.86 3.49-2.19 4.53
        -.77.6-.47 1.94.5 1.94H7.45c.97 0 1.27-1.34.5-1.94z"
        stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Default notification item renderer
function DefaultNotificationItem({ n }) {
  return (
    <div className={styles.notificationBell__item}>
      {n.icon && (
        <span className={styles.notificationBell__itemIcon}>{n.icon}</span>
      )}
      <div className={styles.notificationBell__itemText}>
        <strong className={styles.notificationBell__itemTitle}>{n.title}</strong>
        {n.description && <div className={styles.notificationBell__itemDescription}>{n.description}</div>}
        {n.time && <div className={styles.notificationBell__itemTime}>{n.time}</div>}
      </div>
    </div>
  );
}

export default function NotificationBell({
  count,
  notifications = [],
  renderNotification,
  children,
  label = "Notifications",
  className = "",
  bellIcon,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  // Handle click outside or Escape to close
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current && btnRef.current.focus();
      }
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handle);
    };
  }, [open]);

  // Button class handling
  const rootClass = [styles.notificationBell, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <button
        className={styles.notificationBell__button}
        type="button"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={open}
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        {...rest}
      >
        <span className={styles.notificationBell__icon}>
          {bellIcon || <BellIcon />}
        </span>
        {count > 0 && (
          <span className={styles.notificationBell__badge} aria-label={`${count} unread`}>
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Dropdown notifications panel */}
      {open && (
        <div
          className={styles.notificationBell__panel}
          role="menu"
          aria-label="Notifications"
          tabIndex={-1}
          ref={panelRef}
        >
          {children ? (
            children
          ) : notifications.length === 0 ? (
            <div className={styles.notificationBell__empty}>
              No new notifications.
            </div>
          ) : (
            notifications.map(n => (
              <DefaultNotificationItem
                key={n.id ?? n.title}
                n={n}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}