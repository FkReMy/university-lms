/**
 * DepartmentDetailPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin/staff or university user view of an individual department's details.
 * - Displays department info (name, code, school, head, description, courses count).
 * - Lists all courses under the department.
 * - Unified styling and controls, uses global components.
 * - Admin action hooks ready for future expansion.
 * - Loads real data from backend: no sample/demo logic.
 * 
 * Usage:
 *   <Route path="/departments/:id" element={<DepartmentDetailPage />} />
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './DepartmentDetailPage.module.scss';

import Button from '@/components/ui/button';
import Table from '@/components/ui/table';
import departmentApi from '@/services/api/departmentApi'; // To be implemented: .get(id), .getCourses(id)

export default function DepartmentDetailPage() {
  const { id: deptId } = useParams();

  // State for department and courses
  const [dept, setDept] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch department and its courses from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchDepartment() {
      setLoading(true);
      try {
        const deptData = await departmentApi.get(deptId);
        const coursesData = await departmentApi.getCourses(deptId);
        if (isMounted) {
          setDept(deptData || null);
          setCourses(Array.isArray(coursesData) ? coursesData : []);
        }
      } catch (err) {
        if (isMounted) {
          setDept(null);
          setCourses([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDepartment();
    return () => { isMounted = false; }
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
              <Table className={styles.departmentDetailPage__coursesTable}>
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
              </Table>
            )}
          </section>
          {/* Admin action buttons (ready for expansion) */}
          <section className={styles.departmentDetailPage__actions}>
            <Button
              className={styles.departmentDetailPage__actionBtn}
              variant="outline"
              // onClick={() => ... future edit dialog ...}
            >Edit Info</Button>
            <Button
              className={styles.departmentDetailPage__actionBtn}
              variant="danger"
              // onClick={() => ... future delete logic ...}
            >Remove Department</Button>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Production Notes:
 * - All data is loaded from backend via departmentApi (no demo/mock).
 * - Uses global Button and Table components for consistency.
 * - Admin actions are ready for future logic (modal, dialog, etc).
 * - Clean structure for real-scale LMS usage.
 */