import { Role } from "@prisma/client";

/**
 * Parse roles from JSON string stored in database
 */
export function parseRoles(rolesString: string | null | undefined): Role[] {
  if (!rolesString) return ["USER"];
  try {
    const parsed = JSON.parse(rolesString);
    return Array.isArray(parsed) ? parsed : ["USER"];
  } catch {
    return ["USER"];
  }
}

/**
 * Serialize roles array to JSON string for database storage
 */
export function serializeRoles(roles: Role[]): string {
  return JSON.stringify(roles);
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: { roles: string | Role[] } | null, role: Role): boolean {
  if (!user) return false;
  const roles = typeof user.roles === "string" ? parseRoles(user.roles) : user.roles;
  return roles.includes(role);
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(
  user: { roles: string | Role[] } | null,
  roles: Role[]
): boolean {
  if (!user) return false;
  const userRoles = typeof user.roles === "string" ? parseRoles(user.roles) : user.roles;
  return roles.some((role) => userRoles.includes(role));
}

