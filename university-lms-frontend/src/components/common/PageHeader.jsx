/**
 * PageHeader Component
 * ------------------------------------------------------------------------
 * A production-grade, unified header bar for pages and major sections.
 * - Uses only global design-system styles/components (never local/inline logic).
 * - Allows configurable headlines, subtitles, icons, and right-aligned actions.
 * - Flexible for main app pages, modals, cards, or dashboards.
 * - Accessible, clean, and team-scalable.
 *
 * Props:
 * - title: string | ReactNode (required)     - Main headline/title.
 * - subtitle: string | ReactNode (optional)  - Smaller text under headline.
 * - icon: ReactNode (optional)               - Icon/illustration (brand/global icons).
 * - actions: ReactNode (optional)            - Right-aligned actions (unified Buttons, Dropdowns, etc.).
 * - children: ReactNode (optional)           - Extra content below (filters, stats, controls).
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest: Spread to root <header> element.
 */

import PropTypes from 'prop-types';

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

PageHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  actions: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 *  - All button, icon, and dropdown components passed here must be the global/unified UI system (never ad hoc).
 *  - Accessible, semantic, and themable via PageHeader.module.scss.
 *  - Never contains sample, local, or demo logic.
 *  - Allows stateless flexible injection of extra controls/content by wrapping in children.
 */