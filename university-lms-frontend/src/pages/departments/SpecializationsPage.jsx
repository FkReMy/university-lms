/**
 * SpecializationsPage Component (Production)
 * ----------------------------------------------------------------------------
 * Admin/staff page showing academic specializations/minors, with search/filter.
 * - Lists all specializations (table view).
 * - Allows filtering by name/code and department.
 * - All controls use global design-system components.
 * - Hooks and actions ready for expansion (add/edit/remove).
 * - No sample/demo logic; calls real backend API.
 *
 * Usage:
 *   <Route path="/specializations" element={<SpecializationsPage />} />
 */

import { useEffect, useMemo, useState, useCallback } from 'react';

import styles from './SpecializationsPage.module.scss';

import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import specializationApi from '@/services/api/specializationApi'; // Must provide .list()

export default function SpecializationsPage() {
  // Global state for specializations and UI filters
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load all specializations from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchSpecializations() {
      setLoading(true);
      try {
        const data = await specializationApi.list(); // backend call should return array
        if (isMounted) setSpecializations(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setSpecializations([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSpecializations();
    return () => { isMounted = false; };
  }, []);

  // Departments for dropdown filter
  const departments = useMemo(
    () => [...new Set(specializations.map(s => s.department))].filter(Boolean).sort(),
    [specializations]
  );

  // Filtered list based on search/dept filter
  const filteredSpecializations = useMemo(
    () =>
      specializations.filter(spec => {
        const matchesName =
          spec.name?.toLowerCase().includes(search.toLowerCase()) ||
          spec.code?.toLowerCase().includes(search.toLowerCase());
        const matchesDept = department === "all" || spec.department === department;
        return matchesName && matchesDept;
      }),
    [specializations, search, department]
  );

  // Ready-to-implement handlers for add/edit/remove
  const handleAdd = useCallback(() => {
    // TODO: Implement add specialization dialog/modal
  }, []);
  const handleEdit = useCallback((id) => {
    // TODO: Implement edit logic/modal
  }, []);
  const handleRemove = useCallback((id) => {
    // TODO: Implement remove logic/modal
  }, []);

  return (
    <div className={styles.specializationsPage}>
      <h1 className={styles.specializationsPage__title}>Specializations</h1>
      <div className={styles.specializationsPage__controls}>
        <Input
          className={styles.specializationsPage__search}
          type="text"
          placeholder="Search by spec. name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className={styles.specializationsPage__departmentSelect}
          value={department}
          onChange={e => setDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dep => (
            <option value={dep} key={dep}>{dep}</option>
          ))}
        </Select>
        <Button
          className={styles.specializationsPage__addBtn}
          type="button"
          variant="primary"
          onClick={handleAdd}
        >
          + Add Specialization
        </Button>
      </div>
      <div className={styles.specializationsPage__listArea}>
        {loading ? (
          <div className={styles.specializationsPage__loading}>
            Loading specializations…
          </div>
        ) : filteredSpecializations.length === 0 ? (
          <div className={styles.specializationsPage__empty}>
            No specializations found.
          </div>
        ) : (
          <table className={styles.specializationsPage__table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Head</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecializations.map(spec => (
                <tr key={spec.id}>
                  <td>{spec.name}</td>
                  <td>{spec.code}</td>
                  <td>{spec.department}</td>
                  <td>{spec.head}</td>
                  <td>{spec.students}</td>
                  <td>
                    <Button
                      className={styles.specializationsPage__actionBtn}
                      type="button"
                      size="sm"
                      variant="outline"
                      title="Edit specialization"
                      onClick={() => handleEdit(spec.id)}
                    >Edit</Button>
                    <Button
                      className={styles.specializationsPage__actionBtn}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(spec.id)}
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
 * - Hooks up to unified design-system: Input, Select, Button.
 * - All state is backend-driven; NO mock/sample logic included now.
 * - Ready for future mutation handlers (add/edit/remove).
 * - Clean, scalable code for real LMS management views.
 */