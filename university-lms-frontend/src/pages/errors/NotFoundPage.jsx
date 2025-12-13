/**
 * NotFoundPage Component
 * ----------------------------------------------------------
 * Simple "404 - Not Found" message for invalid routes.
 *
 * Responsibilities:
 * - Shows 404 heading and a friendly not found message.
 * - Ready for navigation links (login, home, etc).
 *
 * Usage:
 *   <Route path="*" element={<NotFoundPage />} />
 */

import React from "react";

import styles from "./NotFoundPage.module.scss";

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundPage__card}>
        <h1 className={styles.notFoundPage__number}>404</h1>
        <h2 className={styles.notFoundPage__title}>Page Not Found</h2>
        <div className={styles.notFoundPage__desc}>
          Sorry, the page you requested could not be found.
        </div>
        <div className={styles.notFoundPage__actions}>
          <a href="/" className={styles.notFoundPage__homeBtn}>
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}