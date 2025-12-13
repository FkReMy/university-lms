/**
 * Table Component
 * ----------------------------------------------------------
 * A reusable, accessible table component for the LMS UI, styled with CSS modules.
 *
 * Responsibilities:
 * - Render tabular data with optional custom header/footer.
 * - Support col/row spanning, accessibility, and empty state.
 * - Accepts an array of columns and data OR children for max flexibility.
 * - Forwards common props to the table element.
 *
 * Props (when using columns/data):
 * - columns: Array<{ key: string, label: ReactNode, align?: 'left'|'center'|'right', render?: (row) => ReactNode }>
 * - data: Array<object> (array of row data)
 * - className: string (wrapper, optional)
 * - tableClassName: string (table element, optional)
 * - empty: ReactNode (shown if data.length === 0)
 * - footer: ReactNode (optional, rendered below table)
 * - ...rest: other props passed to <table>
 *
 * Props (when using children):
 * - children: ReactNode (expects <thead>, <tbody>, etc.)
 * - ...rest: other props passed to <table>
 *
 * Usage (columns/data):
 *   <Table
 *     columns={[
 *       { key: "name", label: "Name" },
 *       { key: "email", label: "Email" },
 *       { key: "actions", label: "Actions", render: row => <Actions row={row} /> }
 *     ]}
 *     data={rows}
 *     empty="No users found."
 *   />
 *
 * Usage (custom):
 *   <Table>
 *     <thead>...</thead>
 *     <tbody>...</tbody>
 *   </Table>
 */

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
  // Compose class names for the wrapper and the <table>
  const wrapperClass = [styles.table__wrapper, className].filter(Boolean).join(' ');
  const tblClass = [styles.table, tableClassName].filter(Boolean).join(' ');

  // If using columns/data API
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

  // If using custom children API (manually provide <thead>, <tbody>, etc.)
  return (
    <div className={wrapperClass}>
      <table className={tblClass} {...rest}>
        {children}
      </table>
      {footer && <div className={styles.table__footer}>{footer}</div>}
    </div>
  );
}