/**
 * Dialog (Modal) Component
 * ----------------------------------------------------------------------------
 * Production-grade, accessible modal dialog for LMS UI (global design system).
 * - Handles focus trap, escape-to-close, and backdrop dismiss.
 * - Global CSS module for all layout, tokens, and states.
 * - ARIA role="dialog", aria-modal, labelledby, describedby, etc.
 * - No sample/demo logic; only unified, scalable, backend-ready code.
 *
 * Props:
 * - open: boolean                    // Show/hide state
 * - onClose: function                // Called when dialog requests close
 * - title?: string | ReactNode       // For titlebar and accessibility
 * - description?: string | ReactNode // For describedby
 * - showClose?: boolean              // Show "×" close button (default: true)
 * - children?: ReactNode             // Main dialog content/body
 * - footer?: ReactNode               // Optional footer (actions)
 * - className?: string
 * - ...rest: props for dialog content div
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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

  // Trap focus and close on ESC when open
  useEffect(() => {
    if (!open) return;

    // Save last active element to restore on close
    const lastFocused = document.activeElement;
    // Focus dialog root
    dialogRef.current && dialogRef.current.focus();

    // Tab focus trap (focus cycling)
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const focusableEls = dialogRef.current.querySelectorAll(
        'a[href],button:not([disabled]),textarea,input:not([type="hidden"]),select,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusableEls.length) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    // ESC key (global)
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    dialogRef.current.addEventListener('keydown', handleTab);
    window.addEventListener('keydown', handleEsc);

    return () => {
      dialogRef.current?.removeEventListener('keydown', handleTab);
      window.removeEventListener('keydown', handleEsc);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };
  }, [open, onClose]);

  // Backdrop click: only close if click is exactly on overlay (not dialog)
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  if (!open) return null;

  // ARIA id management for a11y
  const labelId = title ? 'dialog-title' : undefined;
  const descId = description ? 'dialog-desc' : undefined;

  return (
    <div
      className={styles.dialog__overlay}
      ref={overlayRef}
      tabIndex={-1}
      aria-hidden={!open}
      role="presentation"
      onClick={onBackdropClick}
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

        {description && (
          <div className={styles.dialog__desc} id={descId}>
            {description}
          </div>
        )}

        {/* Main dialog content */}
        <div className={styles.dialog__body}>{children}</div>

        {/* Footer (actions/controls) */}
        {footer && (
          <div className={styles.dialog__footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showClose: PropTypes.bool,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
};

/**
 * Production/Architecture Notes:
 * - All overlay/panel animation, tokens, and colors are global (dialog.module.scss).
 * - Focus, tab trap, escape, and a11y handled globally.
 * - Only props-based (no demo/sample/local logic).
 * - Can be used with any backend/UI flow, including forms and async actions.
 */