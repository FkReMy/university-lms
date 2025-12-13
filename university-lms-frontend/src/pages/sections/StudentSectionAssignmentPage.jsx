/**
 * StudentSectionAssignmentPage Component
 * ----------------------------------------------------------
 * Admin/staff tool for assigning students to course sections.
 *
 * Responsibilities:
 * - Lists students and their section assignment (or unassigned).
 * - Allows searching/filtering by student or section.
 * - Ready for extension: assign/remove students from section.
 *
 * Usage:
 *   <Route path="/sections/assignment" element={<StudentSectionAssignmentPage />} />
 */

import { useEffect, useState } from 'react';
import styles from './StudentSectionAssignmentPage.module.scss';

export default function StudentSectionAssignmentPage() {
  // State for students and search/filter
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate fetch of students and section (stub/example)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: 'Jane Student',
          email: 'jane.smith@email.edu',
          section: 'CSCI 101 - MW 10:30',
        },
        {
          id: 2,
          name: 'John Lee',
          email: 'john.lee@email.edu',
          section: 'MATH 195 - TTh 09:00',
        },
        {
          id: 3,
          name: 'Olivia Brown',
          email: 'obrown@email.edu',
          section: 'Not assigned',
        },
        {
          id: 4,
          name: 'Ava Davis',
          email: 'ava.davis@email.edu',
          section: 'BUS 240 - F 12:00',
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Compute unique sections for filter
  const sections = [
    ...new Set(students.map((s) => s.section)),
  ].filter((s) => s !== 'Not assigned' && !!s);

  // Filtered list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesSection =
      section === 'all' ||
      (section === 'unassigned'
        ? s.section === 'Not assigned'
        : s.section === section);
    return matchesSearch && matchesSection;
  });

  return (
    <div className={styles.studentSectionAssignmentPage}>
      <h1 className={styles.studentSectionAssignmentPage__title}>
        Student Section Assignments
      </h1>
      <div className={styles.studentSectionAssignmentPage__controls}>
        <input
          className={styles.studentSectionAssignmentPage__search}
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.studentSectionAssignmentPage__sectionSelect}
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="all">All Sections</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
          <option value="unassigned">Unassigned</option>
        </select>
        <button
          className={styles.studentSectionAssignmentPage__addBtn}
          type="button"
          // onClick={() => ... assign logic ...}
        >
          Assign Student
        </button>
      </div>
      <div className={styles.studentSectionAssignmentPage__listArea}>
        {loading ? (
          <div className={styles.studentSectionAssignmentPage__loading}>
            Loading students…
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.studentSectionAssignmentPage__empty}>
            No students found.
          </div>
        ) : (
          <table className={styles.studentSectionAssignmentPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    {student.section === 'Not assigned' ? (
                      <span
                        style={{
                          background: '#fbeaea',
                          color: '#e62727',
                          borderRadius: '1em',
                          padding: '0.11em 0.85em',
                          fontWeight: 600,
                          fontSize: '0.97em',
                        }}
                      >
                        Not assigned
                      </span>
                    ) : (
                      student.section
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.studentSectionAssignmentPage__actionBtn}
                      // onClick={() => ... future assign/change dialog ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.studentSectionAssignmentPage__actionBtn}
                      // onClick={() => ... future remove action ...}
                    >
                      Remove
                    </button>
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