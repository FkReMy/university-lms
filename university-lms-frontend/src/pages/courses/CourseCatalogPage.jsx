/**
 * CourseCatalogPage Component (Production)
 * ----------------------------------------------------------------------------
 * Responsive, unified LMS course catalog for all users.
 * - Lists available courses using global <CourseCard>.
 * - All filters and search use global design-system Input/Select.
 * - Wired for backend integration (no demo/sample data).
 * - Designed for expansion: enroll/view actions via CourseCard props.
 */

import { useEffect, useState, useMemo } from 'react';

import CourseCard from '@/components/courses/CourseCard';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import styles from './CourseCatalogPage.module.scss';

import courseApi from '@/services/api/courseApi'; // Needs to be implemented: .list()

export default function CourseCatalogPage() {
  // Unified catalog/filter state
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [credits, setCredits] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load course catalog from backend on mount
  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const data = await courseApi.list(); // Should return array [{...}]
        setCourses(data || []);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Departments and credits dropdowns from loaded data (as unique, sorted arrays)
  const departments = useMemo(
    () => [...new Set(courses.map((c) => c.department))].filter(Boolean).sort(),
    [courses]
  );
  const creditOptions = useMemo(
    () => [...new Set(courses.map((c) => c.credits))].filter(Boolean).sort((a, b) => a - b),
    [courses]
  );

  // Unified filter logic
  const filteredCourses = useMemo(
    () => courses.filter((course) => {
      const matchesSearch =
        course.name?.toLowerCase().includes(search.toLowerCase()) ||
        course.code?.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment =
        department === 'all' || course.department === department;
      const matchesCredits =
        credits === 'all' || course.credits === Number(credits);
      return matchesSearch && matchesDepartment && matchesCredits;
    }),
    [courses, search, department, credits]
  );

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
                // Add onView, onEnroll etc. props for further expansion
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - Uses only real backend API for fetching courses.
 * - All design and UI logic is unified through global components.
 * - Expansion with actions/props handled in CourseCard (don't duplicate card layout here).
 * - No demo/sample course data exists in this version—everything is real/prod.
 */