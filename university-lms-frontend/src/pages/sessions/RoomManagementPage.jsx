/**
 * RoomManagementPage Component
 * ----------------------------------------------------------
 * Admin/staff tool to manage campus rooms for scheduling (courses, exams, events).
 *
 * Responsibilities:
 * - Lists all rooms with details (name, building, capacity, type, status)
 * - Allows search/filter by building, type, or availability.
 * - Ready for expansion: add/edit/remove rooms.
 *
 * Usage:
 *   <Route path="/rooms" element={<RoomManagementPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './RoomManagementPage.module.scss';

export default function RoomManagementPage() {
  // Room data and filters
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [building, setBuilding] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Simulate API fetch
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRooms([
        {
          id: 1,
          name: 'Room 101',
          building: 'Science Hall',
          capacity: 40,
          type: 'Lecture',
          status: 'Available'
        },
        {
          id: 2,
          name: 'Room 22B',
          building: 'Engineering Center',
          capacity: 24,
          type: 'Lab',
          status: 'Occupied'
        },
        {
          id: 3,
          name: 'Room 107',
          building: 'Science Hall',
          capacity: 18,
          type: 'Seminar',
          status: 'Available'
        },
        {
          id: 4,
          name: 'Main Auditorium',
          building: 'Arts Complex',
          capacity: 220,
          type: 'Auditorium',
          status: 'Under Maintenance'
        }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  // Unique values for filter dropdowns
  const buildingList = [...new Set(rooms.map(r => r.building))].sort();
  const typeList = [...new Set(rooms.map(r => r.type))].sort();
  const statuses = [...new Set(rooms.map(r => r.status))].sort();

  // Search/filter result
  const filteredRooms = rooms.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.building.toLowerCase().includes(search.toLowerCase());
    const matchesBuilding = building === 'all' || r.building === building;
    const matchesType = type === 'all' || r.type === type;
    const matchesStatus = status === 'all' || r.status === status;
    return matchesSearch && matchesBuilding && matchesType && matchesStatus;
  });

  // Status badge
  function statusBadge(s) {
    let bg = "#dedede", color = "#213050";
    if (!s) return null;
    if (s === 'Available') { bg = "#e5ffe9"; color = "#179a4e"; }
    if (s === 'Occupied') { bg = "#e0edff"; color = "#2563eb"; }
    if (s === 'Under Maintenance') { bg = "#fbeaea"; color = "#e62727"; }
    return (
      <span
        style={{
          background: bg,
          color: color,
          fontWeight: 600,
          fontSize: "0.96em",
          borderRadius: "1em",
          padding: "0.13em 0.85em",
        }}
      >
        {s}
      </span>
    );
  }

  return (
    <div className={styles.roomManagementPage}>
      <h1 className={styles.roomManagementPage__title}>
        Room Management
      </h1>
      <div className={styles.roomManagementPage__controls}>
        <input
          className={styles.roomManagementPage__search}
          type="text"
          placeholder="Search by room or building…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.roomManagementPage__buildingSelect}
          value={building}
          onChange={e => setBuilding(e.target.value)}
        >
          <option value="all">All Buildings</option>
          {buildingList.map(b => (
            <option value={b} key={b}>{b}</option>
          ))}
        </select>
        <select
          className={styles.roomManagementPage__typeSelect}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          {typeList.map(t => (
            <option value={t} key={t}>{t}</option>
          ))}
        </select>
        <select
          className={styles.roomManagementPage__statusSelect}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option value={s} key={s}>{s}</option>
          ))}
        </select>
        <button
          className={styles.roomManagementPage__addBtn}
          type="button"
          // onClick={() => ... future add dialog ...}
        >
          + Add Room
        </button>
      </div>
      <div className={styles.roomManagementPage__listArea}>
        {loading ? (
          <div className={styles.roomManagementPage__loading}>
            Loading rooms…
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className={styles.roomManagementPage__empty}>
            No rooms found.
          </div>
        ) : (
          <table className={styles.roomManagementPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Building</th>
                <th>Capacity</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.building}</td>
                  <td>{r.capacity}</td>
                  <td>{r.type}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <button
                      className={styles.roomManagementPage__actionBtn}
                      // onClick={() => ... future edit dialog ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.roomManagementPage__actionBtn}
                      // onClick={() => ... remove logic ...}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}