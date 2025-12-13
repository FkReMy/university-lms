/**
 * QuizBuilderPage Component
 * ----------------------------------------------------------
 * Page for building or editing a quiz (title, time, questions, etc).
 *
 * Responsibilities:
 * - Editable form for quiz title, open/close times, status.
 * - Manage questions: add, edit, remove basic question items.
 * - Ready for expansion: question types, options, preview.
 *
 * Usage:
 *   <Route path="/quizzes/:id/edit" element={<QuizBuilderPage />} />
 *   <Route path="/quizzes/new" element={<QuizBuilderPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './QuizBuilderPage.module.scss';

// --- Demo default state for editing ---
const DEMO_QUESTIONS = [
  { id: 1, text: 'What is a variable in Python?', type: 'short' },
  { id: 2, text: 'Select all data types used for numbers in Python.', type: 'multi' },
];

export default function QuizBuilderPage() {
  // State for quiz info and questions
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const [status, setStatus] = useState('draft');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate quiz load (if editing)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTitle('Python Fundamentals Quiz');
      setOpen('2025-02-10T10:00');
      setClose('2025-02-12T18:30');
      setStatus('open');
      setQuestions(DEMO_QUESTIONS);
      setLoading(false);
    }, 700);
  }, []);

  // Handlers for editing questions
  function handleQuestionChange(idx, newText) {
    setQuestions(qs => {
      const nq = [...qs];
      nq[idx] = { ...nq[idx], text: newText };
      return nq;
    });
  }
  function handleRemoveQuestion(idx) {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  }
  function handleAddQuestion() {
    setQuestions(qs => [
      ...qs,
      { id: Date.now(), text: '', type: 'short' },
    ]);
  }

  // Handler for mock save (can connect to API)
  function handleSave(e) {
    e.preventDefault();
    // submit API
    alert('Quiz saved! (Demo only)');
  }

  return (
    <div className={styles.quizBuilderPage}>
      <h1 className={styles.quizBuilderPage__title}>
        {title || 'New Quiz'}
      </h1>
      <div className={styles.quizBuilderPage__formArea}>
        {loading ? (
          <div className={styles.quizBuilderPage__loading}>Loading quiz...</div>
        ) : (
          <form
            className={styles.quizBuilderPage__form}
            onSubmit={handleSave}
            autoComplete="off"
          >
            {/* Quiz wide fields */}
            <div className={styles.quizBuilderPage__fieldRow}>
              <label className={styles.quizBuilderPage__label}>
                Title
                <input
                  className={styles.quizBuilderPage__input}
                  type="text"
                  value={title}
                  required
                  maxLength={80}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>
            </div>
            <div className={styles.quizBuilderPage__fieldRow}>
              <div className={styles.quizBuilderPage__labelWrap}>
                <label className={styles.quizBuilderPage__label}>
                  Opens
                  <input
                    className={styles.quizBuilderPage__input}
                    type="datetime-local"
                    value={open}
                    onChange={e => setOpen(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.quizBuilderPage__labelWrap}>
                <label className={styles.quizBuilderPage__label}>
                  Closes
                  <input
                    className={styles.quizBuilderPage__input}
                    type="datetime-local"
                    value={close}
                    onChange={e => setClose(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.quizBuilderPage__labelWrap}>
                <label className={styles.quizBuilderPage__label}>
                  Status
                  <select
                    className={styles.quizBuilderPage__input}
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </div>
            </div>
            {/* Questions editor */}
            <div className={styles.quizBuilderPage__questionsArea}>
              <div className={styles.quizBuilderPage__questionsHeader}>
                <b>Questions</b>
                <button
                  type="button"
                  className={styles.quizBuilderPage__addBtn}
                  onClick={handleAddQuestion}
                >
                  + Add Question
                </button>
              </div>
              <ol className={styles.quizBuilderPage__questionsList}>
                {questions.map((q, idx) => (
                  <li key={q.id} className={styles.quizBuilderPage__questionItem}>
                    <input
                      type="text"
                      className={styles.quizBuilderPage__input}
                      value={q.text}
                      placeholder="Enter question..."
                      maxLength={180}
                      required
                      onChange={e => handleQuestionChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.quizBuilderPage__removeBtn}
                      onClick={() => handleRemoveQuestion(idx)}
                      title="Remove question"
                      aria-label="Remove question"
                    >
                      &#215;
                    </button>
                  </li>
                ))}
                {questions.length === 0 && (
                  <li className={styles.quizBuilderPage__questionItemEmpty}>
                    No questions yet. Click "Add Question" to begin.
                  </li>
                )}
              </ol>
            </div>
            <div className={styles.quizBuilderPage__actions}>
              <button
                type="submit"
                className={styles.quizBuilderPage__saveBtn}
              >
                Save Quiz
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}