/**
 * TimetablePage Component
 * ----------------------------------------------------------
 * Displays a weekly timetable/grid for courses in a given session.
 * May be used by students, faculty, or admins to view schedules.
 *
 * Responsibilities:
 * - Shows a week-view grid (days/hours) of all course meetings.
 * - Allows filtering by instructor, room, course, or student.
 * - Read-only (ready for expansion for personal view or admin mode).
 *
 * Usage:
 *   <Route path="/timetable" element={<TimetablePage />} />
 */

import { useEffect, useState } from 'react';

import styles from './TimetablePage.module.scss';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const START_HOUR = 8; // first lesson at 8am
const END_HOUR = 18; // last ends at 6pm

// Utility to pretty-print time
function fmtTime(hour, minute = 0) {
  return `${((hour % 12) || 12)}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`;
}

export default function TimetablePage() {
  // Demo: meetings array
  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate timetable meetings for the week
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMeetings([
        // { day, start, end, course, instructor, room }
        {
          id: 1,
          day: 'Mon',
          startHour: 10,
          startMinute: 30,
          endHour: 12,
          endMinute: 0,
          course: 'CSCI 101',
          name: 'Intro to Computer Science',
          instructor: 'Dr. Smith',
          room: 'Room 101',
        },
        {
          id: 2,
          day: 'Mon',
          startHour: 13,
          startMinute: 0,
          endHour: 14,
          endMinute: 50,
          course: 'BUS 240',
          name: 'Business Communication',
          instructor: 'Dr. Turner',
          room: 'Main Auditorium',
        },
        {
          id: 3,
          day: 'Wed',
          startHour: 10,
          startMinute: 30,
          endHour: 12,
          endMinute: 0,
          course: 'CSCI 101',
          name: 'Intro to Computer Science',
          instructor: 'Dr. Smith',
          room: 'Room 101',
        },
        {
          id: 4,
          day: 'Thu',
          startHour: 9,
          startMinute: 0,
          endHour: 10,
          endMinute: 20,
          course: 'MATH 195',
          name: 'Calculus I',
          instructor: 'Dr. Kapoor',
          room: 'Room 107',
        },
        {
          id: 5,
          day: 'Fri',
          startHour: 12,
          startMinute: 0,
          endHour: 13,
          endMinute: 40,
          course: 'BUS 240',
          name: 'Business Communication',
          instructor: 'Dr. Turner',
          room: 'Main Auditorium',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // Filter: course/instructor/room/name
  const filteredMeetings = meetings.filter(m => {
    const q = search.toLowerCase();
    return (
      m.course.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.instructor.toLowerCase().includes(q) ||
      m.room.toLowerCase().includes(q)
    );
  });

  // Map: day => [ meetings ]
  const dayMap = {};
  for (const m of filteredMeetings) {
    if (!dayMap[m.day]) dayMap[m.day] = [];
    dayMap[m.day].push(m);
  }

  // Build grid rows (each row = half-hour slot)
  const timeSlots = [];
  for (let hour = START_HOUR; hour < END_HOUR; ++hour) {
    timeSlots.push({ hour, minute: 0 });
    timeSlots.push({ hour, minute: 30 });
  }

  return (
    <div className={styles.timetablePage}>
      <h1 className={styles.timetablePage__title}>Weekly Timetable</h1>
      <div className={styles.timetablePage__controls}>
        <input
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
                    // Only render a meeting if it starts exactly at this hour/minute (for demo; refine in production)
                    const meeting = (dayMap[day] || []).find(
                      m =>
                        m.startHour === hour && m.startMinute === minute
                    );
                    if (meeting) {
                      // Total minutes to calculate rowSpan
                      const totalMins =
                        (meeting.endHour - meeting.startHour) * 60 +
                        (meeting.endMinute - meeting.startMinute);
                      const slotCount = Math.max(Math.ceil(totalMins / 30), 1);
                      // Prevent rendering duplicate blocks (spanning cells)
                      // If rowspan > 1, skip the next N-1 cells for this day
                      if (
                        timeSlots
                          .slice(
                            rowIdx - (slotCount - 1),
                            rowIdx
                          )
                          .some(
                            s =>
                              s &&
                              (dayMap[day] || []).find(
                                m2 =>
                                  m2.startHour === s.hour &&
                                  m2.startMinute === s.minute
                              )
                          )
                      ) {
                        return null;
                      }
                      return (
                        <td
                          key={day}
                          rowSpan={slotCount}
                          className={styles.timetablePage__meetingCell}
                          style={{
                            background: '#e0edff',
                            borderLeft: '4.5px solid #2563eb',
                          }}
                        >
                          <div className={styles.timetablePage__meetingTitle}>
                            <b>{meeting.course}</b> - {meeting.name}
                          </div>
                          <div className={styles.timetablePage__meetingInfo}>
                            <span>
                              <b>{meeting.instructor}</b>
                            </span>
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
                    // No meeting at this time slot
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
