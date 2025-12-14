/**
 * Breadcrumbs Component
 * ---------------------------------------------------------------------------
 * Global navigational breadcrumbs for LMS UI.
 * - Accepts a list of { label, href } or custom children for maximum flexibility.
 * - All visual/style/spacing is design-system driven in Breadcrumbs.module.scss.
 * - No sample or demo logic; all logic is production unified.
 * - Fully accessible (ARIA navigation, aria-current on current page).
 *
 * Props:
 * - items?: Array<{ label: string, href?: string }>
 * - separator?: ReactNode     // Optional, defaults to global chevron
 * - className?: string
 * - children?: ReactNode      // If provided, items ignored, supply <li> manually
 * - ...rest: extra props for <nav>
 */

import PropTypes from 'prop-types';

import styles from './Breadcrumbs.module.scss';

// Global chevron separator (SVG for clarity at all scales)
function Chevron() {
  return (
    <span className={styles.breadcrumbs__separator} aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export default function Breadcrumbs({
  items = [],
  separator,
  className = "",
  children,
  ...rest
}) {
  // Prefer children (for complete control, not sample/demo use)
  let content;
  if (children) {
    content = children;
  } else if (items && items.length > 0) {
    // All but last crumb: links. Last: span aria-current.
    content = items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return (
        <li
          className={styles.breadcrumbs__item}
          key={item.href || item.label || idx}
        >
          {item.href && !isLast ? (
            <a href={item.href} className={styles.breadcrumbs__link}>
              {item.label}
            </a>
          ) : (
            <span
              className={[
                styles.breadcrumbs__link,
                styles['breadcrumbs__link--current']
              ].join(' ')}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
          {!isLast && (separator ?? <Chevron />)}
        </li>
      );
    });
  } else {
    content = null;
  }

  return (
    <nav
      className={[styles.breadcrumbs, className].filter(Boolean).join(' ')}
      aria-label="Breadcrumb"
      {...rest}
    >
      <ol className={styles.breadcrumbs__list}>
        {content}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  separator: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Production Notes:
 * - All horizontal spacing, typography, and pointer styles are design-system driven.
 * - Current page/active is set with aria-current for accessibility.
 * - Separator fully flexible, defaults to chevron but can use any global icon/element.
 * - No sample/demo shortcuts; safe, maintainable, and always accessible.
 */