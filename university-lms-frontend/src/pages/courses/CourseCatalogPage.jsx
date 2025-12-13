/**
 * CourseCatalogPage Component
 * ----------------------------------------------------------
 * Main course catalog view for all users: browse, search, and filter courses.
 *
 * Responsibilities:
 * - Lists available courses in a responsive card/list view.
 * - Allows searching/filtering by keyword, department, instructor, and credits.
 * - Ready for expansion: enroll/view details actions.
 *
 * Usage:
 *   <Route path="/courses" element={<CourseCatalogPage />} />
 */

import { useEffect, useState } from 'react';
import styles from './CourseCatalogPage.module.scss';

export default function CourseCatalogPage() {
  // Course catalog state (simulate fetching from API)
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [credits, setCredits] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate course list load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCourses([
        {
          id: 1,
          name: "Introduction to Computer Science",
          code: "CSCI 101",
          department: "Computer Science",
          instructor: "Dr. Smith",
          credits: 4,
          description: "Learn foundational programming and problem-solving skills in Python.",
        },
        {
          id: 2,
          name: "World History",
          code: "HIST 210",
          department: "History",
          instructor: "Prof. Lee",
          credits: 3,
          description: "A broad overview of modern world history from 1500-present.",
        },
        {
          id: 3,
          name: "Calculus I",
          code: "MATH 195",
          department: "Mathematics",
          instructor: "Dr. Kapoor",
          credits: 4,
          description: "Limits, derivatives, and integrals with real-world applications.",
        },
        {
          id: 4,
          name: "Business Communication",
          code: "BUS 240",
          department: "Business",
          instructor: "Dr. Turner",
          credits: 2,
          description: "Writing and speaking for business audiences.",
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Department and credit filters for dropdowns
  const departments = [
    ...new Set(courses.map((c) => c.department)),
  ].sort();

  const creditOptions = [
    ...new Set(courses.map((c) => c.credits)),
  ].sort((a, b) => a - b);

  // Filter and search logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      department === 'all' || course.department === department;
    const matchesCredits =
      credits === 'all' || course.credits === Number(credits);
    return matchesSearch && matchesDepartment && matchesCredits;
  });

  return (
    <div className={styles.courseCatalogPage}>
      <h1 className={styles.courseCatalogPage__title}>Course Catalog</h1>
      <div className={styles.courseCatalogPage__controls}>
        <input
          className={styles.courseCatalogPage__search}
          type="text"
          placeholder="Search course name, code, or instructor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.courseCatalogPage__departmentSelect}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dep) => (
            <option value={dep} key={dep}>
              {dep}
            </option>
          ))}
        </select>
        <select
          className={styles.courseCatalogPage__creditsSelect}
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
        >
          <option value="all">All Credits</option>
          {creditOptions.map((cr) => (
            <option value={cr} key={cr}>
              {cr} credits
            </option>
          ))}
        </select>
      </div>
      <div className={styles.courseCatalogPage__listArea}>
        {loading ? (
          <div className={styles.courseCatalogPage__loading}>
            Loading courses…
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className={styles.courseCatalogPage__empty}>
            No courses found.
          </div>
        ) : (
          <div className={styles.courseCatalogPage__cardsWrap}>
            {filteredCourses.map((course) => (
              <div className={styles.courseCatalogPage__card} key={course.id}>
                <div className={styles.courseCatalogPage__cardHead}>
                  <span className={styles.courseCatalogPage__cardCode}>
                    {course.code}
                  </span>
                  <span className={styles.courseCatalogPage__cardDept}>
                    {course.department}
                  </span>
                  <span className={styles.courseCatalogPage__cardCredits}>
                    {course.credits} cr
                  </span>
                </div>
                <div className={styles.courseCatalogPage__cardTitle}>
                  {course.name}
                </div>
                <div className={styles.courseCatalogPage__cardInstructor}>
                  <b>Instructor:</b> {course.instructor}
                </div>
                <div className={styles.courseCatalogPage__cardDesc}>
                  {course.description}
                </div>
                <div className={styles.courseCatalogPage__cardActions}>
                  <button
                    className={styles.courseCatalogPage__actionBtn}
                    // onClick={() => ... future enroll or preview ...}
                  >
                    View Details
                  </button>
                  <button
                    className={styles.courseCatalogPage__actionBtn}
                    // onClick={() => ... enroll logic ...}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}