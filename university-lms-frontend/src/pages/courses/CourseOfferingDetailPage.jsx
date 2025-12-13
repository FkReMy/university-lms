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
      </div>
    </div>
  );
}
