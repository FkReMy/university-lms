/**
 * CourseOfferingsPage Component
 * ----------------------------------------------------------
 * Browse and filter all course offerings available for enrollment/viewing.
 *
 * Responsibilities:
 * - Lists all course offerings with search and term/department filters.
 * - Uses shared UI components (Input, Select, Button) for consistent look/feel.
 * - Renders course cards with main attributes and a link/details action.
 * - Prepared for connection to backend API and expansion.
 *
 * Usage:
 *   <Route path="/courses" element={<CourseOfferingsPage />} />
 */

import { useEffect, useState } from 'react';

import Input from '../../components/ui/input';   // consistent styled input
import Select from '../../components/ui/select'; // consistent styled select
import Button from '../../components/ui/button'; // consistent styled button

import styles from './CourseOfferingsPage.module.scss';

export default function CourseOfferingsPage() {
  // Demo: pretend course offering data
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('all');
  const [dept, setDept] = useState('all');

  // Simulate load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOfferings([
        {
          id: 11,
          dept: 'CSCI',
          course: 'CSCI 101',
          courseName: 'Introduction to Computer Science',
          instructor: 'Dr. Smith',
          term: 'Spring 2025',
          schedule: 'Mon/Wed 10:30-12:00',
          credits: 4,
          status: 'Active',
          enrollment: 32
        },
        {
          id: 12,
          dept: 'MATH',
          course: 'MATH 120',
          courseName: 'Calculus I',
          instructor: 'Prof. White',
          term: 'Spring 2025',
          schedule: 'Tue/Thu 09:30-11:00',
          credits: 4,
          status: 'Active',
          enrollment: 41
        },
        {
          id: 13,
          dept: 'CSCI',
          course: 'CSCI 201',
          courseName: 'Algorithms',
          instructor: 'Dr. Lee',
          term: 'Fall 2024',
          schedule: 'Tue/Thu 14:00-15:30',
          credits: 3,
          status: 'Closed',
          enrollment: 50
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // All available terms and departments in data, for select options
  const terms = Array.from(new Set(['all', ...offerings.map(o => o.term)])).sort();
  const depts = Array.from(new Set(['all', ...offerings.map(o => o.dept)])).sort();

  // Basic filter logic: search by text, filter by term/department
  const filtered = offerings.filter(o =>
    (term === 'all' || o.term === term) &&
    (dept === 'all' || o.dept === dept) &&
    (
      o.course.toLowerCase().includes(search.toLowerCase()) ||
      o.courseName.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Status badge utility (see previous pattern)
  function statusBadge(status) {
    let bg = "#dedede", color = "#213050";
    if (!status) return null;
    if (status.toLowerCase() === "active")   { bg = "#e5ffe9"; color = "#179a4e"; }
    if (status.toLowerCase() === "closed")   { bg = "#fbeaea"; color = "#e62727"; }
    if (status.toLowerCase() === "waitlist") { bg = "#fff6e0"; color = "#e67e22"; }
    return (
      <span
        style={{
          background: bg,
          color: color,
          fontWeight: 600,
          borderRadius: "1em",
          padding: "0.11em 0.94em",
          fontSize: "0.98em",
          marginLeft: "0.34em"
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className={styles.courseOfferingsPage}>
      <h1 className={styles.courseOfferingsPage__title}>Course Offerings</h1>
      {/* Filters row - use UI kit components */}
      <form
        className={styles.courseOfferingsPage__filters}
        tabIndex={0}
        aria-label="Course offering filters"
        onSubmit={e => e.preventDefault()}
      >
        <Input
          className={styles.courseOfferingsPage__filterInput}
          placeholder="Search course or title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
          aria-label="Search for course"
        />
        <Select
          className={styles.courseOfferingsPage__filterSelect}
          value={term}
          onChange={e => setTerm(e.target.value)}
          aria-label="Filter by term"
        >
          {terms.map(t => (
            <option value={t} key={t}>{t === "all" ? "All Terms" : t}</option>
          ))}
        </Select>
        <Select
          className={styles.courseOfferingsPage__filterSelect}
          value={dept}
          onChange={e => setDept(e.target.value)}
          aria-label="Filter by department"
        >
          {depts.map(d => (
            <option value={d} key={d}>{d === "all" ? "All Departments" : d}</option>
          ))}
        </Select>
        <Button
          className={styles.courseOfferingsPage__filterBtn}
          type="button"
          variant="primary"
          onClick={() => {/* Could trigger search/filter, not needed for local state */}}
        >
          Apply
        </Button>
      </form>
      {/* Main course offerings list */}
      <div className={styles.courseOfferingsPage__listArea}>
        {loading ? (
          <div className={styles.courseOfferingsPage__loading}>Loading offerings…</div>
        ) : filtered.length === 0 ? (
          <div className={styles.courseOfferingsPage__empty}>No offerings found.</div>
        ) : (
          <div className={styles.courseOfferingsPage__cardsGrid}>
            {filtered.map(offering => (
              <div className={styles.courseOfferingsPage__card} key={offering.id}>
                <div className={styles.courseOfferingsPage__codeRow}>
                  <span className={styles.courseOfferingsPage__code}>{offering.course}</span>
                  {statusBadge(offering.status)}
                </div>
                <div className={styles.courseOfferingsPage__name}>{offering.courseName}</div>
                <div className={styles.courseOfferingsPage__meta}>
                  <span>Term: <b>{offering.term}</b></span>
                  <span>Dept: <b>{offering.dept}</b></span>
                </div>
                <div className={styles.courseOfferingsPage__meta}>
                  <span>Instructor: <b>{offering.instructor}</b></span>
                  <span>Enrolled: <b>{offering.enrollment}</b></span>
                </div>
                <div className={styles.courseOfferingsPage__meta}>
                  <span>Credits: <b>{offering.credits}</b></span>
                  <span>Schedule: <b>{offering.schedule}</b></span>
                </div>
                <Button
                  className={styles.courseOfferingsPage__detailsBtn}
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = `/courses/${offering.id}`}
                  aria-label={`View details for ${offering.courseName}`}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Notes:
 * - Uses Input, Select, Button components from your shared UI kit for all search/filter/form controls.
 * - Course cards include a strongly-typed path for details (`/courses/${offering.id}`) matching route layout.
 * - Status badge logic is consistent and can be moved to a utility/helper if reused elsewhere.
 * - Replace window.location.href with navigate(...) from react-router if SPA navigation is needed.
 */