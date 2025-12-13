/**
 * FileUploadZone Component
 * ----------------------------------------------------------
 * Drag-and-drop file upload area for LMS.
 *
 * Responsibilities:
 * - Shows a dropzone area or a file picker button.
 * - Handles drag events for UX highlight.
 * - Triggers onFiles(files: File[]) when files are picked/dropped.
 * - Shows optional prompt or children as the dropzone content.
 * - Accessible: keyboard, ARIA, focus ring.
 *
 * Props:
 * - onFiles: function(FileList or File[]) (required)   - Triggered when files selected/dropped
 * - accept: string (optional)    - File input accept attribute (e.g. ".pdf,.docx")
 * - multiple: bool (optional)    - Allow multiple file upload
 * - prompt: ReactNode (optional) - Shown when no children
 * - children: ReactNode (optional) - Override content for dropzone
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest: (extra props to <div> root)
 *
 * Usage:
 *   <FileUploadZone
 *     onFiles={handleFiles}
 *     accept=".pdf,.docx"
 *     multiple
 *     prompt="Drag files here or click to upload"
 *   />
 */

import { useCallback, useRef, useState } from 'react';
import styles from './FileUploadZone.module.scss';

export default function FileUploadZone({
  onFiles,
  accept = "",
  multiple = false,
  prompt = "Drag files here or click to upload",
  children,
  className = "",
  style = {},
  ...rest
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  // Drop handler
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) {
      onFiles(Array.from(e.dataTransfer.files));
    }
  }, [onFiles]);

  // File input handler
  const handleChange = useCallback((e) => {
    if (e.target.files && e.target.files.length) {
      onFiles(Array.from(e.target.files));
    }
  }, [onFiles]);

  // Open file picker dialog
  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  // Keyboard accessibility (space/enter triggers file dialog)
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      triggerFileSelect();
    }
  };

  // Compose class names
  const rootClass = [
    styles.fileUploadZone,
    dragActive ? styles["fileUploadZone--active"] : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={rootClass}
      style={style}
      tabIndex={0}
      aria-label="File upload drop zone"
      aria-disabled={rest.disabled}
      role="button"
      onClick={triggerFileSelect}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      {...rest}
    >
      {children ?? (
        <div className={styles.fileUploadZone__prompt}>
          {prompt}
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept={accept}
        multiple={multiple}
        tabIndex={-1}
        onChange={handleChange}
        aria-hidden="true"
      />
    </div>
  );
}