/**
 * Table Component
 * ----------------------------------------------------------------------------
 * Global, accessible, scalable table UI for LMS.
 * - Accepts design-system columns/data array OR full custom children (thead/tbody).
 * - Handles ARIA, theming, empty state, footer, and cell/column alignment.
 * - No sample/demo code—production only.
 *
 * Props (columns/data mode):
 * - columns: Array<{ key, label, align?, render? }>
 * - data: Array<object>
 * - className?: string        // Wrapper classes
 * - tableClassName?: string   // Table element classes
 * - empty?: ReactNode         // Empty state node/text
 * - footer?: ReactNode
 * - ...rest: props for <table>
 *
 * Props (custom mode):
 * - children?: ReactNode      // Custom <thead>, <tbody>, etc.
 * - ...rest: props for <table>
 */

import PropTypes from 'prop-types';
import styles from './table.module.scss';

export default function Table({
  columns,
  data,
  children,
  className = '',
  tableClassName = '',
  empty = 'No data available.',
  footer,
  ...rest
}) {
  const wrapperClass = [styles.table__wrapper, className].filter(Boolean).join(' ');
  const tblClass = [styles.table, tableClassName].filter(Boolean).join(' ');

  // Standard columns/data approach
  if (Array.isArray(columns) && Array.isArray(data)) {
    return (
      <div className={wrapperClass}>
        <table className={tblClass} {...rest}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ textAlign: col.align || 'left' }}
                  className={styles.table__header}
                  scope="col"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={styles.table__empty}
                  style={{ textAlign: 'center' }}
                >
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                      className={styles.table__cell}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {footer && <div className={styles.table__footer}>{footer}</div>}
      </div>
    );
  }

  // Custom children mode (<thead>/<tbody> provided manually)
  return (
    <div className={wrapperClass}>
      <table className={tblClass} {...rest}>
        {children}
      </table>
      {footer && <div className={styles.table__footer}>{footer}</div>}
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    })
  ),
  data: PropTypes.array,
  children: PropTypes.node,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
  empty: PropTypes.node,
  footer: PropTypes.node,
};

/**
 * Production/Architecture Notes:
 * - No sample/local/demo usage—only design-system columns/props or full custom slot.
 * - All spacing, typography, row/cell color, and empty/footer regions are global.
 * - Ready for backend-driven or dynamic UIs at any scale.
 */