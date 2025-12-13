/**
 * Dialog (Modal) Component
 * ----------------------------------------------------------
 * A reusable, accessible modal/dialog for the LMS UI using CSS modules.
 *
 * Features:
 * - Centered modal overlay with proper focus trapping and keyboard closing.
 * - ARIA accessibility (role="dialog", aria-modal, labelledby, describedby).
 * - Simple API: open/close, click backdrop to close, ESC key closes.
 * - Optional header, footer, close button.
 * - Supports mounting/unmounting with fade animation.
 *
 * Props:
 * - open: boolean                - Whether the dialog is shown
 * - onClose: function            - Called when the dialog wants to close
 * - title: string | ReactNode    - Title text (for accessibility and header)
 * - description: string | ReactNode (optional, described by for a11y)
 * - showClose: boolean           - Whether to show an "X" close button (default true)
 * - children: ReactNode          - Modal content/body
 * - footer: ReactNode            - Optional footer, typically for actions
 * - className: string            - Extra classes for dialog content
 * - ...rest:                     - Other props for the dialog container
 *
 * Usage:
 *   <Dialog open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Course">
 *     <div>Dialog content…</div>
 *   </Dialog>
 */

import { useEffect, useRef } from 'react';
import styles from './dialog.module.scss';

export default function Dialog({
  open,
  onClose,
  title,
  description,
  showClose = true,
  children,
  footer,
  className = '',
  ...rest
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  // Focus management: move focus inside dialog when it opens
  useEffect(() => {
    if (open && dialogRef.current) {
      // Save last focused element
      const lastFocused = document.activeElement;
      dialogRef.current.focus();

      // Trap focus inside dialog
      const handleTab = e => {
        if (e.key !== 'Tab') return;
        const focusableEls = dialogRef.current.querySelectorAll(
          'a[href],button:not([disabled]),textarea,input:not([type="hidden"]),select,[tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!focusableEls.length) return;

        if (e.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      };
      // Allow ESC to close
      const handleEsc = e => {
        if (e.key === 'Escape') onClose?.();
      };

      dialogRef.current.addEventListener('keydown', handleTab);
      window.addEventListener('keydown', handleEsc);

      return () => {
        dialogRef.current?.removeEventListener('keydown', handleTab);
        window.removeEventListener('keydown', handleEsc);
        lastFocused && lastFocused.focus && lastFocused.focus();
      };
    }
  }, [open, onClose]);

  // Close on backdrop click
  const onBackdropClick = e => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  // Don't render if not open
  if (!open) return null;

  // ARIA ids
  const labelId = title ? 'dialog-title' : undefined;
  const descId = description ? 'dialog-desc' : undefined;

  return (
    <div
      className={styles.dialog__overlay}
      ref={overlayRef}
      tabIndex={-1}
      aria-hidden={!open}
      onMouseDown={onBackdropClick}
      data-testid="dialog-overlay"
    >
      <div
        className={[styles.dialog__content, className].filter(Boolean).join(' ')}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descId}
        tabIndex={-1}
        {...rest}
      >
        {/* Header with title and optional close */}
        {(title || showClose) && (
          <div className={styles.dialog__header}>
            {title && (
              <h2 className={styles.dialog__title} id={labelId}>
                {title}
              </h2>
            )}
            {showClose && (
              <button
                className={styles.dialog__close}
                aria-label="Close dialog"
                type="button"
                onClick={onClose}
                tabIndex={0}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Description below header (optional) */}
        {description && (
          <div className={styles.dialog__desc} id={descId}>
            {description}
          </div>
        )}

        {/* Main content/body */}
        <div className={styles.dialog__body}>{children}</div>

        {/* Optional footer */}
        {footer && (
          <div className={styles.dialog__footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}