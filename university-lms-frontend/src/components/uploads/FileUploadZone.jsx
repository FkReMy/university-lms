/**
 * FileUploadZone Component
 * ----------------------------------------------------------------------------
 * Production-grade, accessible drag-and-drop file upload/drop zone for LMS.
 * - All layout/state via FileUploadZone.module.scss (global design system).
 * - Handles keyboard, ARIA, drag, drop, and file picker dialog.
 * - No sample/demo logic.
 *
 * Props:
 * - onFiles: function(File[])         // REQUIRED, called with selected or dropped file list
 * - accept?: string                   // Accept filter for file picker/input
 * - multiple?: boolean                // Allow multiple files (default: false)
 * - prompt?: ReactNode                // Prompt when no children are supplied
 * - children?: ReactNode              // Custom drop zone content
 * - className?: string
 * - style?: object
 * - ...rest: Other props for root <div>
 */

import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
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

  // Drag enter/over/leave handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  // Drop files
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) {
      onFiles(Array.from(e.dataTransfer.files));
    }
  }, [onFiles]);

  // Handle native input selection
  const handleChange = useCallback((e) => {
    if (e.target.files && e.target.files.length) {
      onFiles(Array.from(e.target.files));
    }
  }, [onFiles]);

  // Click or keyboard triggers file select
  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  // Keyboard accessibility (space/enter)
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      triggerFileSelect();
    }
  };

  // Design system/global classes
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

FileUploadZone.propTypes = {
  onFiles: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  prompt: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - All focus highlight, drag, button states are via FileUploadZone.module.scss.
 * - Keyboard and ARIA support is robust.
 * - No local/sample/demo logic; ready for backend/async and large-scale upload UIs.
 */