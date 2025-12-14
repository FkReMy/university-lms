/**
 * Topbar Component
 * ----------------------------------------------------------------------------
 * Global top navigation/header bar for the LMS UI.
 * - All visual style and positioning governed by Topbar.module.scss (part of the design system).
 * - Brand, actions, and center content are all globally injected slots for 100% consistency.
 * - No demo, sample, or ad hoc markup; ready for backend and strict global use.
 *
 * Props:
 * - brand?: ReactNode                // Left: logo or branding component.
 * - actions?: ReactNode              // Right: global actions (notifications, usermenu, theme switch).
 * - children?: ReactNode             // Center: nav, search, or workflow components.
 * - className?: string
 * - style?: object
 * - ...rest: props passed to the root <header>
 */

import PropTypes from 'prop-types';
import styles from './Topbar.module.scss';

export default function Topbar({
  brand,
  actions,
  children,
  className = '',
  style = {},
  ...rest
}) {
  // Compose global class name(s)
  const rootClass = [styles.topbar, className].filter(Boolean).join(' ');

  return (
    <header className={rootClass} style={style} {...rest}>
      {/* Brand/Logo area (design system branding only) */}
      {brand && (
        <div className={styles.topbar__brand}>
          {brand}
        </div>
      )}
      {/* Center area: main nav, search, or workflow-specific content */}
      <div className={styles.topbar__center}>
        {children}
      </div>
      {/* Actions: right-side user menu, notifications, quick toggles etc */}
      {actions && (
        <div className={styles.topbar__actions}>
          {actions}
        </div>
      )}
    </header>
  );
}

Topbar.propTypes = {
  brand: PropTypes.node,
  actions: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - All branding and actions must use only global/shared (design system) components.
 * - Unifies the top-level header UX for every page and layout state.
 * - All slots and styling are 100% scalable for enterprise/team usage.
 */