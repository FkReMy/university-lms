/**
 * GradeDistributionChart Component
 * ----------------------------------------------------------
 * Displays grade distribution as a bar chart for assignments/courses.
 *
 * Responsibilities:
 * - Renders a histogram/bar chart of grades as bins or ranges.
 * - Accepts array of grade numbers or pre-binned data.
 * - Handles empty/no data states.
 * - Responsive; can show tooltips and axis labels.
 *
 * Props:
 * - grades: number[]           // Array of numeric grades (0-100 typically)
 * - binSize: number (optional) // Range size per bin (default: 10)
 * - maxGrade: number (optional)// Maximum grade value (default: 100)
 * - chartHeight: number (optional, px, default: 180)
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (for <div>)
 *
 * Usage:
 *   <GradeDistributionChart grades={[98, 84, 72, ...]} />
 */

import { useMemo } from 'react';
import styles from './GradeDistributionChart.module.scss';

function computeBins(grades, binSize, maxGrade) {
  // Returns: [{min, max, count}]
  if (!grades || !grades.length) return [];
  const bins = [];
  const numBins = Math.ceil((maxGrade + 1) / binSize);
  for (let i = 0; i < numBins; ++i) {
    bins.push({ min: i * binSize, max: (i + 1) * binSize - 1, count: 0 });
  }
  grades.forEach((g) => {
    let binIdx = Math.floor(g / binSize);
    if (binIdx >= bins.length) binIdx = bins.length - 1;
    if (binIdx < 0) binIdx = 0;
    bins[binIdx].count += 1;
  });
  // Fix last bin's max for maxGrade
  bins[bins.length - 1].max = maxGrade;
  return bins;
}

export default function GradeDistributionChart({
  grades = [],
  binSize = 10,
  maxGrade = 100,
  chartHeight = 180,
  className = "",
  style = {},
  ...rest
}) {
  // Memoize bins to avoid recompute
  const bins = useMemo(() => computeBins(grades, binSize, maxGrade), [grades, binSize, maxGrade]);
  const maxCount = Math.max(1, ...bins.map(b => b.count));

  // Format bin label (e.g. "70–79")
  function binLabel(bin) {
    return `${bin.min}\u2013${bin.max}`;
  }

  return (
    <div
      className={[styles.gradeDistributionChart, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
      role="region"
      aria-label="Grade distribution chart"
    >
      <div className={styles.gradeDistributionChart__axis}>
        {bins.map(bin => (
          <div className={styles.gradeDistributionChart__tick} key={bin.min}>
            <span className={styles.gradeDistributionChart__tickLabel}>
              {binLabel(bin)}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.gradeDistributionChart__bars} style={{ height: chartHeight }}>
        {bins.map(bin => (
          <div
            className={styles.gradeDistributionChart__barWrap}
            key={bin.min}
            title={`${binLabel(bin)}: ${bin.count}`}
          >
            {/* Chart bar */}
            <div
              className={styles.gradeDistributionChart__bar}
              style={{
                height: bin.count === 0 ? 0 : `${(bin.count / maxCount) * 100}%`
              }}
              aria-valuenow={bin.count}
              aria-valuemax={maxCount}
              aria-label={`${binLabel(bin)}, ${bin.count} student${bin.count !== 1 ? 's' : ''}`}
              role="presentation"
            />
            {/* Count label above bar */}
            {bin.count > 0 && (
              <span className={styles.gradeDistributionChart__countLabel}>
                {bin.count}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* Optional axis label */}
      <div className={styles.gradeDistributionChart__xlabel}>
        Grade Range
      </div>
      {/* Display when no data */}
      {grades.length === 0 && (
        <div className={styles.gradeDistributionChart__empty}>
          No grades to display.
        </div>
      )}
    </div>
  );
}