/**
 * CourseCatalogPage Component
 * ----------------------------------------------------------
 * Main course catalog view for all users: browse, search, and filter courses.
 *
 * Responsibilities:
 * - Lists available courses in a responsive card/list view.
 * - Uses CourseCard component for every course (not manual markup!).
 * - Allows searching/filtering by keyword, department, instructor, and credits.
 * - Ready for expansion: enroll/view details actions.
 * - All controls are design-system Input/Select components for consistency.
 *
 * Usage:
 *   <Route path="/courses" element={<CourseCatalogPage />} />
 */

import { useEffect, useState } from 'react';

import Input from '../../components/ui/input';      // design-system input
import Select from '../../components/ui/select';    // design-system select
import CourseCard from '../../components/courses/CourseCard'; // reusable course card

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
        <Input
          className={styles.courseCatalogPage__search}
          type="text"
          placeholder="Search course name, code, or instructor…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.courseCatalogPage__departmentSelect}
          value={department}
          onChange={e => setDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dep => (
            <option value={dep} key={dep}>{dep}</option>
          ))}
        </Select>
        <Select
          className={styles.courseCatalogPage__creditsSelect}
          value={credits}
          onChange={e => setCredits(e.target.value)}
        >
          <option value="all">All Credits</option>
          {creditOptions.map(cr => (
            <option value={cr} key={cr}>{cr} credits</option>
          ))}
        </Select>
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
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                // You can pass additional props for onView, onEnroll, etc.
                // Example:
                // onView={() => ...}
                // onEnroll={() => ...}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Improvements:
 * - Uses CourseCard for every item (no duplicated card markup).
 * - All filter/search controls use Input/Select for design consistency.
 * - Expansion (enroll/view/preview actions) goes in CourseCard; no duplication needed here.
 */
