"use server";

import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { hasRole, hasAnyRole } from "./roles";

/**
 * Require a specific role - throws if user doesn't have it
 */
export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  if (!hasRole(user, role)) {
    throw new Error(`Unauthorized: ${role} role required`);
  }
  return user;
}

/**
 * Require any of the specified roles - throws if user doesn't have any
 */
export async function requireAnyRole(roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  if (!hasAnyRole(user, roles)) {
    throw new Error(`Unauthorized: One of the following roles required: ${roles.join(", ")}`);
  }
  return user;
}

