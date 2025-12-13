/**
 * SectionGroupsPage Component
 * ----------------------------------------------------------
 * Admin/faculty page for managing groups within a course section.
 *
 * Responsibilities:
 * - Lists all groups in a section (e.g. lab groups, project teams).
 * - Allows filtering/search by group name or leader.
 * - Ready for expansion: add, edit, assign, or remove groups.
 *
 * Usage:
 *   <Route path="/sections/:sectionId/groups" element={<SectionGroupsPage />} />
 */

import { useEffect, useState } from 'react';

import styles from './SectionGroupsPage.module.scss';

export default function SectionGroupsPage({ sectionId /* from router params */ }) {
  // State for list of groups and searching
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate fetching group data for this section
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setGroups([
        {
          id: 1,
          name: 'AI Project Team',
          leader: 'Jane Student',
          members: ['Jane Student', 'John Lee', 'Oliver Brown'],
          type: 'Project',
        },
        {
          id: 2,
          name: 'Lab Group 1',
          leader: 'Olivia Brown',
          members: ['Olivia Brown', 'Noah Clark'],
          type: 'Lab',
        },
        {
          id: 3,
          name: 'Lab Group 2',
          leader: 'Ava Davis',
          members: ['Ava Davis', 'Samuel Green'],
          type: 'Lab',
        },
      ]);
      setLoading(false);
    }, 900);
  }, [sectionId]);

  // Filtered list
  const filteredGroups = groups.filter((g) => {
    const matchesName = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesLeader = g.leader.toLowerCase().includes(search.toLowerCase());
    return matchesName || matchesLeader;
  });

  // Badge for group type
  function typeBadge(type) {
    let color = '#374151',
      bg = '#f1f5f9';
    if (type === 'Project') {
      color = '#2563eb';
      bg = '#e0edff';
    }
    if (type === 'Lab') {
      color = '#e67e22';
      bg = '#fff6e0';
    }
    return (
      <span
        style={{
          background: bg,
          color,
          borderRadius: '0.6em',
          padding: '0.08em 0.85em',
          fontWeight: 700,
          fontSize: '0.96em',
          marginLeft: '0.36em',
        }}
      >
        {type}
      </span>
    );
  }

  return (
    <div className={styles.sectionGroupsPage}>
      <h1 className={styles.sectionGroupsPage__title}>Section Groups</h1>
      <div className={styles.sectionGroupsPage__controls}>
        <input
          className={styles.sectionGroupsPage__search}
          type="text"
          placeholder="Search by group name or leader…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={styles.sectionGroupsPage__addBtn}
          type="button"
          // onClick={() => ... future add group dialog ...}
        >
          + Add Group
        </button>
      </div>
      <div className={styles.sectionGroupsPage__listArea}>
        {loading ? (
          <div className={styles.sectionGroupsPage__loading}>
            Loading groups…
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className={styles.sectionGroupsPage__empty}>
            No groups found.
          </div>
        ) : (
          <table className={styles.sectionGroupsPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Leader</th>
                <th>Members</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td>{g.leader}</td>
                  <td>{g.members.join(', ')}</td>
                  <td>{typeBadge(g.type)}</td>
                  <td>
                    <button
                      className={styles.sectionGroupsPage__actionBtn}
                      // onClick={() => ... edit logic ...}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.sectionGroupsPage__actionBtn}
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