/**
 * CourseOfferingDetailPage Component (Production)
 * ----------------------------------------------------------------------------
 * Detail view for a specific course offering.
 * - Uses only production APIs (no sample/demo data).
 * - Related offerings and main view unified with global components/system.
 * - Styles, UI, and navigation are consistent LMS-wide.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './CourseOfferingDetailPage.module.scss';

import Button from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import courseApi from '@/services/api/courseApi'; // Must provide .get(id), .list() etc.

function StatusBadge({ status }) {
  if (!status) return null;
  let variant = 'default';
  if (status.toLowerCase() === 'active') variant = 'success';
  if (status.toLowerCase() === 'closed') variant = 'danger';
  if (status.toLowerCase() === 'waitlist') variant = 'warning';
  // Use a global Badge component if available for visual consistency
  return (
    <span className={styles.detailPage__status + ' status-' + status.toLowerCase()}>
      {status}
    </span>
  );
}

export default function CourseOfferingDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState(null);
  const [allOfferings, setAllOfferings] = useState([]);

  // Fetch main course offering and all for "related"
  useEffect(() => {
    let isActive = true;
    async function fetchData() {
      setLoading(true);
      try {
        const main = await courseApi.get(courseId);
        const all = await courseApi.list();
        if (isActive) {
          setOffering(main || null);
          setAllOfferings(Array.isArray(all) ? all : []);
        }
      } catch (err) {
        setOffering(null);
      } finally {
        if (isActive) setLoading(false);
      }
    }
    fetchData();
    return () => { isActive = false; };
  }, [courseId]);

  // Related: same dept, not this course
  const related = useMemo(
    () =>
      allOfferings.filter(
        (o) => String(o.id) !== String(courseId) && o.dept === offering?.dept
      ),
    [allOfferings, courseId, offering?.dept]
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

/**
 * Production Notes:
 * - No demo or sample data; loads data from global courseApi only.
 * - Status badge uses centralized CSS classes; replace with global Badge if available.
 * - Related offerings are dynamically computed and displayed (same dept, not current).
 * - All navigation/actions ready for further expansion (e.g., enroll/join).
 */