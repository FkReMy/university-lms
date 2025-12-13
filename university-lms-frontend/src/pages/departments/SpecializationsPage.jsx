/**
 * SpecializationsPage Component
 * ----------------------------------------------------------
 * Admin/staff directory of academic specializations/minors within departments.
 *
 * Responsibilities:
 * - Lists all specializations in a table/card view.
 * - Allows searching/filtering by name or department.
 * - Ready for extension: add/edit/delete specialization.
 *
 * Usage:
 *   <Route path="/specializations" element={<SpecializationsPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './SpecializationsPage.module.scss';

export default function SpecializationsPage() {
  // State for specialization list and search/filter
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate API load on mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSpecializations([
        { id: 1, name: "AI & Machine Learning", code: "AIML", department: "Computer Science", head: "Dr. Alice Smith", students: 39 },
        { id: 2, name: "Modern Art Theory", code: "MATH", department: "Art History", head: "Prof. Lee", students: 12 },
        { id: 3, name: "Data Science", code: "DSCI", department: "Computer Science", head: "Dr. J. Barker", students: 28 },
        { id: 4, name: "Business Analytics", code: "BUSA", department: "Business", head: "Dr. Turner", students: 30 }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Gather department list for filter dropdown
  const departments = [
    ...new Set(specializations.map(s => s.department))
  ].sort();

  // Filtered specializations
  const filteredSpecializations = specializations.filter(spec => {
    const matchesName = spec.name.toLowerCase().includes(search.toLowerCase()) ||
      spec.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "all" || spec.department === department;
    return matchesName && matchesDept;
  });

  return (
    <div className={styles.specializationsPage}>
      <h1 className={styles.specializationsPage__title}>Specializations</h1>
      <div className={styles.specializationsPage__controls}>
        <input
          className={styles.specializationsPage__search}
          type="text"
          placeholder="Search by spec. name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.specializationsPage__departmentSelect}
          value={department}
          onChange={e => setDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dep => (
            <option value={dep} key={dep}>{dep}</option>
          ))}
        </select>
        <button
          className={styles.specializationsPage__addBtn}
          type="button"
          // onClick={() => ... future dialog/modal ...}
        >
          + Add Specialization
        </button>
      </div>
      <div className={styles.specializationsPage__listArea}>
        {loading ? (
          <div className={styles.specializationsPage__loading}>
            Loading specializations…
          </div>
        ) : filteredSpecializations.length === 0 ? (
          <div className={styles.specializationsPage__empty}>
            No specializations found.
          </div>
        ) : (
          <table className={styles.specializationsPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Head</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecializations.map(spec => (
                <tr key={spec.id}>
                  <td>{spec.name}</td>
                  <td>{spec.code}</td>
                  <td>{spec.department}</td>
                  <td>{spec.head}</td>
                  <td>{spec.students}</td>
                  <td>
                    <button
                      className={styles.specializationsPage__actionBtn}
                      title="Edit specialization"
                      // onClick={() => ... future edit dialog ...}
                    >Edit</button>
                    <button
                      className={styles.specializationsPage__actionBtn}
                      // onClick={() => ... future remove logic ...}
                    >Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}