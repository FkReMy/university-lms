/**
 * CourseCard Component
 * ---------------------------------------------------------------------------
 * A production-ready, design-system-aligned card displaying a course summary.
 * - Uses only global layout/primitives (Card, Button, Progress, etc.)
 * - No demo/sample logic; all behavior is prop-driven and scalable.
 * - Unified styles and accessibility for all usage (dashboard, search, lists).
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
 * - actions?: ReactNode (for bottom-right unified action area; only global buttons/dropdowns)
 * - className?: string
 * - style?: object
 * - ...rest: (spread onto root <article>)
 */

import PropTypes from 'prop-types';

import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress'; // Should be your global/shared ProgressBar
import Button from '@/components/ui/button';         // Used only if passed into actions
import styles from './CourseCard.module.scss';

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

  // Unified card className (adds design system modifiers)
  const rootClass = [
    styles.courseCard,
    enrolled ? styles['courseCard--enrolled'] : "",
    className
  ].filter(Boolean).join(' ');

  // Enable keyboard/clickable only if handler provided
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

  // Truncate description to 120 chars for design
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
      {/* Cover image (optional/design-library component for future extensibility) */}
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

      {/* Content: always unified class/typography system */}
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

        {/* Global progress bar, only if enrolled and progress present */}
        {enrolled && typeof progress === "number" && (
          <div className={styles.courseCard__progressWrap}>
            <ProgressBar value={progress} max={100} label={`${progress}% complete`} />
          </div>
        )}
      </div>

      {/* Right-aligned actions (Buttons, Dropdowns, etc. from design system) */}
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
 * - No sample-specific or demo logic. All design and interactions are scalable/uniform.
 * - All action/cta/progress elements must use global, shared UI primitives/components.
 * - Accessible, visually unified, and fully backend-capable.
 * - Add/extend via design system as component library grows.
 */