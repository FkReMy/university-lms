/**
 * QuestionNavigator Component
 * ----------------------------------------------------------
 * Provides navigation controls for quiz question pages.
 *
 * Responsibilities:
 * - Renders numbered buttons or dots for each question.
 * - Allows navigation to previous/next or directly jump to a question.
 * - Shows progress/completion (e.g., which answered), disables/hides buttons as needed.
 *
 * Props:
 * - total: number (required)            - Total number of questions.
 * - current: number (required, 0-based) - Current active question index.
 * - answered: array of bool (length: total) (optional)  - True for answered.
 * - onNavigate: fn(targetIndex) (required)              - Handler for jumps.
 * - showPrevNext: bool (default true)   - Show Prev/Next controls.
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (props for <nav>)
 *
 * Usage:
 *   <QuestionNavigator
 *     total={10}
 *     current={2}
 *     answered={[true, false, ...]}
 *     onNavigate={setIdx}
 *   />
 */

import styles from './QuestionNavigator.module.scss';

export default function QuestionNavigator({
  total,
  current,
  answered = [],
  onNavigate,
  showPrevNext = true,
  className = "",
  style = {},
  ...rest
}) {
  if (!total || total <= 1) return null;

  // Helper: label/button for each question
  const renderTab = (idx) => (
    <button
      type="button"
      key={idx}
      className={[
        styles.questionNavigator__tab,
        idx === current ? styles["questionNavigator__tab--active"] : "",
        answered[idx] ? styles["questionNavigator__tab--answered"] : "",
      ].filter(Boolean).join(' ')}
      aria-current={idx === current ? "step" : undefined}
      aria-label={
        `Go to question ${idx + 1}` +
        (answered[idx] ? " (answered)" : "") +
        (idx === current ? " (current)" : "")
      }
      onClick={() => idx !== current && onNavigate(idx)}
      tabIndex={0}
    >
      {idx + 1}
    </button>
  );

  // Prev/next controls
  const canPrev = current > 0;
  const canNext = current < total - 1;

  return (
    <nav
      className={[styles.questionNavigator, className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Questions navigation"
      {...rest}
    >
      {showPrevNext && (
        <button
          type="button"
          className={styles.questionNavigator__arrow}
          disabled={!canPrev}
          aria-label="Previous question"
          onClick={() => canPrev && onNavigate(current - 1)}
        >
          ‹
        </button>
      )}
      <div className={styles.questionNavigator__list} role="list">
        {Array.from({ length: total }, (_, i) => renderTab(i))}
      </div>
      {showPrevNext && (
        <button
          type="button"
          className={styles.questionNavigator__arrow}
          disabled={!canNext}
          aria-label="Next question"
          onClick={() => canNext && onNavigate(current + 1)}
        >
          ›
        </button>
      )}
    </nav>
  );
}