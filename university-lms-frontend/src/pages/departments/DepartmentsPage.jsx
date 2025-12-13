/**
 * DepartmentsPage Component
 * ----------------------------------------------------------
 * Admin/staff page for viewing and managing university departments.
 *
 * Responsibilities:
 * - Lists all departments in a table/card view.
 * - Allows searching/filtering by name or school.
 * - Ready for extension: add/edit/delete departments.
 *
 * Usage:
 *   <Route path="/departments" element={<DepartmentsPage />} />
 */

import { useEffect, useState } from 'react';
import styles from './DepartmentsPage.module.scss';

export default function DepartmentsPage() {
  // State for department list and search/filter
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [school, setSchool] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate API load on mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDepartments([
        { id: 1, name: "Computer Science", code: "CSCI", school: "Engineering", head: "Dr. Smith", courses: 22 },
        { id: 2, name: "Art History", code: "ARTH", school: "Arts & Humanities", head: "Prof. Lee", courses: 8 },
        { id: 3, name: "Mathematics", code: "MATH", school: "Sciences", head: "Dr. Kapoor", courses: 15 },
        { id: 4, name: "Business", code: "BUS", school: "Business", head: "Dr. Turner", courses: 17 }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Find schools for filter dropdown
  const schools = [
    ...new Set(departments.map(dep => dep.school))
  ].sort();

  // Filtered departments
  const filteredDepartments = departments.filter(dep => {
    const matchesName = dep.name.toLowerCase().includes(search.toLowerCase()) ||
      dep.code.toLowerCase().includes(search.toLowerCase());
    const matchesSchool = school === "all" || dep.school === school;
    return matchesName && matchesSchool;
  });

  return (
    <div className={styles.departmentsPage}>
      <h1 className={styles.departmentsPage__title}>Departments</h1>
      <div className={styles.departmentsPage__controls}>
        <input
          className={styles.departmentsPage__search}
          type="text"
          placeholder="Search by dept. name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.departmentsPage__schoolSelect}
          value={school}
          onChange={e => setSchool(e.target.value)}
        >
          <option value="all">All Schools</option>
          {schools.map(sch => (
            <option value={sch} key={sch}>{sch}</option>
          ))}
        </select>
        <button
          className={styles.departmentsPage__addBtn}
          type="button"
          // onClick={() => ... future dialog/modal ...}
        >
          + Add Department
        </button>
      </div>
      <div className={styles.departmentsPage__listArea}>
        {loading ? (
          <div className={styles.departmentsPage__loading}>
            Loading departments…
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className={styles.departmentsPage__empty}>
            No departments found.
          </div>
        ) : (
          <table className={styles.departmentsPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>School</th>
                <th>Head</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dep => (
                <tr key={dep.id}>
                  <td>{dep.name}</td>
                  <td>{dep.code}</td>
                  <td>{dep.school}</td>
                  <td>{dep.head}</td>
                  <td>{dep.courses}</td>
                  <td>
                    <button
                      className={styles.departmentsPage__actionBtn}
                      title="Edit department"
                      // onClick={() => ... future edit dialog ...}
                    >Edit</button>
                    <button
                      className={styles.departmentsPage__actionBtn}
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