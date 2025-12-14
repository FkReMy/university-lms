/**
 * ScheduleGrid Component
 * ---------------------------------------------------------------------------
 * A robust, unified weekly calendar/grid for displaying sessions/events.
 * - Fully accessible, modular, and responsive for use in all LMS use cases.
 * - Uses only global class/styles for visual consistency.
 * - No demo/sample; grid/event logic 100% production-ready.
 * - Event rendering is customizable by consumer.
 *
 * Props:
 * - events: Array<{
 *      id: string|number,
 *      title: string,
 *      day: 0-6,
 *      start: "HH:MM",
 *      end:   "HH:MM",
 *      color?: string,
 *      type?: string,
 *      description?: string,
 *      ...
 *   }>
 * - startHour?: number       - Grid first hour (default: 8)
 * - endHour?: number         - Last hour (inclusive; default: 18)
 * - days?: Array<string>     - Column headings (default: Sunday-Saturday)
 * - cellHeight?: number      - Hour row height in px (default: 50)
 * - renderEvent?: fn(event)  - Custom event renderer (uses default if absent)
 * - className?: string
 * - style?: object
 * - ...rest: extra props for main <div>
 */

import PropTypes from 'prop-types';
import styles from './ScheduleGrid.module.scss';

// Default day labels (Sun-Sat, customizable)
const DEFAULT_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Convert "HH:MM" to minutes past midnight */
const timestrToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = `${t}`.split(':');
  return parseInt(h, 10) * 60 + (parseInt(m, 10) || 0);
};

/** Pad numbers as "08", "18" etc (for hour display) */
const pad = (n) => String(n).padStart(2, '0');

/**
 * Default event block renderer.
 * All unified event styles should be handled in one place.
 */
function DefaultEvent({ ev }) {
  return (
    <div
      className={styles.scheduleGrid__event}
      style={{ background: ev.color || "#2563eb" }}
      title={ev.title + (ev.description ? ` — ${ev.description}` : "")}
      role="listitem"
      tabIndex={0}
    >
      {ev.title}
    </div>
  );
}

/**
 * Main ScheduleGrid component.
 */
export default function ScheduleGrid({
  events = [],
  startHour = 8,
  endHour = 18,
  days = DEFAULT_DAYS,
  cellHeight = 50,
  renderEvent,
  className = "",
  style = {},
  ...rest
}) {
  const numDays = days.length || 7;
  const hours = [];
  for (let h = startHour; h <= endHour; ++h) hours.push(h);

  // Group events by day (0=Sunday)
  const slotsByDay = Array.from({ length: numDays }, () => []);
  (events || []).forEach(ev => {
    if (ev && typeof ev.day === "number" && ev.day >= 0 && ev.day < numDays) {
      slotsByDay[ev.day].push(ev);
    }
  });

  // For absolute positioning: compute top/height relative to cell height and startHour
  const getEventStyle = (ev) => {
    const slotSpan = (timestrToMinutes(ev.end) - timestrToMinutes(ev.start)) / 60;
    const startOffset = (timestrToMinutes(ev.start) - startHour * 60) / 60;
    return {
      position: 'absolute',
      top: `${startOffset * cellHeight}px`,
      height: `${slotSpan * cellHeight}px`,
      left: '4%',
      width: '92%',
      minHeight: '2em'
    };
  };

  // Compose full class name using design system principles
  const rootClass = [styles.scheduleGrid, className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClass}
      style={style}
      aria-label="Class schedule grid"
      role="table"
      {...rest}
    >
      {/* Grid header - days of week */}
      <div className={styles.scheduleGrid__header} role="rowgroup">
        <div className={styles.scheduleGrid__hourCell}>&nbsp;</div>
        {days.slice(0, numDays).map((d, i) => (
          <div
            key={d}
            className={[
              styles.scheduleGrid__dayCell,
              i === new Date().getDay() ? styles['scheduleGrid__dayCell--today'] : ""
            ].join(' ')}
            role="columnheader"
            aria-colindex={i + 2}
          >
            {d}
          </div>
        ))}
      </div>
      <div className={styles.scheduleGrid__body} role="rowgroup">
        {hours.map((h) => (
          <div
            className={styles.scheduleGrid__row}
            key={h}
            style={{ height: `${cellHeight}px` }}
            role="row"
          >
            <div className={styles.scheduleGrid__hourCell} role="rowheader">
              {pad(h)}:00
            </div>
            {slotsByDay.map((evs, d) => (
              <div className={styles.scheduleGrid__cell} key={d + '-' + h} role="cell">
                {evs
                  .filter(
                    (ev) =>
                      timestrToMinutes(ev.start) < (h + 1) * 60 &&
                      timestrToMinutes(ev.end) > h * 60
                  )
                  .map((ev, idx) => {
                    // Only render at the event's starting hour
                    if (Math.floor(timestrToMinutes(ev.start) / 60) !== h) return null;
                    const evNode = renderEvent
                      ? renderEvent(ev)
                      : <DefaultEvent ev={ev} />;
                    return (
                      <div
                        key={ev.id || ev.title || idx}
                        style={getEventStyle(ev)}
                        className={styles.scheduleGrid__eventWrapper}
                      >
                        {evNode}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Prop types for production safety
ScheduleGrid.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      day: PropTypes.number.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      color: PropTypes.string,
      type: PropTypes.string,
      description: PropTypes.string
    })
  ),
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  days: PropTypes.arrayOf(PropTypes.string),
  cellHeight: PropTypes.number,
  renderEvent: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Production/Architecture Notes:
 * - Unified, scalable, accessible. No demo or ad hoc markup.
 * - All event display logic is composable by passing a custom renderEvent function.
 * - All grid/cell/event layout is styled using global classNames and tokens in ScheduleGrid.module.scss.
 * - Designed for future theming, time granularity, and mobile responsiveness with design system.
 */