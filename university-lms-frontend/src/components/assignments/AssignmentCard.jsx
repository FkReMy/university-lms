/**
 * AssignmentCard Component
 * ----------------------------------------------------------
 * Displays a single assignment as a card in a list or dashboard.
 *
 * Responsibilities:
 * - Shows assignment title, due date, short description, status, and optionally grade/progress.
 * - Optionally displays status/tag chips (e.g., "Submitted", "Late", "Graded").
 * - Includes action area (buttons, etc.).
 * - Clickable: goes to assignment page or triggers a handler.
 *
 * Props:
 * - assignment: {
 *     id: string|number,
 *     title: string,
 *     dueDate?: string|Date,
 *     description?: string,
 *     status?: string,      // "submitted" | "late" | "pending" | "graded" | ...
 *     grade?: string|number,
 *     maxGrade?: string|number,
 *     progress?: number,    // For drafts, optional
 *     tags?: string[],
 *   }
 * - onClick: fn(assignment) (optional) - Handler for clicking the card.
 * - actions: ReactNode (optional)      - Shown at the right/bottom.
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (spread on root <article>)
 *
 * Usage:
 *   <AssignmentCard
 *     assignment={assignment}
 *     onClick={() => navigate(`/assignments/${assignment.id}`)}
 *     actions={<Button>Submit</Button>}
 *   />
 */

import styles from './AssignmentCard.module.scss';

// Format date in "Mar 7, 2025 11:59 PM" style
function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear(),
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Return a status/style class for assignment status
function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "submitted":
      return styles["assignmentCard__status--submitted"];
    case "late":
      return styles["assignmentCard__status--late"];
    case "graded":
      return styles["assignmentCard__status--graded"];
    case "pending":
      return styles["assignmentCard__status--pending"];
    default:
      return "";
  }
}

export default function AssignmentCard({
  assignment,
  onClick,
  actions,
  className = "",
  style = {},
  ...rest
}) {
  if (!assignment) return null;
  const {
    title,
    dueDate,
    description,
    status,
    grade,
    maxGrade,
    progress,
    tags = [],
  } = assignment;

  const rootClass = [
    styles.assignmentCard,
    status ? getStatusClass(status) : "",
    className,
  ].filter(Boolean).join(' ');

  // Status/tag chip
  const renderStatusChip = () => {
    if (!status) return null;
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <div className={styles.assignmentCard__statusChip}>
        {label}
      </div>
    );
  };

  // Chips for tags (if present, e.g., "Essay", "Group work")
  const renderTags = () => (
    tags && tags.length > 0 && (
      <div className={styles.assignmentCard__tags}>
        {tags.map((tag) => (
          <span className={styles.assignmentCard__tagChip} key={tag}>
            {tag}
          </span>
        ))}
      </div>
    )
  );

  // Card is clickable if onClick
  const clickableProps = onClick
    ? {
        tabIndex: 0,
        role: "button",
        onClick: (e) => { e.stopPropagation(); onClick(assignment); },
        onKeyDown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(assignment); } }
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
      <div className={styles.assignmentCard__header}>
        <h4 className={styles.assignmentCard__title} title={title}>{title}</h4>
        {renderStatusChip()}
      </div>
      <div className={styles.assignmentCard__meta}>
        {dueDate && (
          <span className={styles.assignmentCard__dueDate}>
            Due: {formatDate(dueDate)}
          </span>
        )}
        {renderTags()}
      </div>
      {description && (
        <div className={styles.assignmentCard__description}>
          {description.length > 130 ? description.slice(0, 130) + "…" : description}
        </div>
      )}
      {/* Grade/progress area */}
      {(grade != null || progress != null) && (
        <div className={styles.assignmentCard__gradeRow}>
          {grade != null && (
            <span className={styles.assignmentCard__grade}>
              Grade: <strong>{grade}</strong>
              {maxGrade ? ` / ${maxGrade}` : ""}
            </span>
          )}
          {progress != null && (
            <span className={styles.assignmentCard__progress}>
              Progress: {progress}%
              <span className={styles.assignmentCard__progressBarWrap}>
                <span
                  className={styles.assignmentCard__progressBar}
                  style={{ width: `${progress}%` }}
                />
              </span>
            </span>
          )}
        </div>
      )}
      {/* Actions */}
      {actions && (
        <div className={styles.assignmentCard__actions}>
          {actions}
        </div>
      )}
    </article>
  );
}