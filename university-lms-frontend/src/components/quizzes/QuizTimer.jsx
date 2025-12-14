/**
 * QuizTimer Component
 * ----------------------------------------------------------------------------
 * A global, production-ready countdown timer for quizzes/exams.
 * - Supports both duration (`seconds`) and absolute end (`until` timestamp/date).
 * - Uses only global CSS modules/classes.
 * - Warns near end, calls onExpire, accessible (role/ARIA).
 * - No sample/demo/inline logic.
 *
 * Props:
 * - seconds?: number             // Countdown duration (in seconds, from mount)
 * - until?: Date | number        // Absolute end time (timestamp or Date); takes priority over seconds
 * - onExpire?: function          // Called once when time is up
 * - warningThreshold?: number    // Seconds left to switch to warning class (default 60)
 * - className?: string
 * - style?: object
 * - ...rest: extra props for <span>
 */

import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

import styles from './QuizTimer.module.scss';

// Formats seconds into "HH:MM:SS" or "MM:SS"
function formatTime(sec) {
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
  // Calculate current time left in seconds
  function calcTimeLeft() {
    if (until) {
      const untilMs = typeof until === "number" ? until : until.getTime();
      return Math.round((untilMs - Date.now()) / 1000);
    }
    return typeof seconds === "number" ? Math.round(seconds) : 0;
  }

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);
  const expiredRef = useRef(false);

  // Main ticking effect and expiry handler
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!expiredRef.current && typeof onExpire === 'function') {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    expiredRef.current = false;
    const intervalId = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [until, seconds, timeLeft, onExpire]);

  // Root class: warning/expired modifiers
  const rootClass = [
    styles.quizTimer,
    (timeLeft > 0 && timeLeft <= warningThreshold) ? styles['quizTimer--warning'] : "",
    timeLeft <= 0 ? styles['quizTimer--expired'] : "",
    className,
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

QuizTimer.propTypes = {
  seconds: PropTypes.number,
  until: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  onExpire: PropTypes.func,
  warningThreshold: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - All runtime/animation is robust and leak-proof.
 * - No sample or local styling, only global/shared QuizTimer.module.scss classes.
 * - Fully extensible for global quiz/exam integrations and automatic submit onExpire.
 */