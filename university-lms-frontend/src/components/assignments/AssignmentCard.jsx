/**
 * AssignmentCard Component (Production)
 * ----------------------------------------------------------------------------
 * Renders a single assignment card using only global LMS UI primitives.
 * - Fully unified UI: Card, Badge, Button (for actions), etc.
 * - All status, tags, class, tokens use centralized utils/constants.
 * - Accessible and keyboard operable.
 * - NO demo, logic duplication, or hardcoded styling.
 * - Ready for backend/content integration.
 */

import PropTypes from 'prop-types';

import styles from './AssignmentCard.module.scss';

import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { getAssignmentStatusColor, getAssignmentStatusLabel } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';

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

  // Compose class for styling and clickable mode
  const rootClass = [
    styles.assignmentCard,
    className,
    onClick ? styles.assignmentCard__clickable : ''
  ].filter(Boolean).join(' ');

  // Keyboard and ARIA support for clickable cards
  const clickableProps = onClick
    ? {
        tabIndex: 0,
        role: "button",
        onClick: (e) => { e.stopPropagation(); onClick(assignment); },
        onKeyDown: e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(assignment);
          }
        }
      }
    : {};

  // Status display using global Badge and central helpers
  const renderStatus = () => {
    if (!status) return null;
    const statusLabel = getAssignmentStatusLabel(status);
    const statusColor = getAssignmentStatusColor(status);
    return (
      <Badge className={styles.assignmentCard__statusBadge} color={statusColor}>
        {statusLabel}
      </Badge>
    );
  };

  // Tags as unified Badges
  const renderTags = () =>
    tags && tags.length > 0 ? (
      <div className={styles.assignmentCard__tags}>
        {tags.map(tag => (
          <Badge
            key={tag}
            className={styles.assignmentCard__tagBadge}
            color="secondary"
            variant="outline"
            size="sm"
          >
            {tag}
          </Badge>
        ))}
      </div>
    ) : null;

  // Description truncation (optional, as per product design)
  const displayDescription =
    description && description.length > 130
      ? description.slice(0, 130) + '…'
      : description;

  return (
    <Card
      as="article"
      className={rootClass}
      style={style}
      aria-label={title}
      {...clickableProps}
      {...rest}
    >
      <div className={styles.assignmentCard__header}>
        <h4 className={styles.assignmentCard__title} title={title}>{title}</h4>
        {renderStatus()}
      </div>
      <div className={styles.assignmentCard__meta}>
        {dueDate && (
          <span className={styles.assignmentCard__dueDate}>
            Due: {formatDateTime(dueDate)}
          </span>
        )}
        {renderTags()}
      </div>
      {description && (
        <div className={styles.assignmentCard__description}>
          {displayDescription}
        </div>
      )}
      {/* Grade / progress row */}
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
      {/* Actions area: always use global primitives as children */}
      {actions && (
        <div className={styles.assignmentCard__actions}>
          {actions}
        </div>
      )}
    </Card>
  );
}

AssignmentCard.propTypes = {
  assignment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
    status: PropTypes.string,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxGrade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    progress: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClick: PropTypes.func,
  actions: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production Notes:
 * - All tokens, color, status, label logic comes from shared helpers/constants.
 * - Only imports global design system components (no local/demos).
 * - Truncation and grade/progress display is scalable for large/long content.
 * - Extensible with more DS components as the system evolves.
 */