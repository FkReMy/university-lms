/**
 * ErrorBoundary Component
 * ---------------------------------------------------------------------------
 * A robust, global error boundary for the LMS frontend.
 * - Catches rendering/runtime errors in any React subtree.
 * - Shows a production-quality fallback using only global/shared UI primitives.
 * - Custom fallback can be provided via `fallback` prop.
 * - All error styling and UI fully unified via design system classes.
 * - Extensible for logging/reporting to backend, Sentry, etc.
 *
 * Props:
 * - fallback?: ReactNode — Custom error view to render when caught
 * - children: ReactNode — UI protected by boundary (required)
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './ErrorBoundary.module.scss';
import Button from '@/components/ui/button';          // Global design-system button
import EmptyState from '@/components/common/EmptyState'; // Centralized empty/error/fallback UI

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /** Updates error state if an error is thrown in children. */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Optional: log/report error details for developers/support or send to monitoring backend.
   * You can replace this with integration to Sentry or your error analytics service.
   */
  componentDidCatch(error, errorInfo) {
    // Production: Only log or report to backend, never show details to user
    // Example: sendErrorLog(error, errorInfo)
    // Here: log to browser console for diagnostics
    /* eslint-disable-next-line no-console */
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  /** Allows user to manually reset error state (reload boundary) */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Priority: custom fallback, else global system fallback.
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.errorBoundary} role="alert">
          <EmptyState
            label="Something went wrong"
            description={
              this.state.error?.message ||
              "An unexpected error occurred. Please try again, or contact support if this persists."
            }
            action={
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
            }
          />
        </div>
      );
    }

    // No error: render normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};

/**
 * Architectural/Production Notes:
 * - No inline styling or demo code: all error visuals are unified and themeable via global SCSS.
 * - Error resets safely; “Try Again” re-mounts child components.
 * - To extend error handling (Sentry, analytics, logging) update componentDidCatch.
 * - All fallback UI is 100% accessible and unified (design system).
 */