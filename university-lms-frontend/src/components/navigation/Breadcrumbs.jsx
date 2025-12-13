/**
 * Breadcrumbs Component
 * ----------------------------------------------------------
 * Navigation aid displaying the user's path as a list of links.
 *
 * Responsibilities:
 * - Renders a horizontally-arranged breadcrumb navigation.
 * - Each crumb except the last is a link. The last is current/active.
 * - Accepts an array of { label, href } OR children for full custom use.
 * - Accessible (ARIA nav, aria-current).
 *
 * Props:
 * - items: Array<{ label: string, href?: string }>
 * - separator: ReactNode (optional, defaults to chevron)
 * - className: string (optional wrapper class)
 * - children: ReactNode (optional, alternate: supply <li> manually)
 * - ...rest:       (extra props for <nav>)
 *
 * Usage:
 *   <Breadcrumbs
 *     items={[
 *       { label: "Dashboard", href: "/" },
 *       { label: "Courses", href: "/courses" },
 *       { label: "Math 101" }
 *     ]}
 *   />
 */

import styles from './Breadcrumbs.module.scss';

// Default chevron separator (SVG for sharp screens)
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
  // Use either `items` array or `children`
  let content;
  if (children) {
    // If custom children provided (control everything)
    content = children;
  } else if (items && items.length > 0) {
    // Array, render all but last crumb as links
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
          {/* Add separator unless last crumb */}
          {!isLast && (separator ?? <Chevron />)}
        </li>
      );
    });
  } else {
    // Nothing to render
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