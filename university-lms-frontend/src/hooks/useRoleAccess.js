/**
 * Role access helper hook for the LMS frontend.
 * ----------------------------------------------------------
 * Responsibilities:
 * - Provide memoized helpers to check user roles.
 * - Handle both `user.role` (string) and `user.roles` (array) shapes.
 * - Return booleans so components can branch rendering/logic safely.
 *
 * Typical usage:
 *   const { hasRole, hasAnyRole, hasAllRoles } = useRoleAccess();
 *
 *   if (hasAnyRole(['admin', 'instructor'])) {
 *     // render privileged UI
 *   }
 */

import { useMemo } from 'react';

import { useAuth } from './useAuth';

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

  const userRoles = useMemo(() => normalizeRoles(user), [user]);

  const hasRole = (role) => userRoles.includes(String(role));

  const hasAnyRole = (roleList = []) => {
    if (!Array.isArray(roleList) || roleList.length === 0) return false;
    return roleList.some((role) => userRoles.includes(String(role)));
  };

  const hasAllRoles = (roleList = []) => {
    if (!Array.isArray(roleList) || roleList.length === 0) return false;
    return roleList.every((role) => userRoles.includes(String(role)));
  };

  return {
    user,
    roles: userRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}