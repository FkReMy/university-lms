/**
 * FileUploadItem Component
 * ----------------------------------------------------------
 * Displays an individual uploaded file (or selected-for-upload file) in a list.
 *
 * Responsibilities:
 * - Shows file name, file size, optional preview icon (by type), and upload progress/status.
 * - Provides a remove/delete button.
 * - Can show upload progress bar or statuses: completed, error, uploading, etc.
 *
 * Props:
 * - file: File | { name, size, type, status?, progress? } (required)
 * - onRemove: function() (optional)   - Called when remove button clicked
 * - status: "uploading" | "done" | "error" (optional; overrides file.status)
 * - progress: number (0-100, optional; for uploading; overrides file.progress)
 * - error: string (optional)         - Error message if upload failed
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest: (other wrapper props)
 *
 * Usage:
 *   <FileUploadItem
 *     file={fileObj}
 *     onRemove={() => {}}
 *     status="uploading"
 *     progress={70}
 *     error="Network error"
 *   />
 */

import styles from './FileUploadItem.module.scss';

// File type → icon mapping (SVGs or emoji for demo; replace for production)
const fileTypeIcon = (type = "", name = "") => {
  if (type.startsWith("image/")) return <span role="img" aria-label="Image">🖼️</span>;
  if (type.startsWith("video/")) return <span role="img" aria-label="Video">🎞️</span>;
  if (type === "application/pdf" || name.endsWith(".pdf")) return <span role="img" aria-label="PDF">📄</span>;
  if (type.includes("excel") || name.match(/\.(csv|xls|xlsx)$/i)) return <span role="img" aria-label="Spreadsheet">📊</span>;
  if (type.includes("word") || name.match(/\.(doc|docx)$/i)) return <span role="img" aria-label="Doc">📄</span>;
  return <span role="img" aria-label="File">📁</span>;
};

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
  // File info normalization (support native File or supplied object)
  const {
    name = "",
    size,
    type = "",
    status: fileStatus,
    progress: fileProgress
  } = typeof file === "object" && file ? file : {};

  const resolvedStatus = status ?? fileStatus ?? "done";
  const resolvedProgress = progress != null ? progress : (fileProgress ?? (resolvedStatus === "done" ? 100 : 0));

  // Status text for error or status label
  let statusLabel = null;
  if (resolvedStatus === "uploading") statusLabel = "Uploading…";
  if (resolvedStatus === "done") statusLabel = "Uploaded";
  if (resolvedStatus === "error") statusLabel = error || "Upload failed";

  // Compose wrapper class
  const rootClass = [
    styles.fileUploadItem,
    styles[`fileUploadItem--${resolvedStatus}`] || "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClass} style={style} {...rest}>
      {/* Icon/preview */}
      <div className={styles.fileUploadItem__icon}>
        {fileTypeIcon(type, name)}
      </div>
      {/* Name and size */}
      <div className={styles.fileUploadItem__info}>
        <div className={styles.fileUploadItem__name} title={name}>{name}</div>
        <div className={styles.fileUploadItem__meta}>
          <span className={styles.fileUploadItem__size}>{formatSize(size)}</span>
        </div>
        {/* Status/progress/error display, underneath */}
        <div className={styles.fileUploadItem__statusLine}>
          {resolvedStatus === "uploading" && (
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
          )}
          {resolvedStatus !== "uploading" && (
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
      {/* Remove button (right side) */}
      {onRemove && (
        <button
          className={styles.fileUploadItem__remove}
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name || "file"}`}
        >
          ✕
        </button>
      )}
    </div>
  );
}