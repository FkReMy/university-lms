/**
 * QuizBuilderPage Component (Production)
 * ----------------------------------------------------------------------------
 * Quiz builder/editor page for instructors and admins.
 * - Editable form for quiz title, open/close times, and status.
 * - Add/edit/remove questions.
 * - All inputs/buttons use global components (Input, Select, Button).
 * - No demo/sample logic; all data loads/saves via backend API.
 * - Scaffold is ready for further extension (question types, options, preview, etc).
 *
 * Usage:
 *   <Route path="/quizzes/:id/edit" element={<QuizBuilderPage />} />
 *   <Route path="/quizzes/new" element={<QuizBuilderPage />} />
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './QuizBuilderPage.module.scss';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import quizApi from '@/services/api/quizApi'; // Should provide .get(id), .save(payload) etc.

export default function QuizBuilderPage() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  // State for quiz info and questions
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const [status, setStatus] = useState('draft');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load quiz for edit mode (or blank if new)
  useEffect(() => {
    let isMounted = true;
    async function loadQuiz() {
      setLoading(true);
      try {
        if (quizId) {
          const data = await quizApi.get(quizId);
          if (isMounted && data) {
            setTitle(data.title || '');
            setOpen(data.open || '');
            setClose(data.close || '');
            setStatus(data.status || 'draft');
            setQuestions(Array.isArray(data.questions) ? data.questions : []);
          }
        } else {
          if (isMounted) {
            setTitle('');
            setOpen('');
            setClose('');
            setStatus('draft');
            setQuestions([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setTitle('');
          setOpen('');
          setClose('');
          setStatus('draft');
          setQuestions([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadQuiz();
    return () => { isMounted = false; };
  }, [quizId]);

  // Question handlers
  const handleQuestionChange = useCallback((idx, newText) => {
    setQuestions((qs) => {
      const next = [...qs];
      next[idx] = { ...next[idx], text: newText };
      return next;
    });
  }, []);
  const handleRemoveQuestion = useCallback((idx) => {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
  }, []);
  const handleAddQuestion = useCallback(() => {
    setQuestions((qs) => [
      ...qs,
      { id: Date.now(), text: '', type: 'short' },
    ]);
  }, []);

  // Save quiz to backend
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        open,
        close,
        status,
        questions
      };
      if (quizId) {
        await quizApi.save(quizId, payload);
      } else {
        const newQuiz = await quizApi.save(null, payload);
        if (newQuiz && newQuiz.id) {
          navigate(`/quizzes/${newQuiz.id}/edit`);
          return;
        }
      }
      // Optionally show a temporary success UI
    } catch (err) {
      // TODO: show error message/alert
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.quizBuilderPage}>
      <h1 className={styles.quizBuilderPage__title}>
        {title || 'New Quiz'}
      </h1>
      <div className={styles.quizBuilderPage__formArea}>
        {loading ? (
          <div className={styles.quizBuilderPage__loading}>Loading quiz…</div>
        ) : (
          <form
            className={styles.quizBuilderPage__form}
            onSubmit={handleSave}
            autoComplete="off"
          >
            {/* Quiz-wide fields */}
            <div className={styles.quizBuilderPage__fieldRow}>
              <label className={styles.quizBuilderPage__label}>
                Title
                <Input
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
                  <Input
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
                  <Input
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
                  <Select
                    className={styles.quizBuilderPage__input}
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </Select>
                </label>
              </div>
            </div>
            {/* Questions Editor */}
            <div className={styles.quizBuilderPage__questionsArea}>
              <div className={styles.quizBuilderPage__questionsHeader}>
                <b>Questions</b>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className={styles.quizBuilderPage__addBtn}
                  onClick={handleAddQuestion}
                >
                  + Add Question
                </Button>
              </div>
              <ol className={styles.quizBuilderPage__questionsList}>
                {questions.map((q, idx) => (
                  <li key={q.id} className={styles.quizBuilderPage__questionItem}>
                    <Input
                      type="text"
                      className={styles.quizBuilderPage__input}
                      value={q.text}
                      placeholder="Enter question…"
                      maxLength={180}
                      required
                      onChange={e => handleQuestionChange(idx, e.target.value)}
                    />
                    <Button
                      type="button"
                      className={styles.quizBuilderPage__removeBtn}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveQuestion(idx)}
                      title="Remove question"
                      aria-label="Remove question"
                    >
                      &#215;
                    </Button>
                  </li>
                ))}
                {questions.length === 0 && (
                  <li className={styles.quizBuilderPage__questionItemEmpty}>
                    No questions yet. Click &quot;Add Question&quot; to begin.
                  </li>
                )}
              </ol>
            </div>
            <div className={styles.quizBuilderPage__actions}>
              <Button
                type="submit"
                className={styles.quizBuilderPage__saveBtn}
                variant="primary"
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Quiz'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - All controls use Input/Select/Button from your global UI system.
 * - All state/data loads and saves through backend quizApi (no demo sample).
 * - Ready for expanding question types/options/preview, as needed.
 */