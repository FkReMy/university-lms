/**
 * CourseOfferingDetailPage Component
 * ----------------------------------------------------------
 * Detail view for a specific course offering.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import styles from './CourseOfferingDetailPage.module.scss';

const DEMO_OFFERINGS = [
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
    enrollment: 32,
    capacity: 50,
    description: 'Learn the foundations of computing, algorithms, and programming.',
    location: 'Science Building, Room 201',
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
    enrollment: 41,
    capacity: 50,
    description: 'Limits, derivatives, and integrals with real-world applications.',
    location: 'Math Hall, Room 204',
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
    enrollment: 50,
    capacity: 50,
    description: 'Design and analysis of algorithms with complexity considerations.',
    location: 'Science Building, Room 305',
  },
];

function StatusBadge({ status }) {
  if (!status) return null;
  let bg = '#dedede';
  let color = '#213050';
  if (status.toLowerCase() === 'active') { bg = '#e5ffe9'; color = '#179a4e'; }
  if (status.toLowerCase() === 'closed') { bg = '#fbeaea'; color = '#e62727'; }
  if (status.toLowerCase() === 'waitlist') { bg = '#fff6e0'; color = '#e67e22'; }
  return (
    <span
      className={styles.detailPage__status}
      style={{ background: bg, color }}
    >
      {status}
    </span>
  );
}

export default function CourseOfferingDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const match = DEMO_OFFERINGS.find((o) => String(o.id) === String(courseId));
      setOffering(match || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [courseId]);

  const related = useMemo(
    () => DEMO_OFFERINGS.filter((o) => String(o.id) !== String(courseId) && o.dept === offering?.dept),
    [courseId, offering?.dept]
  );

  if (loading) {
    return <div className={styles.detailPage__loading}>Loading course…</div>;
  }

  if (!offering) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.detailPage__error}>
          <h2>Course Not Found</h2>
          <p>The course you&apos;re looking for could not be found.</p>
          <Button onClick={() => navigate(ROUTES.COURSES)}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailPage__breadcrumb}>
        <Link to={ROUTES.COURSES}>Courses</Link>
        <span> / </span>
        <span>{offering.course}</span>
      </div>

      <h1 className={styles.detailPage__title}>
        {offering.course}: {offering.courseName} <StatusBadge status={offering.status} />
      </h1>

      <div className={styles.detailPage__meta}>
        <span><strong>Term:</strong> {offering.term}</span>
        <span><strong>Dept:</strong> {offering.dept}</span>
        <span><strong>Credits:</strong> {offering.credits}</span>
        <span><strong>Schedule:</strong> {offering.schedule}</span>
        <span><strong>Location:</strong> {offering.location}</span>
      </div>

      <p className={styles.detailPage__description}>{offering.description}</p>

      <div className={styles.detailPage__actions}>
        <Button variant="primary" type="button" onClick={() => navigate(ROUTES.ASSIGNMENTS)}>
          View assignments
        </Button>
        <Button variant="outline" type="button" onClick={() => navigate(ROUTES.COURSES)}>
          Back to courses
        </Button>
      </div>

      {related.length > 0 && (
        <div className={styles.detailPage__related}>
          <h2>Related courses</h2>
          <div className={styles.detailPage__cardsGrid}>
            {related.map((course) => (
              <div className={styles.detailPage__card} key={course.id}>
                <div className={styles.detailPage__cardHeader}>
                  <span className={styles.detailPage__code}>{course.course}</span>
                  <StatusBadge status={course.status} />
                </div>
                <div className={styles.detailPage__name}>{course.courseName}</div>
                <div className={styles.detailPage__metaRow}>
                  <span><strong>Term:</strong> {course.term}</span>
                  <span><strong>Schedule:</strong> {course.schedule}</span>
                </div>
                <Button
                  className={styles.detailPage__detailsBtn}
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
