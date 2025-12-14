/**
 * useRoleAccess (LMS Production Hook)
 * ----------------------------------------------------------------------------
 * Centralized role-checking access logic for LMS frontend.
 * - Handles both user.role (string) and user.roles (array).
 * - Safely returns memoized helpers to check single, any, or all roles.
 * - No sample/demo code; globally composable for UI and logic branching.
 *
 * Usage (example):
 *   const { hasRole, hasAnyRole, hasAllRoles } = useRoleAccess();
 *   if (hasAnyRole(['admin', 'staff'])) { ... }
 */

import { useMemo } from 'react';

import { useAuth } from './useAuth';

/**
 * Normalize user role(s) into string array.
 * Supports user.role and user.roles (array of string/number).
 */
function normalizeRoles(user) {
  if (!user) return [];
  const { role, roles } = user;

  if (Array.isArray(roles) && roles.length > 0) {
    return roles.map(String);
  }
  if (role) {
    return [String(role)];
  }
  return [];
}

export function useRoleAccess() {
  const { user } = useAuth();

  // Memoized user role list
  const userRoles = useMemo(() => normalizeRoles(user), [user]);

  /**
   * Returns true if the user has exactly the specified single role.
   */
  const hasRole = (role) => userRoles.includes(String(role));

  /**
   * Returns true if user has at least one of roles in list.
   */
  const hasAnyRole = (roleList = []) => {
    if (!Array.isArray(roleList) || roleList.length === 0) return false;
    return roleList.some((role) => userRoles.includes(String(role)));
  };

  /**
   * Returns true if user has all roles in the provided list.
   */
  const hasAllRoles = (roleList = []) => {
    if (!Array.isArray(roleList) || roleList.length === 0) return false;
    return roleList.every((role) => userRoles.includes(String(role)));
  };

  return {
    user,           // Raw user object from global auth
    roles: userRoles, // Array of roles (normalized)
    hasRole,        // (role)     => Boolean
    hasAnyRole,     // (roles[])  => Boolean
    hasAllRoles,    // (roles[])  => Boolean
  };
}

/**
 * Production/Architecture Notes:
 * - Unified role API: always returns array, never null/undefined.
 * - Has no local/sample/demo code; ready for branching, guards, UI, or logic checks.
 * - Safe for any backend user/role contract.
 */