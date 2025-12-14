/**
 * QuestionNavigator Component
 * ---------------------------------------------------------------------------
 * Unified quiz question navigation UI.
 * - Provides navigation dots or numbers for all questions in a quiz.
 * - Accessible, themeable, no sample/demo logic.
 * - Shows active, answered, and disables prev/next when appropriate.
 *
 * Props:
 * - total: number (REQUIRED)               // Total question count
 * - current: number (REQUIRED, 0-based)    // Current active question index
 * - answered?: boolean[]                   // Marks questions as answered (optional)
 * - onNavigate: function(targetIdx)        // Callback on navigation (REQUIRED)
 * - showPrevNext?: bool (default true)     // Show Previous/Next controls
 * - className?: string
 * - style?: object
 * - ...rest: props spread to root <nav>
 */

import PropTypes from 'prop-types';

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

  // Renders each tab/button for a question index
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

  // Previous/Next button enable/disable check
  const canPrev = current > 0;
  const canNext = current < total - 1;

  return (
    <nav
      className={[styles.questionNavigator, className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Question navigation"
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

// Strict prop types for production contracts
QuestionNavigator.propTypes = {
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  answered: PropTypes.arrayOf(PropTypes.bool),
  onNavigate: PropTypes.func.isRequired,
  showPrevNext: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - No demo/sample logic—all UI & ARIA are unified and scalable.
 * - Design system dictates all color/theme/highlight via QuestionNavigator.module.scss.
 * - Fully accessible—labels, aria-current, and disables for navigation arrows.
 * - Modular: works for quizzes of any length or display style.
 */