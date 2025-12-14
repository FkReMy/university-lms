/**
 * EmptyState Component
 * ----------------------------------------------------------
 * A production-grade, global empty-state UI for the LMS.
 *
 * Responsibilities:
 * - Render a clean, branded empty state across all pages and sections.
 * - Accepts unified icon, label, description, and global action/button as props.
 * - Accessible, stylable, and never demo/sample code.
 *
 * Props:
 * - icon: ReactNode (optional)        - Illustration/icon, use global iconography (not local SVGs).
 * - label: string (required)          - Main headline/message.
 * - description: ReactNode (optional) - Further instructions or context.
 * - action: ReactNode (optional)      - Use only global components for CTA (Button, Link, etc.).
 * - className: string (optional)      - For BEM/SCSS/utility class customization.
 * - style: object (optional)
 * - ...rest: Spread to root <section>.
 */

import PropTypes from 'prop-types';

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
        {/* Label/headline */}
        <h2 className={styles.emptyState__label}>{label}</h2>
        {/* Optional description or subtext */}
        {description && (
          <div className={styles.emptyState__description}>
            {description}
          </div>
        )}
        {/* Optional action (global Button/Link/Dropdown only) */}
        {action && (
          <div className={styles.emptyState__action}>
            {action}
          </div>
        )}
      </div>
    </section>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Architectural/UX Notes:
 * - Use across all pages/sections for consistent branding and empty-data fallback.
 * - Always use global design-system components for icon and action/CTA.
 * - No sample or local/duplicate markup—centralized for all teams/features.
 * - ARIA and semantic heading markup improve accessibility.
 * - Extensible for theme, dark mode, or different illustration packs.
 */