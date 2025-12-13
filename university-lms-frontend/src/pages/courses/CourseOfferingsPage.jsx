/**
 * CourseOfferingsPage Component
 * ----------------------------------------------------------
 * Page for listing and managing course sections/offerings for a semester or term.
 *
 * Responsibilities:
 * - Lists all active course sections (term, code, instructor, time, enrollment).
 * - Allows searching/filtering by term, course, or instructor.
 * - Ready for expansion: open new section, edit, or close offerings.
 *
 * Usage:
 *   <Route path="/offerings" element={<CourseOfferingsPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './CourseOfferingsPage.module.scss';

export default function CourseOfferingsPage() {
  // State for course offerings and filters
  const [offerings, setOfferings] = useState([]);
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate fetching offerings
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOfferings([
        {
          id: 1,
          term: 'Spring 2025',
          course: 'CSCI 101',
          name: 'Introduction to Computer Science',
          instructor: 'Dr. Smith',
          schedule: 'Mon/Wed 10:30-12:00',
          enrolled: 32
        },
        {
          id: 2,
          term: 'Spring 2025',
          course: 'MATH 195',
          name: 'Calculus I',
          instructor: 'Dr. Kapoor',
          schedule: 'Tue/Thu 09:00-10:20',
          enrolled: 38
        },
        {
          id: 3,
          term: 'Spring 2025',
          course: 'BUS 240',
          name: 'Business Communication',
          instructor: 'Dr. Turner',
          schedule: 'Fri 12:00-14:00',
          enrolled: 19
        },
        {
          id: 4,
          term: 'Fall 2024',
          course: 'CSCI 220',
          name: 'Data Structures',
          instructor: 'Prof. Chen',
          schedule: 'Tue/Thu 13:30-15:00',
          enrolled: 40
        }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Find all unique terms for filter dropdown
  const terms = [
    ...new Set(offerings.map((off) => off.term)),
  ].sort();

  // Filtered offerings
  const filteredOfferings = offerings.filter((off) => {
    const matchesSearch =
      off.name.toLowerCase().includes(search.toLowerCase()) ||
      off.course.toLowerCase().includes(search.toLowerCase()) ||
      off.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesTerm = term === 'all' || off.term === term;
    return matchesSearch && matchesTerm;
  });

  return (
    <div className={styles.courseOfferingsPage}>
      <h1 className={styles.courseOfferingsPage__title}>Course Offerings</h1>
      <div className={styles.courseOfferingsPage__controls}>
        <input
          className={styles.courseOfferingsPage__search}
          type="text"
          placeholder="Search by course name, code, or instructor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.courseOfferingsPage__termSelect}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        >
          <option value="all">All Terms</option>
          {terms.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          className={styles.courseOfferingsPage__addBtn}
          type="button"
          // onClick={() => ... future add section dialog ...}
        >
          + New Section
        </button>
      </div>
      <div className={styles.courseOfferingsPage__listArea}>
        {loading ? (
          <div className={styles.courseOfferingsPage__loading}>
            Loading course offerings…
          </div>
        ) : filteredOfferings.length === 0 ? (
          <div className={styles.courseOfferingsPage__empty}>
            No offerings found.
          </div>
        ) : (
          <table className={styles.courseOfferingsPage__table}>
            <thead>
              <tr>
                <th>Term</th>
                <th>Code</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfferings.map((off) => (
                <tr key={off.id}>
                  <td>{off.term}</td>
                  <td>{off.course}</td>
                  <td>{off.name}</td>
                  <td>{off.instructor}</td>
                  <td>{off.schedule}</td>
                  <td>{off.enrolled}</td>
                  <td>
                    <button
                      className={styles.courseOfferingsPage__actionBtn}
                      title="Edit section"
                      // onClick={() => ... future edit dialog ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.courseOfferingsPage__actionBtn}
                      // onClick={() => ... close/cancel logic ...}
                    >
                      Close
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