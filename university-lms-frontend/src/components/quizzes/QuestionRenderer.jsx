/**
 * QuestionRenderer Component
 * ----------------------------------------------------------
 * Renders a quiz question based on its type (multiple-choice, true/false, short answer, etc.).
 *
 * Responsibilities:
 * - Receives a question object and handles rendering and input logic based on its type.
 * - Manages answer selection/entry and triggers onAnswer callback with the new value.
 * - Optionally shows feedback/correct answer (if provided).
 *
 * Props:
 * - question: {
 *     id: string|number,
 *     text: string,
 *     type: "multiple-choice" | "true-false" | "short-answer" | "essay" | ...,
 *     options?: string[] (for MC/TF),
 *     correctAnswer?: any,
 *     feedback?: string,
 *     required?: bool,
 *     ...others
 *   }
 * - value: user's answer (optional, string/array/etc)
 * - onAnswer: function(value) (required, calls when answer changes)
 * - disabled: bool (optional)      - Disable all inputs
 * - showSolution: bool (optional)  - Show correct solution/feedback view
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest: (other wrapper props)
 *
 * Usage:
 *   <QuestionRenderer
 *     question={{ id, text, type: "multiple-choice", options: [...] }}
 *     value={selected}
 *     onAnswer={setSelected}
 *   />
 */

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

  // For MC/TF, normalize selected for radio/checkbox
  // For text, value is just the string
  // For TF, options can be ["True", "False"]
  const isMC = type === "multiple-choice";
  const isTF = type === "true-false";
  const isShort = type === "short-answer";
  const isEssay = type === "essay";

  // Handle change/input logic
  const handleChange = (e) => {
    if (disabled || showSolution) return;
    if (isMC || isTF) {
      onAnswer(e.target.value);
    } else if (isShort || isEssay) {
      onAnswer(e.target.value);
    }
  };

  // Mark option as correct/incorrect if showSolution
  const getOptionClass = (opt) => {
    if (!showSolution) return "";
    if (Array.isArray(correctAnswer)) {
      if (correctAnswer.includes(opt)) return styles["questionRenderer__option--correct"];
    } else if (correctAnswer == null) {
      return "";
    } else if (opt === correctAnswer) {
      return styles["questionRenderer__option--correct"];
    } else if (value === opt) {
      return styles["questionRenderer__option--incorrect"];
    }
    return "";
  };

  // Compose root class
  const rootClass = [styles.questionRenderer, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} style={style} {...rest}>
      <div className={styles.questionRenderer__text}>
        {required && <span className={styles["questionRenderer__required"]}>*</span>}
        {text}
      </div>

      {/* Multiple Choice or True/False */}
      {(isMC || isTF) && (
        <ul className={styles.questionRenderer__options} role="radiogroup" aria-labelledby={`q-${id}`}>
          {options.map((opt, i) => (
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
              {/* Correctness mark */}
              {showSolution && correctAnswer === opt && (
                <span className={styles.questionRenderer__badge}>✔</span>
              )}
              {showSolution && value === opt && value !== correctAnswer && (
                <span className={styles.questionRenderer__badge}>✖</span>
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
            placeholder="Type your answer..."
            className={styles.questionRenderer__input}
            autoComplete="off"
            aria-disabled={disabled || showSolution}
            aria-label={text}
          />
        </div>
      )}

      {/* Essay (long text) */}
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

      {/* Feedback/solution area */}
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