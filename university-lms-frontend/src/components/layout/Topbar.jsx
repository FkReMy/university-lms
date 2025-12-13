/**
 * Topbar Component
 * ----------------------------------------------------------
 * The top navigation/header bar for the LMS UI.
 *
 * Responsibilities:
 * - Provides branded area and place for global navigation/actions.
 * - Handles user/account menu, notifications, and quick actions.
 * - Responsive, styled with CSS modules.
 *
 * Props:
 * - brand: ReactNode (logo/branding, optional)
 * - actions: ReactNode (optional, right-side actions: e.g., notifications, buttons)
 * - children: ReactNode (main area, e.g. search, nav links, center)
 * - className: string (optional extra classes)
 * - style: object (optional inline styles)
 * - ...rest:    (other props for <header>)
 *
 * Usage:
 *   <Topbar brand={<Logo />} actions={<UserMenu />} />
 */

import styles from './Topbar.module.scss';

export default function Topbar({
  brand,
  actions,
  children,
  className = '',
  style = {},
  ...rest
}) {
  const rootClass = [styles.topbar, className].filter(Boolean).join(' ');

  return (
    <header className={rootClass} style={style} {...rest}>
      {brand && (
        <div className={styles.topbar__brand}>
          {brand}
        </div>
      )}
      <div className={styles.topbar__center}>
        {children}
      </div>
      {actions && (
        <div className={styles.topbar__actions}>
          {actions}
        </div>
      )}
    </header>
  );
}