/**
 * SectionGroupsPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin/faculty view for managing groups within a specific section.
 * - Lists all groups (lab, project, etc) for the section.
 * - Filter/search by group name or leader.
 * - All actions and inputs use global design system.
 * - No sample/demo logic; all data loads from API.
 * - Hooks ready for add/edit/remove/assign.
 *
 * Usage:
 *   <Route path="/sections/:sectionId/groups" element={<SectionGroupsPage />} />
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import styles from './SectionGroupsPage.module.scss';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import groupApi from '@/services/api/groupApi'; // Must provide .list(sectionId), etc.

export default function SectionGroupsPage() {
  const { sectionId } = useParams();

  // State for groups and searching/filter
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch groups from backend on mount or section change
  useEffect(() => {
    let isMounted = true;
    async function fetchGroups() {
      setLoading(true);
      try {
        const data = await groupApi.list(sectionId);
        if (isMounted) setGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setGroups([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchGroups();
    return () => { isMounted = false; };
  }, [sectionId]);

  // Filter for search on name/leader
  const filteredGroups = useMemo(
    () =>
      groups.filter((g) => {
        const s = search.toLowerCase();
        return (
          g.name?.toLowerCase().includes(s) ||
          g.leader?.toLowerCase().includes(s)
        );
      }),
    [groups, search]
  );

  // Badge component for group type
  function typeBadge(type) {
    let variant = "default";
    if (/project/i.test(type)) variant = "primary";
    else if (/lab/i.test(type)) variant = "warning";
    // else more types can be distinguished
    return <Badge variant={variant}>{type}</Badge>;
  }

  // Callbacks for future actions
  const handleAdd = useCallback(() => {
    // TODO: Open add-group modal/dialog
  }, []);
  const handleEdit = useCallback((id) => {
    // TODO: Trigger edit logic/modal
  }, []);
  const handleRemove = useCallback((id) => {
    // TODO: Implement remove logic/modal
  }, []);

  return (
    <div className={styles.sectionGroupsPage}>
      <h1 className={styles.sectionGroupsPage__title}>Section Groups</h1>
      <div className={styles.sectionGroupsPage__controls}>
        <Input
          className={styles.sectionGroupsPage__search}
          type="text"
          placeholder="Search by group name or leader…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button
          className={styles.sectionGroupsPage__addBtn}
          type="button"
          variant="primary"
          onClick={handleAdd}
        >
          + Add Group
        </Button>
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
                  <td>{(g.members || []).join(', ')}</td>
                  <td>{typeBadge(g.type)}</td>
                  <td>
                    <Button
                      className={styles.sectionGroupsPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleEdit(g.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      className={styles.sectionGroupsPage__actionBtn}
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleRemove(g.id)}
                    >
                      Remove
                    </Button>
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

/**
 * Production Notes:
 * - Uses only backend-driven data via groupApi.
 * - All controls and badges use design-system components.
 * - All logic ready for future modals/dialogs for add/edit/remove/assign.
 * - No sample/demo code or data remains; scalable and unified.
 */