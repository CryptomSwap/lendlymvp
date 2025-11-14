"use server";

import { PrismaClient, Role } from "@prisma/client";
import { hasRole } from "@/lib/auth/roles";

const prisma = new PrismaClient();

export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true },
    });

    return hasRole(user, Role.ADMIN);
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

export async function requireAdmin(userId: string) {
  const isAdmin = await checkAdminRole(userId);
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return true;
}

