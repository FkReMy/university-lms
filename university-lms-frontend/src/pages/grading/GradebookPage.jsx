/**
 * GradebookPage Component
 * ----------------------------------------------------------
 * Displays a gradebook table for a section or course, for instructors.
 *
 * Responsibilities:
 * - List all students, all grade columns (assignments/quizzes/etc)
 * - Allows grade entry/edit (future), computes total/average.
 * - Filter/search by student.
 * - Uses shared Table component for structure.
 * - Style isolation for empty grades.
 *
 * Usage:
 *   <Route path="/gradebook" element={<GradebookPage />} />
 */

import { useEffect, useState } from 'react';

import Input from '../../components/ui/input';    // Design system Input
import Table from '../../components/ui/table';    // Design system Table

import styles from './GradebookPage.module.scss';

export default function GradebookPage() {
  // Demo data (students and grade columns)
  const [students, setStudents] = useState([]);
  const [gradeCols, setGradeCols] = useState([]);
  const [grades, setGrades] = useState({}); // { [studentId]: { [colKey]: number } }
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate fetch
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 1, name: 'Jane Student' },
        { id: 2, name: 'John Lee' },
        { id: 3, name: 'Olivia Brown' },
        { id: 4, name: 'Ava Davis' },
      ]);
      setGradeCols([
        { key: 'a1', label: 'Assignment 1', max: 100 },
        { key: 'quiz1', label: 'Quiz 1', max: 25 },
        { key: 'a2', label: 'Assignment 2', max: 100 },
      ]);
      setGrades({
        1: { a1: 93, quiz1: 23, a2: 98 },
        2: { a1: 80, quiz1: 19, a2: 83 },
        3: { a1: 72, quiz1: 21, a2: 0 },
        4: { a1: 97, quiz1: 25, a2: 100 },
      });
      setLoading(false);
    }, 900);
  }, []);

  // Filter students by search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Compute totals and average where possible
  function getTotal(studentId) {
    const sgrades = grades[studentId] || {};
    let total = 0;
    for (const col of gradeCols) {
      if (typeof sgrades[col.key] === 'number') total += sgrades[col.key] || 0;
    }
    return total;
  }

  function getMaxTotal() {
    return gradeCols.reduce((sum, col) => sum + (col.max || 0), 0);
  }

  function fmtPct(score, outOf) {
    if (!outOf) return '';
    const pct = Math.round((score / outOf) * 100);
    return `${score}/${outOf} (${pct}%)`;
  }

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
        {/* For future: section/course dropdown */}
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
 * Notes:
 * - Table now uses the design system's <Table> for uniform styling and accessibility.
 * - <Input> is used for the search field.
 * - Empty grades use a dedicated .gradebookPage__emptyGrade class for style isolation; no inline styles.
 * - Table supports a striped prop for improved readability (if your Table supports that).
 */