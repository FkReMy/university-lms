/**
 * ScheduleGrid Component
 * ----------------------------------------------------------
 * Displays a weekly calendar/grid view of course sessions, assignments, or events.
 *
 * Responsibilities:
 * - Shows a grid: days of the week (columns), time slots (rows)
 * - Each cell can show sessions, events, assignments, with tooltips/details.
 * - Supports customizable start/end hours, slots, and event rendering.
 * - (Optionally) highlights current day or conflicts.
 *
 * Props:
 * - events: Array<{
 *      id: string|number,
 *      title: string,
 *      day: 0-6 (0=Sun),
 *      start: "HH:MM" (24h string),
 *      end:   "HH:MM",
 *      color?: string,
 *      type?: string, // "session", "assignment", "exam", ...
 *      description?: string,
 *      ... (other)
 *   }>
 * - startHour: number (default 8)   - Starting hour of grid (0-23)
 * - endHour: number (default 18)    - Ending hour (0-23, inclusive for rows)
 * - days: Array<string> (optional)  - Custom day names, default Sun-Sat
 * - cellHeight: number (optional)   - Height per hour-row (px)
 * - renderEvent: fn(event) => ReactNode (optional custom event render)
 * - className: string (optional)
 * - style: object (optional)
 * - ...rest (applied to <div>)
 *
 * Usage:
 *   <ScheduleGrid
 *     events={[{ day: 1, start: "10:00", end: "11:30", title: "Math 101" }]}
 *     startHour={8}
 *     endHour={16}
 *   />
 */

import styles from './ScheduleGrid.module.scss';

const defaultDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timestrToMinutes = (t) => {
  const [h, m] = (t || "0:00").split(':');
  return parseInt(h, 10) * 60 + (parseInt(m, 10) || 0);
};
const pad = (n) => String(n).padStart(2, '0');

// Event block default renderer
function DefaultEvent({ ev }) {
  return (
    <div
      className={styles.scheduleGrid__event}
      style={{ background: ev.color || "#2563eb" }}
      title={ev.title + (ev.description ? ` — ${ev.description}` : "")}
    >
      {ev.title}
    </div>
  );
}

export default function ScheduleGrid({
  events = [],
  startHour = 8,
  endHour = 18,
  days = defaultDays,
  cellHeight = 50,
  renderEvent,
  className = "",
  style = {},
  ...rest
}) {
  // 0 (Sun) to 6 (Sat), limit grid if days override
  const numDays = (days && days.length) || 7;
  const hours = [];
  for (let h = startHour; h <= endHour; ++h) hours.push(h);

  // Group events by day
  const slotsByDay = Array.from({ length: numDays }, () => []);
  (events || []).forEach((ev) => {
    if (ev && typeof ev.day === "number" && ev.day >= 0 && ev.day < numDays)
      slotsByDay[ev.day].push(ev);
  });

  // Helper: get event block vertical position/size in cell grid
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

  // Compose class name
  const rootClass = [styles.scheduleGrid, className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClass}
      style={style}
      {...rest}
      aria-label="Class schedule grid"
      role="table"
    >
      {/* Header: days of week */}
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
        {/* For each hour slot */}
        {hours.map((h) => (
          <div className={styles.scheduleGrid__row} key={h} style={{ height: `${cellHeight}px` }} role="row">
            <div className={styles.scheduleGrid__hourCell} role="rowheader">
              {pad(h)}:00
            </div>
            {/* Each day's column */}
            {slotsByDay.map((evs, d) => (
              <div className={styles.scheduleGrid__cell} key={d + '-' + h} role="cell">
                {/* Events for this day, that overlap this hour slot */}
                {evs
                  .filter(
                    (ev) =>
                      timestrToMinutes(ev.start) < (h + 1) * 60 &&
                      timestrToMinutes(ev.end) > h * 60
                  )
                  .map((ev, idx) => {
                    // Only render one instance per event at its starting hour
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
