/**
 * CourseOfferingDetailPage Component
 * ----------------------------------------------------------
 * Detail view for a specific course offering.
 *
 * Responsibilities:
 * - Displays full information about a course offering
 * - Shows enrollment status, schedule, assignments, etc.
 * - Allows students to enroll or view course materials
 * - Uses route parameter to fetch course data
 *
 * Usage:
 *   <Route path="/courses/:courseId" element={<CourseOfferingDetailPage />} />
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Button from '../../components/ui/button';
import { ROUTES } from '@/lib/constants';
import styles from './CourseOfferingDetailPage.module.scss';

export default function CourseOfferingDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Simulate API call to fetch course details
    setTimeout(() => {
      // Mock course data
      const mockCourse = {
        id: courseId,
        code: 'CSCI 101',
        name: 'Introduction to Computer Science',
        dept: 'CSCI',
        instructor: 'Dr. Smith',
        instructorEmail: 'smith@university.edu',
        term: 'Spring 2025',
        schedule: 'Mon/Wed 10:30-12:00',
        location: 'Science Building, Room 201',
        credits: 4,
        status: 'Active',
        enrollment: 32,
        capacity: 50,
        description: 'An introduction to computer science covering fundamental programming concepts, data structures, and problem-solving techniques.',
        syllabus: '/files/csci101-syllabus.pdf',
        prerequisites: 'None',
      };
      
      setCourse(mockCourse);
      setLoading(false);
    }, 600);
  }, [courseId]);

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.detailPage__loading}>Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import styles from './CourseOfferingsPage.module.scss';
import Button from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

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
    description: 'Learn the foundations of computing, algorithms, and programming.',
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
    description: 'Limits, derivatives, and integrals with real-world applications.',
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
    description: 'Design and analysis of algorithms with complexity considerations.',
  },
];

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

  function statusBadge(status) {
    let bg = "#dedede", color = "#213050";
    if (!status) return null;
    if (status.toLowerCase() === "active")   { bg = "#e5ffe9"; color = "#179a4e"; }
    if (status.toLowerCase() === "closed")   { bg = "#fbeaea"; color = "#e62727"; }
    if (status.toLowerCase() === "waitlist") { bg = "#fff6e0"; color = "#e67e22"; }
    return (
      <div className={styles.detailPage}>
        <div className={styles.detailPage__error}>
          <h2>Course Not Found</h2>
          <p>The course you're looking for could not be found.</p>
          <Button onClick={() => navigate(ROUTES.COURSES)}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.courseOfferingsPage__loading}>Loading course…</div>;
  }

  if (!offering) {
    return (
      <div className={styles.courseOfferingsPage__empty}>
        Course not found.
        <div>
          <Link className={styles.courseOfferingsPage__detailsBtn} to={ROUTES.COURSES}>
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      {/* Header with course info */}
      <div className={styles.detailPage__header}>
        <div className={styles.detailPage__breadcrumb}>
          <Link to={ROUTES.COURSES}>Courses</Link>
          <span> / </span>
          <span>{course.code}</span>
        </div>
        
        <h1 className={styles.detailPage__title}>
          {course.code}: {course.name}
        </h1>
        
        <div className={styles.detailPage__meta}>
          <span className={styles.detailPage__metaItem}>
            <strong>Instructor:</strong> {course.instructor}
          </span>
          <span className={styles.detailPage__metaItem}>
            <strong>Term:</strong> {course.term}
          </span>
          <span className={styles.detailPage__metaItem}>
            <strong>Credits:</strong> {course.credits}
          </span>
          <span className={styles.detailPage__metaItem}>
            <strong>Status:</strong> {course.status}
          </span>
        </div>
      </div>

      {/* Course details */}
      <div className={styles.detailPage__content}>
        <section className={styles.detailPage__section}>
          <h2>Course Description</h2>
          <p>{course.description}</p>
        </section>

        <section className={styles.detailPage__section}>
          <h2>Schedule & Location</h2>
          <div className={styles.detailPage__scheduleGrid}>
            <div>
              <strong>Meeting Times:</strong>
              <p>{course.schedule}</p>
            </div>
            <div>
              <strong>Location:</strong>
              <p>{course.location}</p>
            </div>
          </div>
        </section>

        <section className={styles.detailPage__section}>
          <h2>Enrollment</h2>
          <div className={styles.detailPage__enrollment}>
            <div className={styles.detailPage__enrollmentBar}>
              <div 
                className={styles.detailPage__enrollmentFill}
                style={{ width: `${(course.enrollment / course.capacity) * 100}%` }}
              />
            </div>
            <p>{course.enrollment} / {course.capacity} students enrolled</p>
          </div>
        </section>

        {course.prerequisites && (
          <section className={styles.detailPage__section}>
            <h2>Prerequisites</h2>
            <p>{course.prerequisites}</p>
          </section>
        )}

        {course.syllabus && (
          <section className={styles.detailPage__section}>
            <h2>Course Materials</h2>
            <a href={course.syllabus} className={styles.detailPage__link}>
              Download Syllabus
            </a>
          </section>
        )}

        <div className={styles.detailPage__actions}>
          <Button variant="primary">Enroll in Course</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.COURSES)}>
            Back to Courses
          </Button>
        </div>
    <div className={styles.courseOfferingsPage}>
      <h1 className={styles.courseOfferingsPage__title}>
        {offering.course}: {offering.courseName} {statusBadge(offering.status)}
      </h1>
      <div className={styles.courseOfferingsPage__meta}>
        <span>Term: <b>{offering.term}</b></span>
        <span>Dept: <b>{offering.dept}</b></span>
        <span>Credits: <b>{offering.credits}</b></span>
        <span>Schedule: <b>{offering.schedule}</b></span>
      </div>
      <p className={styles.courseOfferingsPage__name}>{offering.description}</p>

      <div className={styles.courseOfferingsPage__meta}>
        <span>Instructor: <b>{offering.instructor}</b></span>
        <span>Enrolled: <b>{offering.enrollment}</b></span>
      </div>

      <div className={styles.courseOfferingsPage__actionsRow}>
        <Button
          variant="primary"
          type="button"
          onClick={() => navigate(ROUTES.ASSIGNMENTS)}
        >
          View assignments
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => navigate(ROUTES.COURSES)}
        >
          Back to courses
        </Button>
      </div>

      {related.length > 0 && (
        <div className={styles.courseOfferingsPage__cardsGrid}>
          {related.map((course) => (
            <div className={styles.courseOfferingsPage__card} key={course.id}>
              <div className={styles.courseOfferingsPage__codeRow}>
                <span className={styles.courseOfferingsPage__code}>{course.course}</span>
                {statusBadge(course.status)}
              </div>
              <div className={styles.courseOfferingsPage__name}>{course.courseName}</div>
              <div className={styles.courseOfferingsPage__meta}>
                <span>Term: <b>{course.term}</b></span>
                <span>Schedule: <b>{course.schedule}</b></span>
              </div>
              <Button
                className={styles.courseOfferingsPage__detailsBtn}
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
