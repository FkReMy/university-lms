/**
 * NotificationBell Component
 * ----------------------------------------------------------------------------
 * LMS production global notification bell.
 * - Global badge/button + drop-down notifications panel (keyboard accessible).
 * - Only global styles, tokens, and components; NO demo/sample logic.
 * - Badge shows count, drop-down as menu of notifications; slot for custom children.
 * - Extensible for global notification state/feature flags.
 *
 * Props:
 * - count?: number                  // Unread badge (shows only if > 0)
 * - notifications?: array           // [{ id, title, description, time, icon? }]
 * - renderNotification?: fn(n)      // Custom notification renderer (optional)
 * - children?: ReactNode            // If present, overrides notification list
 * - label?: string                  // ARIA-label/title (defaults "Notifications")
 * - className?: string
 * - bellIcon?: ReactNode
 * - ...rest: (button props)
 */
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './NotificationBell.module.scss';

// Default SVG bell icon
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

// Default notification item renderer (uses only design-system classes)
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

DefaultNotificationItem.propTypes = {
  n: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    time: PropTypes.string,
    icon: PropTypes.node,
  }).isRequired,
};

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

  // Handle click outside and Escape key to close the dropdown
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
    document.addEventListener('mousedown', handle, true);
    document.addEventListener('keydown', handle, true);
    return () => {
      document.removeEventListener('mousedown', handle, true);
      document.removeEventListener('keydown', handle, true);
    };
  }, [open]);

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

      {/* Dropdown notification list panel */}
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
            notifications.map(n =>
              renderNotification ? renderNotification(n) : (
                <DefaultNotificationItem
                  key={n.id ?? n.title}
                  n={n}
                />
              )
            )
          )}
        </div>
      )}
    </div>
  );
}

NotificationBell.propTypes = {
  count: PropTypes.number,
  notifications: PropTypes.array,
  renderNotification: PropTypes.func,
  children: PropTypes.node,
  label: PropTypes.string,
  className: PropTypes.string,
  bellIcon: PropTypes.node,
};

/**
 * Production/Architecture Notes:
 * - Only global styles and classes applied: theme via NotificationBell.module.scss
 * - All notification panel and items must use design-system slots.
 * - Panel is keyboard accessible and escape/click closes reliably.
 * - Badge only shown if count > 0; max "99+" for visual clarity.
 * - No inline demo, sample, or ad hoc logic.
 */