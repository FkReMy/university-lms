/**
 * AccessDeniedPage Component
 * ----------------------------------------------------------
 * Simple "403 - Access Denied" message for unauthorized users.
 *
 * Responsibilities:
 * - Shows 403 heading and a friendly/clear forbidden message.
 * - Ready for navigation links (login, home, etc).
 *
 * Usage:
 *   <Route path="/denied" element={<AccessDeniedPage />} />
 */

import React from "react";

import styles from "./AccessDeniedPage.module.scss";

export default function AccessDeniedPage() {
  return (
    <div className={styles.accessDeniedPage}>
      <div className={styles.accessDeniedPage__card}>
        <h1 className={styles.accessDeniedPage__number}>403</h1>
        <h2 className={styles.accessDeniedPage__title}>Access Denied</h2>
        <div className={styles.accessDeniedPage__desc}>
          Sorry, you don&apos;t have permission to view this page.
        </div>
        <div className={styles.accessDeniedPage__actions}>
          {/* Example: Could link to login or home here */}
          <a href="/" className={styles.accessDeniedPage__homeBtn}>
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}