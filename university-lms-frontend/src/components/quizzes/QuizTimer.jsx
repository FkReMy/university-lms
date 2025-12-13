/**
 * QuizTimer Component
 * ----------------------------------------------------------
 * Displays a ticking countdown timer for quizzes with deadlines.
 *
 * Responsibilities:
 * - Counts down from a duration (seconds) or until a given deadline (Date/timestamp).
 * - Calls onExpire() when finished (timeout).
 * - Can render time in "MM:SS" or "HH:MM:SS" format.
 * - Optionally, display as just text, or with warning color near end.
 *
 * Props:
 * - seconds: number (optional)        - Duration in seconds from mount.
 * - until: Date | number (optional)   - End timestamp/date (overrides seconds if both are provided).
 * - onExpire: fn() (optional)         - Called when timer finishes.
 * - warningThreshold: number (optional, seconds left to trigger warning color)
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (applied to <span>)
 *
 * Usage:
 *   <QuizTimer seconds={600} onExpire={submitQuiz} />
 *   <QuizTimer until={Date.now() + 10*60*1000} />
 */

import { useState, useEffect, useRef } from 'react';

import styles from './QuizTimer.module.scss';

function formatTime(sec) {
  // Format as HH:MM:SS or MM:SS as needed
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) {
    return [h, m, ss].map(n => String(n).padStart(2, '0')).join(':');
  }
  return [m, ss].map(n => String(n).padStart(2, '0')).join(':');
}

export default function QuizTimer({
  seconds,
  until,
  onExpire,
  warningThreshold = 60,
  className = "",
  style = {},
  ...rest
}) {
  // Calculate initial timeLeft based on props
  function calcTimeLeft() {
    if (until) {
      const t = typeof until === "number" ? until : until.getTime();
      return Math.round((t - Date.now()) / 1000);
    }
    return typeof seconds === "number" ? Math.round(seconds) : 0;
  }
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);
  const expiredRef = useRef(false);

  // Ticking effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!expiredRef.current && onExpire) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    expiredRef.current = false;
    const intv = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(intv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [until, seconds, timeLeft, onExpire]);

  // Compose class name (warning highlight)
  const rootClass = [
    styles.quizTimer,
    (timeLeft > 0 && timeLeft <= warningThreshold) ? styles['quizTimer--warning'] : "",
    timeLeft <= 0 ? styles['quizTimer--expired'] : "",
    className
  ].filter(Boolean).join(' ');

  return (
    <span
      className={rootClass}
      style={style}
      aria-label={timeLeft <= 0 ? "Time's up" : `Time left: ${formatTime(timeLeft)}`}
      role="timer"
      {...rest}
    >
      {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
    </span>
  );
}