/**
 * QuestionRenderer Component
 * ----------------------------------------------------------------------------
 * Standardized, extensible quiz question renderer for LMS.
 * - Handles all main question types (MCQ, True/False, Short, Essay).
 * - Manages all selection/input/answer-change logic and correctness feedback.
 * - Unified/production-grade: no sample/demo, 100% design-system/class driven.
 * - Easily extendable for future types: only update switch/handlers.
 *
 * Props:
 * - question: {
 *     id: string|number,
 *     text: string,
 *     type: "multiple-choice" | "true-false" | "short-answer" | "essay" | ...,
 *     options?: string[],
 *     correctAnswer?: any,
 *     feedback?: string,
 *     required?: bool,
 *     ...others
 *   }
 * - value: any                  // User's answer (string, etc.)
 * - onAnswer: function(value)   // Called when answer changes
 * - disabled?: bool
 * - showSolution?: bool
 * - className?: string
 * - style?: object
 * - ...rest: additional outer div props
 */

import PropTypes from 'prop-types';
import styles from './QuestionRenderer.module.scss';

export default function QuestionRenderer({
  question,
  value,
  onAnswer,
  disabled = false,
  showSolution = false,
  className = "",
  style = {},
  ...rest
}) {
  if (!question) return null;
  const {
    id,
    text,
    type,
    options = [],
    correctAnswer,
    feedback,
    required,
  } = question;

  // Type guards for current question variant
  const isMC = type === "multiple-choice";
  const isTF = type === "true-false";
  const isShort = type === "short-answer";
  const isEssay = type === "essay";

  // Unified option changing: MC/TF both are radiogroups
  const handleChange = (e) => {
    if (disabled || showSolution) return;
    if (isMC || isTF || isShort || isEssay) {
      onAnswer(e.target.value);
    }
  };

  // Assign classes for options (correct/incorrect feedback)
  const getOptionClass = (opt) => {
    if (!showSolution) return "";
    if (Array.isArray(correctAnswer) && correctAnswer.includes(opt)) {
      return styles["questionRenderer__option--correct"];
    } else if (correctAnswer == null) {
      return "";
    } else if (opt === correctAnswer) {
      return styles["questionRenderer__option--correct"];
    } else if (value === opt) {
      return styles["questionRenderer__option--incorrect"];
    }
    return "";
  };

  // Root className as per global design-system
  const rootClass = [styles.questionRenderer, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} style={style} {...rest}>
      {/* Question Title */}
      <div className={styles.questionRenderer__text}>
        {required && <span className={styles["questionRenderer__required"]}>*</span>}
        {text}
      </div>

      {/* Multiple Choice / True-False */}
      {(isMC || isTF) && (
        <ul className={styles.questionRenderer__options} role="radiogroup" aria-labelledby={`q-${id}`}>
          {options.map((opt) => (
            <li
              key={opt}
              className={[
                styles.questionRenderer__option,
                getOptionClass(opt)
              ].filter(Boolean).join(' ')}
            >
              <label>
                <input
                  type="radio"
                  name={`q-${id}`}
                  value={opt}
                  checked={value === opt}
                  disabled={disabled || showSolution}
                  onChange={handleChange}
                  aria-checked={value === opt}
                  aria-disabled={disabled || showSolution}
                />
                <span className={styles.questionRenderer__optionText}>{opt}</span>
              </label>
              {/* Correctness visual marks */}
              {showSolution && correctAnswer === opt && (
                <span className={styles.questionRenderer__badge} aria-label="correct">✔</span>
              )}
              {showSolution && value === opt && value !== correctAnswer && (
                <span className={styles.questionRenderer__badge} aria-label="incorrect">✖</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Short Answer */}
      {isShort && (
        <div className={styles.questionRenderer__inputGroup}>
          <input
            type="text"
            name={`q-${id}`}
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            disabled={disabled || showSolution}
            placeholder="Type your answer…"
            className={styles.questionRenderer__input}
            autoComplete="off"
            aria-disabled={disabled || showSolution}
            aria-label={text}
          />
        </div>
      )}

      {/* Essay (textarea/long answer) */}
      {isEssay && (
        <div className={styles.questionRenderer__inputGroup}>
          <textarea
            name={`q-${id}`}
            value={typeof value === "string" ? value : ""}
            onChange={handleChange}
            disabled={disabled || showSolution}
            placeholder="Type your answer…"
            className={styles.questionRenderer__textarea}
            rows={5}
            aria-disabled={disabled || showSolution}
            aria-label={text}
          />
        </div>
      )}

      {/* Solution/feedback summary */}
      {showSolution && (feedback || (correctAnswer != null)) && (
        <div className={styles.questionRenderer__solution}>
          {correctAnswer != null && (
            <div>
              <strong>Correct Answer:</strong>{" "}
              <span className={styles.questionRenderer__solutionText}>
                {Array.isArray(correctAnswer) ? correctAnswer.join(", ") : String(correctAnswer)}
              </span>
            </div>
          )}
          {feedback && (
            <div className={styles.questionRenderer__feedback}>
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

QuestionRenderer.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.any,
    feedback: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  value: PropTypes.any,
  onAnswer: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  showSolution: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - No demo/sample logic—props, style, feedback/solution handling are all design-system driven.
 * - All input types and solution states are accessible and unified.
 * - Extendable to numeric, file upload, or custom quiz types globally.
 */