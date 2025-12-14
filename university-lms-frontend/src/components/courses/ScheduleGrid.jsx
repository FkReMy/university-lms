/**
 * ScheduleGrid Component (Production)
 * ----------------------------------------------------------------------------
 * Robust/unified weekly calendar grid for displaying session/events.
 * - Fully accessible, modular, and responsive.
 * - Uses only global class/styles for visual consistency.
 * - No demo/sample logic; grid/event logic is production-ready.
 * - Event rendering is customizable by consumer.
 *
 * Props:
 * - events: Array of event objects with fields:
 *     { id, title, day, start, end, color?, type?, description? }
 * - startHour, endHour: start/end of grid in hours (default: 8–18)
 * - days: name for each column (default: Sunday–Saturday)
 * - cellHeight: px height per hour row (default: 50)
 * - renderEvent: custom fn(event) (uses default if not provided)
 * - className/style/rest: layout props
 */

import PropTypes from 'prop-types';

import styles from './ScheduleGrid.module.scss';

// Default day labels (Sun-Sat, customizable)
const DEFAULT_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Convert "HH:MM" to minutes past midnight
const timestrToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = `${t}`.split(':');
  return parseInt(h, 10) * 60 + (parseInt(m, 10) || 0);
};

// Pad hour for display as "08"
const pad = (n) => String(n).padStart(2, '0');

/**
 * Default block renderer for single event.
 * All unified event styles are handled here.
 */
function DefaultEvent({ ev }) {
  return (
    <div
      className={styles.scheduleGrid__event}
      style={{ background: ev.color || "#2563eb" }}
      title={ev.title + (ev.description ? ` — ${ev.description}` : "")}
      role="listitem"
    >
      {ev.title}
    </div>
  );
}

DefaultEvent.propTypes = {
  ev: PropTypes.shape({
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

/**
 * ScheduleGrid
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

  // Group events by day, 0=Sunday
  const slotsByDay = Array.from({ length: numDays }, () => []);
  (events || []).forEach(ev => {
    if (ev && typeof ev.day === "number" && ev.day >= 0 && ev.day < numDays) {
      slotsByDay[ev.day].push(ev);
    }
  });

  // For absolute event positioning: compute top/height rel. to cell height and grid start hour
  const getEventStyle = (ev) => {
    const slotSpan = (timestrToMinutes(ev.end) - timestrToMinutes(ev.start)) / 60;
    const startOffset = (timestrToMinutes(ev.start) - startHour * 60) / 60;
    return {
      position: 'absolute',
      top: `${startOffset * cellHeight}px`,
      height: `${slotSpan * cellHeight}px`,
      left: '4%',
      width: '92%',
      minHeight: '2em',
    };
  };

  // Unified class name
  const rootClass = [styles.scheduleGrid, className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClass}
      style={style}
      aria-label="Class schedule grid"
      role="table"
      {...rest}
    >
      {/* Grid header: days of the week */}
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
      description: PropTypes.string,
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
 * - No ad hoc/dummy/sample rendering anywhere; 100% data-driven and scalable.
 * - All event logic is composable with renderEvent or uses the accessible DefaultEvent.
 * - Entire grid is styled and laid out with BEM and unified tokens only.
 * - Responsive and future-ready for time granularity and theming.
 */