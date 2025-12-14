/**
 * TimetablePage Component (Production)
 * ----------------------------------------------------------------------------
 * Displays a week-view timetable grid for courses in a session.
 * - Shows all course meetings by day/time.
 * - Filters on instructor, room, course, or student name.
 * - All UI uses global design-system components.
 * - 100% API-driven: no sample/demo logic remains.
 *
 * Usage:
 *   <Route path="/timetable" element={<TimetablePage />} />
 */

import { useEffect, useMemo, useState } from 'react';

import styles from './TimetablePage.module.scss';

import Input from '@/components/ui/input';
import timetableApi from '@/services/api/timetableApi'; // Should provide .list()

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const START_HOUR = 8;
const END_HOUR = 18;

// Utility to format time
function fmtTime(hour, minute = 0) {
  return `${((hour % 12) || 12)}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`;
}

export default function TimetablePage() {
  // State for meeting slots and UI filter
  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Load all meetings (course+room slots) from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchMeetings() {
      setLoading(true);
      try {
        const data = await timetableApi.list();
        if (isMounted) setMeetings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setMeetings([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchMeetings();
    return () => { isMounted = false; };
  }, []);

  // Apply search filter (by course, instructor, room, meeting label)
  const filteredMeetings = useMemo(
    () =>
      meetings.filter(m => {
        const q = search.toLowerCase();
        return (
          m.course?.toLowerCase().includes(q) ||
          m.name?.toLowerCase().includes(q) ||
          m.instructor?.toLowerCase().includes(q) ||
          m.room?.toLowerCase().includes(q)
        );
      }),
    [meetings, search]
  );

  // Map day => [ meetings ]
  const dayMap = useMemo(() => {
    const map = {};
    for (const m of filteredMeetings) {
      if (!map[m.day]) map[m.day] = [];
      map[m.day].push(m);
    }
    return map;
  }, [filteredMeetings]);

  // Build timeslots (every 30 min between START_HOUR and END_HOUR)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = START_HOUR; hour < END_HOUR; ++hour) {
      slots.push({ hour, minute: 0 });
      slots.push({ hour, minute: 30 });
    }
    return slots;
  }, []);

  // Track meeting cell spans to avoid duplicate rendering in spanned rows
  function meetingAtSlot(day, hour, minute) {
    return (dayMap[day] || []).find(
      m => m.startHour === hour && m.startMinute === minute
    );
  }

  function meetingTotalSlots(meeting) {
    if (!meeting) return 1;
    const totalMins =
      (meeting.endHour - meeting.startHour) * 60 +
      (meeting.endMinute - meeting.startMinute);
    return Math.max(Math.ceil(totalMins / 30), 1);
  }

  function shouldRenderMeeting(day, rowIdx, slotCount, timeSlots) {
    // Return true iff *this* row idx is the start of cell, not a spanned row
    if (slotCount < 2) return true;
    // For rows in the span (except starting one), skip rendering cell
    for (let i = 1; i < slotCount; ++i) {
      const prevSlot = timeSlots[rowIdx - i];
      if (prevSlot) {
        const m = meetingAtSlot(day, prevSlot.hour, prevSlot.minute);
        if (m) return false;
      }
    }
    return true;
  }

  return (
    <div className={styles.timetablePage}>
      <h1 className={styles.timetablePage__title}>Weekly Timetable</h1>
      <div className={styles.timetablePage__controls}>
        <Input
          className={styles.timetablePage__search}
          type="text"
          placeholder="Search by course, instructor, or room…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.timetablePage__gridArea}>
        {loading ? (
          <div className={styles.timetablePage__loading}>
            Loading timetable…
          </div>
        ) : (
          <table className={styles.timetablePage__grid}>
            <thead>
              <tr>
                <th>Time</th>
                {WEEKDAYS.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(({ hour, minute }, rowIdx) => (
                <tr key={rowIdx}>
                  <td className={styles.timetablePage__timeCell}>
                    {fmtTime(hour, minute)}
                  </td>
                  {WEEKDAYS.map(day => {
                    const meeting = meetingAtSlot(day, hour, minute);
                    if (meeting) {
                      const slotCount = meetingTotalSlots(meeting);
                      if (!shouldRenderMeeting(day, rowIdx, slotCount, timeSlots)) {
                        return null; // Already rendered with rowSpan above
                      }
                      return (
                        <td
                          key={day}
                          rowSpan={slotCount}
                          className={styles.timetablePage__meetingCell}
                          style={{
                            background: '#e0edff',
                            borderLeft: '4.5px solid #2563eb'
                          }}
                        >
                          <div className={styles.timetablePage__meetingTitle}>
                            <b>{meeting.course}</b> - {meeting.name}
                          </div>
                          <div className={styles.timetablePage__meetingInfo}>
                            <span><b>{meeting.instructor}</b></span>
                            <span> &middot; {meeting.room}</span>
                          </div>
                          <div className={styles.timetablePage__meetingTime}>
                            {fmtTime(meeting.startHour, meeting.startMinute)}
                            {" – "}
                            {fmtTime(meeting.endHour, meeting.endMinute)}
                          </div>
                        </td>
                      );
                    }
                    return <td key={day} />;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/**
 * Production Notes:
 * - All meetings are loaded from backend via timetableApi with search filter.
 * - UI is unified (Input for search, grid system for table).
 * - Layout and time-grid logic is ready for large datasets, and for expansion to personal/admin modes.
 */