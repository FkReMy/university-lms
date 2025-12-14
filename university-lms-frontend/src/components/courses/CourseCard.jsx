/**
 * CourseCard Component (Production)
 * ----------------------------------------------------------------------------
 * Production-ready course summary card, accessible and design-system-aligned.
 * - Uses only global UI primitives (Card, ProgressBar, actions via slots).
 * - All content/behavior is prop-driven; absolutely no sample/demo logic.
 * - Keyboard operable if clickable (for cards that link/navigate).
 * - Ready for backend integration and scalable usage everywhere.
 *
 * Props:
 * - course: {
 *     id: string | number,
 *     title: string,
 *     instructor?: string,
 *     description?: string,
 *     imageUrl?: string,
 *     enrolled?: boolean,
 *     progress?: number (0-100)
 *   }
 * - onClick?: function(course)
 * - actions?: ReactNode
 * - className?: string
 * - style?: object
 * - ...rest: spreads to root <article>
 */

import PropTypes from 'prop-types';

import styles from './CourseCard.module.scss';

import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress'; // Unified global progress bar

export default function CourseCard({
  course,
  onClick,
  actions,
  className = "",
  style = {},
  ...rest
}) {
  if (!course) return null;

  const {
    title,
    instructor,
    description,
    imageUrl,
    enrolled,
    progress,
  } = course;

  // Unified card className for design system modifiers
  const rootClass = [
    styles.courseCard,
    enrolled ? styles['courseCard--enrolled'] : "",
    className
  ].filter(Boolean).join(' ');

  // Keyboard/ARIA support for clickable cards
  const clickableProps = onClick
    ? {
        tabIndex: 0,
        role: "button",
        onClick: (e) => { e.stopPropagation(); onClick(course); },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(course);
          }
        }
      }
    : {};

  // Truncate description for card layout
  const displayDescription = description
    ? (description.length > 120
      ? description.slice(0, 120) + '…'
      : description)
    : null;

  return (
    <Card
      as="article"
      className={rootClass}
      style={style}
      aria-label={title}
      {...clickableProps}
      {...rest}
    >
      {/* Optional cover image */}
      {imageUrl && (
        <div className={styles.courseCard__imageWrapper}>
          <img
            src={imageUrl}
            alt={title}
            className={styles.courseCard__image}
            loading="lazy"
          />
        </div>
      )}

      {/* Text grid */}
      <div className={styles.courseCard__content}>
        <h3 className={styles.courseCard__title} title={title}>{title}</h3>
        {instructor && (
          <div className={styles.courseCard__instructor}>
            {instructor}
          </div>
        )}
        {displayDescription && (
          <div className={styles.courseCard__description}>
            {displayDescription}
          </div>
        )}
        {enrolled && typeof progress === "number" && (
          <div className={styles.courseCard__progressWrap}>
            <ProgressBar value={progress} max={100} label={`${progress}% complete`} />
          </div>
        )}
      </div>

      {/* Unified right-aligned actions slot */}
      {actions && (
        <div className={styles.courseCard__actions}>{actions}</div>
      )}
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    instructor: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    enrolled: PropTypes.bool,
    progress: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
  actions: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - No demo or placeholder values, all props expected from backend.
 * - All controls/actions via global design system Button/Dropdown as passed-in actions.
 * - No duplicate HTML or per-card logic; always visually unified.
 * - Absolutely accessible and scalable for large-page and dashboard usage.
 */