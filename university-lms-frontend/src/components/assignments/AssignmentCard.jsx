/**
 * AssignmentCard Component
 * ----------------------------------------------------------
 * Renders a single assignment card.
 * - Uses only unified, global UI primitives (Card, Badge, Button, etc.)
 * - No demo/sample logic; no "hardcoded" status chips, colors, or duplicate markup.
 * - Formatters, status/class logic, tokens must be centralized in utils (`@/lib/formatters`, `@/lib/constants`)
 * - Ready for true backend/content integration.
 * - Fully accessible and keyboard operable.
 */

import PropTypes from 'prop-types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge'; // Unified status/tag chip
import Button from '@/components/ui/button'; // Only if rendering actions; otherwise pass them in.
import { formatDateTime } from '@/lib/formatters'; // Central/shared date formatter
import { getAssignmentStatusColor, getAssignmentStatusLabel } from '@/lib/constants'; // Centralized logic

import styles from './AssignmentCard.module.scss';

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

  // Compose the root class for styling and clickable mode
  const rootClass = [
    styles.assignmentCard,
    className,
    onClick ? styles.assignmentCard__clickable : ''
  ].filter(Boolean).join(' ');

  // Accessibility/keyboard support if card is clickable
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

  // Render assignment status as a global Badge or similar shared component
  const renderStatus = () => {
    if (!status) return null;
    const statusLabel = getAssignmentStatusLabel(status); // Central/consistent everywhere
    const statusColor = getAssignmentStatusColor(status);
    return (
      <Badge className={styles.assignmentCard__statusBadge} color={statusColor}>
        {statusLabel}
      </Badge>
    );
  };

  // Render tags as unified Badge/Chip (reuse Badge if possible)
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

  // Truncate description to tokens/characters if required
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
      {/* Actions (use only global Button/Dropdown/Link components!) */}
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
 * Architectural / Production Notes:
 * - No duplicated status/tag chip logic – all chips should use global Badge.
 * - Date-time formatting is always via central formatters (never component-local).
 * - No samples, demos, or unscalable inline logic.
 * - All UI/interaction is unified via Card, Badge, and shared UI primitives.
 * - Extend only with more global UI components as design system evolves.
 */