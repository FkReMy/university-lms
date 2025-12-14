/**
 * GradeDistributionChart Component
 * ----------------------------------------------------------
 * Renders a production-ready, accessible bar histogram of grade ranges.
 *
 * Responsibilities:
 * - Visualizes grade distribution as bars (histogram) with global component styles.
 * - Accepts an array of numeric grades, dynamic binning (default bins of size 10), and max grade.
 * - Handles empty states gracefully.
 * - Uses unified class structure and ARIA roles for accessibility.
 * - No demo/sample logic.
 *
 * Props:
 * - grades: number[]                  // Array of grades (0-100 recommended)
 * - binSize?: number (default: 10)    // How wide each bin/bar is
 * - maxGrade?: number (default: 100)  // Highest possible grade
 * - chartHeight?: number (default: 180)
 * - className?: string
 * - style?: object
 * - ...rest: Spread to outer div
 *
 * Example:
 *   <GradeDistributionChart grades={dataArray} binSize={5} />
 */

import PropTypes from 'prop-types';
import { useMemo } from 'react';

import styles from './GradeDistributionChart.module.scss';

/**
 * Computes the bins for the histogram.
 * @param {number[]} grades - List of student grades
 * @param {number} binSize - Bin step size
 * @param {number} maxGrade - Maximum grade value
 */
function computeBins(grades, binSize, maxGrade) {
  // Guard: No data
  if (!grades || grades.length === 0) return [];
  const bins = [];
  const numBins = Math.ceil((maxGrade + 1) / binSize);
  for (let i = 0; i < numBins; ++i) {
    bins.push({ min: i * binSize, max: (i + 1) * binSize - 1, count: 0 });
  }
  grades.forEach(g => {
    let binIdx = Math.floor(g / binSize);
    if (binIdx >= bins.length) binIdx = bins.length - 1;
    if (binIdx < 0) binIdx = 0;
    bins[binIdx].count += 1;
  });
  // Ensure the last bin has a correct upper bound
  bins[bins.length - 1].max = maxGrade;
  return bins;
}

/**
 * GradeDistributionChart main component.
 */
export default function GradeDistributionChart({
  grades = [],
  binSize = 10,
  maxGrade = 100,
  chartHeight = 180,
  className = '',
  style = {},
  ...rest
}) {
  // Calculate bins memoized for performance
  const bins = useMemo(
    () => computeBins(grades, binSize, maxGrade),
    [grades, binSize, maxGrade]
  );
  // Used to normalize bar heights
  const maxCount = Math.max(1, ...bins.map(b => b.count));

  // Label formatter for axes/titles
  function binLabel(bin) {
    return `${bin.min}\u2013${bin.max}`;
  }

  return (
    <div
      className={[styles.gradeDistributionChart, className].filter(Boolean).join(' ')}
      style={style}
      role="region"
      aria-label="Grade distribution chart"
      {...rest}
    >
      {/* X-axis tick labels */}
      <div className={styles.gradeDistributionChart__axis}>
        {bins.map(bin => (
          <div className={styles.gradeDistributionChart__tick} key={bin.min}>
            <span className={styles.gradeDistributionChart__tickLabel}>
              {binLabel(bin)}
            </span>
          </div>
        ))}
      </div>

      {/* Bar chart area */}
      <div className={styles.gradeDistributionChart__bars} style={{ height: chartHeight }}>
        {bins.map(bin => (
          <div
            className={styles.gradeDistributionChart__barWrap}
            key={bin.min}
            title={`${binLabel(bin)}: ${bin.count}`}
          >
            <div
              className={styles.gradeDistributionChart__bar}
              style={{
                height: bin.count === 0 ? 0 : `${(bin.count / maxCount) * 100}%`
              }}
              aria-label={`${binLabel(bin)}, ${bin.count} student${bin.count !== 1 ? 's' : ''}`}
            />
            {bin.count > 0 && (
              <span className={styles.gradeDistributionChart__countLabel}>
                {bin.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Axis label */}
      <div className={styles.gradeDistributionChart__xlabel}>
        Grade Range
      </div>

      {/* Empty grades fallback */}
      {grades.length === 0 && (
        <div className={styles.gradeDistributionChart__empty}>
          No grades to display.
        </div>
      )}
    </div>
  );
}

GradeDistributionChart.propTypes = {
  grades: PropTypes.arrayOf(PropTypes.number),
  binSize: PropTypes.number,
  maxGrade: PropTypes.number,
  chartHeight: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};