/**
 * CourseCard Component
 * ----------------------------------------------------------
 * Displays a single course as a card in a grid/list.
 *
 * Responsibilities:
 * - Shows course title, instructor, description, optional cover image.
 * - Optionally displays enrollment status, progress, or actions.
 * - Clickable: navigates to course page or calls an onClick handler.
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
 * - onClick: function(course) (optional)
 * - actions: ReactNode (optional, rendered bottom-right)
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (for root <article>)
 *
 * Usage:
 *   <CourseCard
 *     course={course}
 *     onClick={() => navigate(`/courses/${course.id}`)}
 *     actions={<Button>Continue</Button>}
 *   />
 */

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
    progress
  } = course;

  // Compose classes
  const rootClass = [
    styles.courseCard,
    enrolled ? styles['courseCard--enrolled'] : "",
    className
  ].filter(Boolean).join(' ');

  // Card is "clickable" if onClick is provided
  const clickableProps = onClick
    ? {
        tabIndex: 0,
        role: "button",
        onClick: (e) => { e.stopPropagation(); onClick(course); },
        onKeyDown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(course); } }
      }
    : {};

  return (
    <article
      className={rootClass}
      style={style}
      aria-label={title}
      {...clickableProps}
      {...rest}
    >
      {/* Cover image */}
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

      {/* Content */}
      <div className={styles.courseCard__content}>
        <h3 className={styles.courseCard__title} title={title}>{title}</h3>
        {instructor && (
          <div className={styles.courseCard__instructor}>
            {instructor}
          </div>
        )}
        {description && (
          <div className={styles.courseCard__description}>
            {description.length > 120
              ? description.slice(0, 120) + '…'
              : description}
          </div>
        )}

        {/* Progress bar if enrolled and progress is defined */}
        {enrolled && typeof progress === "number" && (
          <div className={styles.courseCard__progressWrap}>
            <div className={styles.courseCard__progressBar}>
              <div
                className={styles.courseCard__progress}
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>
            <span className={styles.courseCard__progressLabel}>
              {progress}% complete
            </span>
          </div>
        )}
      </div>

      {/* Actions area */}
      {actions && (
        <div className={styles.courseCard__actions}>
          {actions}
        </div>
      )}
    </article>
  );
}