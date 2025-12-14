/**
 * GradebookPage Component (Production)
 * ----------------------------------------------------------------------------
 * Displays the gradebook table for a course or section for instructors.
 * - Lists all students and graded columns (assignments, quizzes, etc).
 * - Filter/search by student, computes total/average.
 * - All UI uses global design system (Input, Table).
 * - All state/data must be backend-driven; no sample/demo logic remains.
 *
 * Usage:
 *   <Route path="/gradebook" element={<GradebookPage />} />
 */

import { useEffect, useMemo, useState } from 'react';

import Input from '@/components/ui/input';
import Table from '@/components/ui/table';

import styles from './GradebookPage.module.scss';

import gradebookApi from '@/services/api/gradebookApi'; // Backend must provide: .listStudents(), .listColumns(), .listGrades()

export default function GradebookPage() {
  // State for students, grade columns, student grades, and loading/filter
  const [students, setStudents] = useState([]);
  const [gradeCols, setGradeCols] = useState([]);
  const [grades, setGrades] = useState({}); // { [studentId]: { [colKey]: number } }
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch students, columns, and grades from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchGradebook() {
      setLoading(true);
      try {
        const [studentList, colList, gradeList] = await Promise.all([
          gradebookApi.listStudents(),
          gradebookApi.listColumns(),
          gradebookApi.listGrades(),
        ]);
        if (isMounted) {
          setStudents(Array.isArray(studentList) ? studentList : []);
          setGradeCols(Array.isArray(colList) ? colList : []);
          // gradeList should be { studentId: { colKey: value, ... }, ... }
          setGrades(typeof gradeList === 'object' && gradeList !== null ? gradeList : {});
        }
      } catch (err) {
        if (isMounted) {
          setStudents([]);
          setGradeCols([]);
          setGrades({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchGradebook();
    return () => { isMounted = false; };
  }, []);

  // Memoized students filtering by search
  const filteredStudents = useMemo(
    () => students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    ),
    [students, search]
  );

  // Compute total score for a student
  function getTotal(studentId) {
    const sGrades = grades[studentId] || {};
    let total = 0;
    for (const col of gradeCols) {
      if (typeof sGrades[col.key] === 'number') total += sGrades[col.key] || 0;
    }
    return total;
  }

  // Max total available from all columns
  function getMaxTotal() {
    return gradeCols.reduce((sum, col) => sum + (col.max || 0), 0);
  }

  // Format total with percent
  function fmtPct(score, outOf) {
    if (!outOf) return '';
    const pct = Math.round((score / outOf) * 100);
    return `${score}/${outOf} (${pct}%)`;
  }

  // Compute average for a grade column (across filtered students)
  function computeAverage(colKey) {
    let total = 0, count = 0;
    for (const s of filteredStudents) {
      if (grades[s.id] && typeof grades[s.id][colKey] === 'number') {
        total += grades[s.id][colKey];
        count++;
      }
    }
    if (!count) return '';
    return (total / count).toFixed(1);
  }

  return (
    <div className={styles.gradebookPage}>
      <h1 className={styles.gradebookPage__title}>Gradebook</h1>
      <div className={styles.gradebookPage__controls}>
        <Input
          className={styles.gradebookPage__search}
          type="text"
          placeholder="Search by student name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Future: add section/course filter dropdown here */}
      </div>
      <div className={styles.gradebookPage__tableArea}>
        {loading ? (
          <div className={styles.gradebookPage__loading}>Loading grades…</div>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.gradebookPage__empty}>No students found.</div>
        ) : (
          <Table className={styles.gradebookPage__table} striped>
            <thead>
              <tr>
                <th>Student</th>
                {gradeCols.map(col => (
                  <th key={col.key}>
                    {col.label}
                    <br />
                    <span className={styles.gradebookPage__colMax}>/ {col.max}</span>
                  </th>
                ))}
                <th>
                  Total
                  <br />
                  <span className={styles.gradebookPage__colMax}>/ {getMaxTotal()}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id}>
                  <td className={styles.gradebookPage__studentCol}>{s.name}</td>
                  {gradeCols.map(col => (
                    <td key={col.key}>
                      {grades[s.id] && typeof grades[s.id][col.key] === 'number'
                        ? grades[s.id][col.key]
                        : <span className={styles.gradebookPage__emptyGrade}>–</span>
                      }
                    </td>
                  ))}
                  <td className={styles.gradebookPage__totalCol}>
                    {fmtPct(getTotal(s.id), getMaxTotal())}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 700 }}>Average</td>
                {gradeCols.map(col => (
                  <td key={col.key} className={styles.gradebookPage__avgCell}>
                    {computeAverage(col.key)}
                  </td>
                ))}
                <td />
              </tr>
            </tfoot>
          </Table>
        )}
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - No demo data; all students, gradeCols, grades are loaded from backend API.
 * - Uses only global Input and Table.
 * - Clean column, cell, and footer computation for any class/section assignment structure.
 * - Add edit/entry features on top as needed later.
 */