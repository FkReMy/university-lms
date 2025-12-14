/**
 * FileUploadItem Component
 * ----------------------------------------------------------------------------
 * Global, accessible file upload item for LMS UI.
 * - Displays file icon, name, size, status/progress, and remove button.
 * - Follows design system for all layout/state.
 * - No sample/demo logic; extensible for backend/async flows.
 *
 * Props:
 * - file: File | { name, size, type, status?, progress? } (required)
 * - onRemove?: function()      // Callback when remove ("×") button is clicked
 * - status?: "uploading" | "done" | "error" (overrides file.status if given)
 * - progress?: number (0-100, overrides file.progress if given)
 * - error?: string             // Error message if upload failed
 * - className?: string
 * - style?: object
 * - ...rest: other root props
 */

import PropTypes from 'prop-types';
import styles from './FileUploadItem.module.scss';

// Map file type to a global icon (for full prod: use design system, not emoji)
const fileTypeIcon = (type = "", name = "") => {
  if (type.startsWith("image/")) return (<span role="img" aria-label="Image">🖼️</span>);
  if (type.startsWith("video/")) return (<span role="img" aria-label="Video">🎞️</span>);
  if (type === "application/pdf" || name.endsWith(".pdf")) return (<span role="img" aria-label="PDF">📄</span>);
  if (type.includes("excel") || name.match(/\.(csv|xls|xlsx)$/i)) return (<span role="img" aria-label="Spreadsheet">📊</span>);
  if (type.includes("word") || name.match(/\.(doc|docx)$/i)) return (<span role="img" aria-label="Document">📄</span>);
  return (<span role="img" aria-label="File">📁</span>);
};

// Format file size to KB/MB readable
function formatSize(size) {
  if (size == null || isNaN(size)) return '';
  const kb = size / 1024;
  if (kb < 1000) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function FileUploadItem({
  file,
  onRemove,
  status,
  progress,
  error,
  className = "",
  style = {},
  ...rest
}) {
  // Normalize file object: supports native File or shape
  const {
    name = "",
    size,
    type = "",
    status: fileStatus,
    progress: fileProgress,
  } = typeof file === "object" && file ? file : {};

  const resolvedStatus = status ?? fileStatus ?? "done";
  const resolvedProgress = progress != null
    ? progress
    : (fileProgress != null
      ? fileProgress
      : (resolvedStatus === "done" ? 100 : 0)
    );

  // Status label (descriptive)
  let statusLabel = null;
  if (resolvedStatus === "uploading") statusLabel = "Uploading…";
  if (resolvedStatus === "done") statusLabel = "Uploaded";
  if (resolvedStatus === "error") statusLabel = error || "Upload failed";

  // Classes for status
  const rootClass = [
    styles.fileUploadItem,
    styles[`fileUploadItem--${resolvedStatus}`] || "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClass} style={style} {...rest}>
      {/* File type icon */}
      <div className={styles.fileUploadItem__icon}>
        {fileTypeIcon(type, name)}
      </div>
      {/* Name, size, and status/progress */}
      <div className={styles.fileUploadItem__info}>
        <div className={styles.fileUploadItem__name} title={name}>{name}</div>
        <div className={styles.fileUploadItem__meta}>
          <span className={styles.fileUploadItem__size}>{formatSize(size)}</span>
        </div>
        <div className={styles.fileUploadItem__statusLine}>
          {resolvedStatus === "uploading" ? (
            <div className={styles.fileUploadItem__progressWrap}>
              <div className={styles.fileUploadItem__progressBar}>
                <div
                  className={styles.fileUploadItem__progress}
                  style={{ width: `${resolvedProgress}%` }}
                />
              </div>
              <span className={styles.fileUploadItem__progressText}>
                {Math.round(resolvedProgress)}%
              </span>
            </div>
          ) : (
            <span
              className={[
                styles.fileUploadItem__statusText,
                resolvedStatus === "error" ? styles['fileUploadItem__statusText--error'] : ""
              ].filter(Boolean).join(' ')}
            >
              {statusLabel}
            </span>
          )}
        </div>
      </div>
      {/* Remove button */}
      {onRemove && (
        <button
          className={styles.fileUploadItem__remove}
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name || "file"}`}
        >
          ×
        </button>
      )}
    </div>
  );
}

FileUploadItem.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
    PropTypes.instanceOf(File),
  ]).isRequired,
  onRemove: PropTypes.func,
  status: PropTypes.oneOf(['uploading', 'done', 'error']),
  progress: PropTypes.number,
  error: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - All status/size/type/label/UI rules use design system (FileUploadItem.module.scss).
 * - No sample/demo icons; production system should use global Icon library.
 * - No local/sample logic; UX is production-safe and extensible.
 */