/**
 * QuizTakingPage Component
 * ----------------------------------------------------------
 * Student page for taking a quiz (renders questions, options, submit).
 *
 * Responsibilities:
 * - Show quiz info (title, time).
 * - Render questions and input fields for each.
 * - Submit answers (future: API submit, validation).
 * - Handles loading and error states; no edit/delete.
 *
 * Usage:
 *   <Route path="/quizzes/:id/take" element={<QuizTakingPage />} />
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import styles from './QuizTakingPage.module.scss';
import { ROUTES } from '@/lib/constants';

// Demo: default quiz data
const DEMO_QUESTIONS = [
  { id: 1, text: 'What is a variable in Python?', type: 'short' },
  {
    id: 2,
    text: 'Select all data types used for numbers in Python.',
    type: 'multi',
    options: ['int', 'str', 'float', 'dict', 'list'],
  },
];

export default function QuizTakingPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Simulate quiz fetch from API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuiz({
        id: quizId || 7,
        title: `Quiz ${quizId || 7}: Python Fundamentals`,
        open: '2025-02-10T10:00',
        close: '2025-02-12T18:30',
        questions: DEMO_QUESTIONS,
      });
      setLoading(false);
    }, 700);
  }, [quizId]);

  // Handle answer change
  function handleAnswerChange(id, value) {
    setAnswers(a => ({ ...a, [id]: value }));
  }

  function handleMultiAnswerChange(id, option) {
    setAnswers(a => {
      const prev = a[id] || [];
      if (prev.includes(option)) {
        return { ...a, [id]: prev.filter(o => o !== option) };
      } else {
        return { ...a, [id]: [...prev, option] };
      }
    });
  }

  // Demo: handle submit
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // Normally: submit to backend, handle results
  }

  // Format quiz timerange
  function fmt(dateStr) {
    if (!dateStr) return '';
    const dt = new Date(dateStr);
    return dt.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className={styles.quizTakingPage}>
      {loading ? (
        <div className={styles.quizTakingPage__loading}>Loading quiz...</div>
      ) : !quiz ? (
        <div className={styles.quizTakingPage__error}>Quiz not found.</div>
      ) : (
        <div className={styles.quizTakingPage__mainBox}>
          <h1 className={styles.quizTakingPage__title}>{quiz.title}</h1>
          <div className={styles.quizTakingPage__window}>
            <div className={styles.quizTakingPage__timerange}>
              Open: <b>{fmt(quiz.open)}</b> &mdash; Close: <b>{fmt(quiz.close)}</b>
            </div>
            {submitted ? (
            <div className={styles.quizTakingPage__submitted}>
              Quiz Submitted! Thank you.
              <div className={styles.quizTakingPage__backLink}>
                <Link to={ROUTES.QUIZZES}>Back to quizzes</Link>
              </div>
            </div>
          ) : (
              <form
                className={styles.quizTakingPage__form}
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <ol className={styles.quizTakingPage__questionsList}>
                  {quiz.questions.map((q, idx) => (
                    <li key={q.id} className={styles.quizTakingPage__questionItem}>
                      <div className={styles.quizTakingPage__questionText}>
                        {idx + 1}. {q.text}
                      </div>
                      {q.type === 'short' && (
                        <input
                          type="text"
                          className={styles.quizTakingPage__input}
                          value={answers[q.id] || ''}
                          onChange={e => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Your answer..."
                          required
                        />
                      )}
                      {q.type === 'multi' && (
                        <div className={styles.quizTakingPage__multiOptions}>
                          {q.options.map(opt => (
                            <label
                              key={opt}
                              className={styles.quizTakingPage__multiOption}
                            >
                              <input
                                type="checkbox"
                                checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                                onChange={() =>
                                  handleMultiAnswerChange(q.id, opt)
                                }
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                  {quiz.questions.length === 0 && (
                    <li className={styles.quizTakingPage__questionItemEmpty}>
                      No questions in this quiz.
                    </li>
                  )}
                </ol>
                <div className={styles.quizTakingPage__actions}>
                  <button
                    type="submit"
                    className={styles.quizTakingPage__submitBtn}
                  >
                    Submit Quiz
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
