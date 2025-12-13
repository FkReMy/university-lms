/**
 * DepartmentDetailPage Component
 * ----------------------------------------------------------
 * Admin/staff or university user view of an individual department's details.
 *
 * Responsibilities:
 * - Displays department name, code, school, head, description, number of courses.
 * - Lists courses under the department.
 * - (Optionally) List/manage faculty/staff members.
 * - Admin controls for editing or removing the department (readiness for future logic).
 *
 * Usage:
 *   <Route path="/departments/:id" element={<DepartmentDetailPage />} />
 */

import { useEffect, useState } from 'react';
import styles from './DepartmentDetailPage.module.scss';

export default function DepartmentDetailPage({ deptId /* from router params */ }) {
  // Demo department and courses info (would be fetched by ID in real app)
  const [dept, setDept] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate load by deptId
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const demoDept = {
        id: deptId ?? 1,
        name: "Computer Science",
        code: "CSCI",
        school: "Engineering",
        head: "Dr. Alice Smith",
        coursesCount: 22,
        description:
          "The Computer Science Department offers foundational and advanced study in computing, programming, AI, data science, and systems. Faculty lead world-class research and practical instruction."
      };
      setDept(demoDept);
      setCourses([
        { id: 101, name: "Intro to Programming", code: "CSCI 101", credits: 4, instructor: "Dr. J. Barker" },
        { id: 102, name: "Data Structures", code: "CSCI 220", credits: 3, instructor: "Prof. Chen" },
        { id: 103, name: "Artificial Intelligence", code: "CSCI 360", credits: 3, instructor: "Dr. Alice Smith" },
      ]);
      setLoading(false);
    }, 900);
  }, [deptId]);

  return (
    <div className={styles.departmentDetailPage}>
      {loading ? (
        <div className={styles.departmentDetailPage__loading}>Loading department…</div>
      ) : !dept ? (
        <div className={styles.departmentDetailPage__empty}>Department not found.</div>
      ) : (
        <div className={styles.departmentDetailPage__card}>
          {/* Dept info */}
          <header className={styles.departmentDetailPage__header}>
            <h1 className={styles.departmentDetailPage__title}>
              {dept.name} <span className={styles.departmentDetailPage__code}>[{dept.code}]</span>
            </h1>
            <div className={styles.departmentDetailPage__infoRow}>
              <span className={styles.departmentDetailPage__label}>School:</span> {dept.school}
            </div>
            <div className={styles.departmentDetailPage__infoRow}>
              <span className={styles.departmentDetailPage__label}>Department Head:</span> {dept.head}
            </div>
            <div className={styles.departmentDetailPage__infoRow}>
              <span className={styles.departmentDetailPage__label}>Courses Offered:</span> {dept.coursesCount}
            </div>
            <div className={styles.departmentDetailPage__description}>
              {dept.description}
            </div>
          </header>
          {/* Courses table */}
          <section className={styles.departmentDetailPage__section}>
            <h2 className={styles.departmentDetailPage__sectionTitle}>Courses in this Department</h2>
            {courses.length === 0 ? (
              <div className={styles.departmentDetailPage__empty}>No courses found.</div>
            ) : (
              <table className={styles.departmentDetailPage__coursesTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Credits</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>{course.code}</td>
                      <td>{course.credits}</td>
                      <td>{course.instructor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          {/* Optional: admin action buttons */}
          <section className={styles.departmentDetailPage__actions}>
            <button
              className={styles.departmentDetailPage__actionBtn}
              // onClick={() => ... future edit dialog ...}
            >Edit Info</button>
            <button
              className={styles.departmentDetailPage__actionBtn}
              // onClick={() => ... future delete logic ...}
            >Remove Department</button>
          </section>
        </div>
      )}
    </div>
  );
}