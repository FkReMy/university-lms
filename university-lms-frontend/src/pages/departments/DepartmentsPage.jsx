/**
 * DepartmentsPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin/staff view for listing and managing university departments.
 * - Shows all departments in unified table view.
 * - Filters by department name/code and school.
 * - Global design-system components only; no sample/demo logic.
 * - All controls ready for extension: add/edit/delete.
 * 
 * Usage:
 *   <Route path="/departments" element={<DepartmentsPage />} />
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './DepartmentsPage.module.scss';

import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import departmentApi from '@/services/api/departmentApi'; // Must provide .list()

export default function DepartmentsPage() {
  // State for department list and filters
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [school, setSchool] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch all departments from the backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchDepartments() {
      setLoading(true);
      try {
        const data = await departmentApi.list();
        if (isMounted) setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setDepartments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDepartments();
    return () => { isMounted = false; };
  }, []);

  // List of unique schools for dropdown filter
  const schools = useMemo(
    () => [...new Set(departments.map(dep => dep.school))].filter(Boolean).sort(),
    [departments]
  );

  // Filter departments on search and school filter
  const filteredDepartments = useMemo(
    () =>
      departments.filter(dep => {
        const matchesName =
          dep.name?.toLowerCase().includes(search.toLowerCase()) ||
          dep.code?.toLowerCase().includes(search.toLowerCase());
        const matchesSchool = school === "all" || dep.school === school;
        return matchesName && matchesSchool;
      }),
    [departments, search, school]
  );

  // Handlers for future extension (add/edit/remove)
  const handleAdd = useCallback(() => {
    // TODO: Implement add department modal/dialog
  }, []);
  const handleEdit = useCallback((id) => {
    // TODO: Implement edit department logic/modal
  }, []);
  const handleRemove = useCallback((id) => {
    // TODO: Implement remove department logic/modal
  }, []);

  return (
    <div className={styles.departmentsPage}>
      <h1 className={styles.departmentsPage__title}>Departments</h1>
      <div className={styles.departmentsPage__controls}>
        <Input
          className={styles.departmentsPage__search}
          type="text"
          placeholder="Search by dept. name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.departmentsPage__schoolSelect}
          value={school}
          onChange={e => setSchool(e.target.value)}
        >
          <option value="all">All Schools</option>
          {schools.map(sch => (
            <option value={sch} key={sch}>{sch}</option>
          ))}
        </Select>
        <Button
          className={styles.departmentsPage__addBtn}
          type="button"
          variant="primary"
          onClick={handleAdd}
        >
          + Add Department
        </Button>
      </div>
      <div className={styles.departmentsPage__listArea}>
        {loading ? (
          <div className={styles.departmentsPage__loading}>
            Loading departments…
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className={styles.departmentsPage__empty}>
            No departments found.
          </div>
        ) : (
          <table className={styles.departmentsPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>School</th>
                <th>Head</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dep => (
                <tr key={dep.id}>
                  <td>{dep.name}</td>
                  <td>{dep.code}</td>
                  <td>{dep.school}</td>
                  <td>{dep.head}</td>
                  <td>{dep.courses}</td>
                  <td>
                    <Button
                      className={styles.departmentsPage__actionBtn}
                      type="button"
                      size="sm"
                      variant="outline"
                      title="Edit department"
                      onClick={() => handleEdit(dep.id)}
                    >Edit</Button>
                    <Button
                      className={styles.departmentsPage__actionBtn}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(dep.id)}
                    >Remove</Button>
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
 * - Real API integration via departmentApi.list().
 * - All UI is unified via global Input, Select, Button.
 * - No sample/mock data; all state/data are backend-driven.
 * - Ready for global modal/dialog logic for add/edit/remove.
 */